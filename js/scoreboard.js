class Summary {
    static get colors() {return ['red', 'green', 'yellow'];}
    
    constructor(red = 0, yellow = 0, green = 0, gray = 0) {
        this.ired =red;
        this.iyellow = yellow;
        this.igreen = green;
        this.igray = gray;
    }
    
    get green() {
        return this.igreen;
    }

    get red() {
        return this.ired;
    }

    get yellow() {
        return this.iyellow;
    }
    
   
    add(another) {
        if (typeof another === 'object') {
            this.ired += another.red;
            this.igreen += another.green;
            this.iyellow += another.yellow;
            this.igray += another.gray;
        }
        if (typeof another === 'string') {
            this['i'+another] += 1;
        }
    }
    
    getView() {
        const bgColors = {
            red: '#FF9999',
            green: '#99FF99',
            yellow: '#99FFFF'
        };
        const fgColors = {
            red: '#AA0000',
            green: '#00AA00',
            yellow: '#00AAAA'
        };
        let root = document.createElement('span');
        for (let color of Summary.colors) {
            let item = document.createElement('span');
            item.setAttribute('class', 'summary-set summary-set-'+color);
            item.style.backgroundColor = bgColors[color];
            item.style.color = fgColors[color];
            item.innerHTML = this['i'+color];
            root.appendChild(item);
        }
        return root;
    }
}


/**
 * Creates scoreboard from input JSON data
 */

class Scoreboard {

  static getFullScreenLink(id, html_id, coursekey) {
    return `scoreboard.html?id=${encodeURIComponent(id)}&html_id=${encodeURIComponent(html_id)}&coursekey=${coursekey}`;
  }

  static createTable(courseData, exercises, table_id, course, chapters) {
    const keys = {
      "green": 0,
      "yellow": 1,
      "red": 2,
      "gray": 3
    };

    const scheduleColors = ['#ffffff', '#da9887', '#87b2da', '#c4da87', '#f9bb81', '#eae981'];

    let id = Math.random().toString(36).substring(7);

    let scoreboard = view.createScoreboardFrame(id);
    
    for (let chapter of chapters) {
        if (chapter !== undefined) {
            let item = view.createChapterHeader(chapter.name, chapter.exercises.length);
            let t = scoreboard.querySelector('tr.chapterNames');
            console.log(t);
                    t.appendChild(item);
            for (let exercise of chapter.exercises) {
                let eItem = view.createExercise(exercise.displayNumber);
                scoreboard.querySelector('tr.exerciseNumbers').appendChild(eItem);
            }
            item = view.createExercise('&Sigma;')
            scoreboard.querySelector('tr.exerciseNumbers').appendChild(item);
        }
    }
/*
    for (let i in exercises) {
      let item = view.createExercise(exercises[i].displayNumber);
      scoreboard.querySelector('tr.exerciseNumbers').appendChild(item);
    }
*/
    //let body = document.createElement('tbody');
    //scoreboard.appendChild(body);
    

    for (let student of courseData) {      
      //let student = courseData[j];
      let studentSummary = new Summary();     

      let row = view.createName(student.user);
      for (let chapter of chapters) {
        if (chapter !== undefined) {
            let chapterSummary = new Summary();  

            for (let correctExercise of chapter.exercises) {
              //let correctExercise = exercises[k]; TÄSSÄ OLI LOGIIKKAVIRHE ALKUPERÄISESSÄ KOODISSA
              let exercise = student.exercises.filter(function (obj) {
                return obj.id == correctExercise.id;
              });
              if (exercise.length === 1) { // on suorittanut harjoituksen
                let checkmark;
                if(student.color === undefined) {
                  checkmark = view.createCheckmark(keys[exercise[0].status], exercise[0].status, student.user, correctExercise.displayNumber);            
                  chapterSummary.add(exercise[0].status);
                } else {
                  checkmark = view.createScheduleMark(scheduleColors[student.color], exercise[0].status, student.user, correctExercise.displayNumber);
                }
                row.appendChild(checkmark);
              } else {    // ei ole tehnyt harjoitusta
                let checkmark = view.createCheckmark(3, 'gray', student.user, correctExercise.displayNumber);
                row.appendChild(checkmark);          
              }
            }
            row.appendChild(view.createChapterSummary(chapterSummary.getView()));
            studentSummary.add(chapterSummary); 
        }
      }
      row.appendChild(view.createTotalSummary(studentSummary.getView()));
      if (student.color != undefined) {
        scoreboard.querySelector('tfoot').appendChild(row);
      } else {
        scoreboard.querySelector('tbody').appendChild(row);        
      }
    }
    
    
    $('div[id=checkmarkTable' + table_id + ']').html(scoreboard);

    if (window.location.pathname.includes("/kurssihallinta.html")) {
      let fullScreenLink = Scoreboard.getFullScreenLink(course.id, course.html_id, course.coursekey);
      $('div[id=checkmarkTable' + table_id + ']').prepend(view.createFullScreenButton('id', fullScreenLink));
    } else {
      if (!window.location.pathname.includes("/omat_kurssit.html")) {
        $('div[id=checkmarkTable' + table_id + ']').prepend(view.createCloseButton());
      }    
    }

    let alertID = "#loadingAlert" + table_id;
    $(alertID).hide();

    $('[data-toggle="tooltip"]').tooltip();
    
    // make table sortable
    if (table_id.length > 1 && courseData.length > 1 && !window.location.pathname.includes('/omat_kurssit.html')) {
      let nto = document.getElementById(id);
      sorttable.makeSortable(nto);
    }
  }

  getPageData(course_id) {
    // Using jQuery AJAX because backend.js can only communicate with backend URL
    return $.ajax({
      url: FRONTEND_BASE_URL + `kurssit/${course_id}/print.html`,
      success: function (result) {
        return result;
      },
      error: function () {
        console.warn("Could not retrieve course page");
      }
    });
  }

  static createScoreboard(pageData, data, course) {
    let {exercises, chapters} = Exercises.extractExercises(pageData);
    this.createTable(data.students, exercises, data.coursekey, course, chapters);
  }
  
  static createCsvTable(courseData, exercises, table_id, course, chapters) {
      
  }

  static validateScoreboardData(data) {
    let amount = [];
    for (let i in data.students) {
      let item = data.students[i];
      amount.push(item.exercises.length);
    }
    // testaa, että kaikkien pituus on sama. Miksi?
    return amount.every( (val, i, arr) => val == arr[0] );
  }

  static displayError(course, data) {
    $(`#loadingAlert${course.coursekey}`).removeClass('alert-info').addClass('alert-danger');
    $(`#loadingAlert${course.coursekey} strong`).html('Virhe! Tulostaulua ei pystytty lataamaan.');
    console.warn(data + ": Could not get scoreboard.");
  }

  init(data, key) {
    let course = {};
    for (let i in data) {
      let c = data[i];
      if (c.coursekey == key) {
        course = c;
      }
    }

    let url = `courses/${course.id}/scoreboard`;

    if (window.location.pathname.includes("/omat_kurssit")) {
      url = `students/${Session.getUserId()}/courses/${course.id}/scoreboard`;
    }
    // Huom! Unoptimized fetching?! Why? --> Simultaneus fetching rather
    let pageDataFetch = this.getPageData(course.html_id);
    let scoreboardFetch = backend.get(url);
    Promise.all([pageDataFetch, scoreboardFetch])
            .then(values => {
       let pageData = values[0];
       let data = values[1];
                if (Scoreboard.validateScoreboardData(data)) {
                  Scoreboard.createScoreboard(pageData, data, course);                  
                } else {
                  Scoreboard.displayError(course, data);
                }       
    })    .catch(data => {
        Scoreboard.displayError(course, data);
    });
    /* 
    this.getPageData(course.html_id)
      .then(
        function fulfilled(pageData) {
          backend.get(url)
            .then(
              function fulfilled(data) {
                if (Scoreboard.validateScoreboardData(data)) {
                  Scoreboard.createScoreboard(pageData, data, course);                  
                } else {
                  Scoreboard.displayError(course, data);
                }
              },
              function rejected(data) {
                Scoreboard.displayError(course, data);
              }
            );
        },
        function rejected() {

        }
        
      );*/
  }

}

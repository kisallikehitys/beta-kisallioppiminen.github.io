class ScheduleManager {

  constructor() {
    let obj = this;

    let openScheduleButton = document.getElementById('open-schedule-modal');
    openScheduleButton.onclick = function() {
      obj.getSchedule(button.getCourseID());
    };

    let createScheduleButton = document.getElementById('create-schedule');
    createScheduleButton.onclick = function() {
      obj.createSchedule(button.getCourseID());
    };
  }

  createSchedule(courseId) {
    let obj = this;

    let colors = new Map();
    colors.set('option-brown', 1);
    colors.set('option-blue', 2);
    colors.set('option-green', 3);
    colors.set('option-orange', 4);
    colors.set('option-yellow', 5);

    let formData = $('#create-schedule-form').serializeArray();
    let jsonData = {
      'name': formData[0].value,
      'color': colors.get(formData[1].value)
    };

    let info = document.getElementById('schedule-footer-info');
    info.innerHTML = 'Uutta tavoitetta luodaan...';

    backend.post(`courses/${courseId}/schedules/new`, jsonData)
      .then(
          function fulfilled() {
            info.innerHTML = 'Tavoite luotu!';
            obj.getSchedule(button.getCourseID());
            console.log('New schedule was created!');
          },
          function rejected() {
            info.innerHTML = 'Tavoitteen luominen epäonnistui.';
            console.log('could not create new schedule');
          });
  }

  getSchedule(courseId) {
    backend.get(`courses/${courseId}/schedules`)
      .then(
          function fulfilled(data) {

            view.clearScheduleManagerColor();

            let colors = ['brown', 'blue', 'green', 'orange', 'yellow'];
            let isReserved;

            for (let i = 0; i < colors.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (data[j].color - 1 == i) {
                  view.createScheduleColorSection(colors[i], data[j].name);
                  isReserved = true;
                }
              }
              if (!isReserved) {
                view.createScheduleColorSection(colors[i]);
              }
              isReserved = false;
            }

            console.log('Got schedule:' + data);

          },
          function rejected() {
            console.log('could not get schedule');
          });
  }

  deleteSchedule(scheduleId) {

  }

}

let schedulemanager = new ScheduleManager();

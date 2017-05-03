class ScheduleManager {

  constructor() {
    let button = document.getElementById('open-schedule-modal');
    let obj = this;
    button.onclick = function() {
      obj.init();
    };
  }

  // get schedules from server
  // use dummy for now
  init() {

    view.clearScheduleManagerColor();

    let colors = ['brown', 'blue', 'green', 'orange', 'yellow'];

    // returns Map
    // function getDummyData() {
    let schedules = new Map();
    schedules[1] = "Ensimmäinen setti";
    schedules[3] = "kolmas setti";
      // return schedules;

      // let schedules = [{
      //   "name": "Ensimmäinen setti",
      //   "color": 1
      // },
      // {
      //   "name": "Toinen setti",
      //   "color": 2
      // }];
      // return schedules;
    // }

    // get this from backend
    // let schedules = getDummydata();

    for (let i = 0; i < colors.length; i++) {
      // view.createScheduleColorSection(schedules.hasOwnProperty(i+1));
      let scheduleName;
      if (schedules.hasOwnProperty(i+1)) {
        scheduleName = schedules[i+1];
      }
      view.createScheduleColorSection(colors[i], scheduleName);
    }

  }

  createSchedule(courseId) {

    let data = [
    {'name': 'Alin mahdollinen arvosana'},
    {'color': '2'}
    ];

    backend.post(`courses/${courseId}/schedules/new`, data)
      .then(
          function fulfilled() {
            console.log('New schedule was created!');
          },
          function rejected() {
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

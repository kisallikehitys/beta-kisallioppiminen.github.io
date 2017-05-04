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

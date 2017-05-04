const view = new View();
const backend = new Backend();

Session.init();

let schedulemanager;

window.onload = function() {

  if (button._isTeacherCourse()) {
    schedulemanager = new ScheduleManager();
  }

  view.showNavigation();

}

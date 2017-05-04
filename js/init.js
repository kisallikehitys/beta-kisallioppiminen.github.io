const view = new View();
const backend = new Backend();

Session.init();

let schedulemanager;
if (button._isTeacherCourse()) {
  schedulemanager = new ScheduleManager();
}

window.onload = function() {

  view.showNavigation();

}

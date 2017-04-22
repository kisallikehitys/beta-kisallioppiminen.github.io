class GoalCheckbox {

  /**
   * Adds goal checkboxes to each exercise
   */
  static addGoalCheckboxes() {
    console.log('_addGoalCheckboxes');
    //const obj = this;
    $(".checkbox-group").each(function (index, value) {
      let checkbox1 = view.createCheckbox('1', 'green');
      this.appendChild(checkbox1);

      let checkbox2 = view.createCheckbox('2', 'orange');
      this.appendChild(checkbox2);

      let checkbox3 = view.createCheckbox('3', 'purple');
      this.appendChild(checkbox3);
    });
    console.log('endGoalTest');
  }

  static createSampleSchedule() {
    var sampleGoalGreen = {
      id : 1,
      name : "GreenSchedule",
      color : 1,
      exercises :
        ["421bb053-5806-4ef2-afe1-03d628afb679", "a421458d-aedf-4f9f-a2c9-b01d7a2878a8"]
    };

    var sampleGoalOrange = {
      id : 2,
      name : "OrangeSchedule",
      color : 2,
      exercises :
        ["421bb053-5806-4ef2-afe1-03d628afb679"]
    };

    return [sampleGoalGreen, sampleGoalOrange];
  }

  /**
   * Set checkmarks as "checked" according to checkmarks
   * @param checkmarks
   */
  static setTicksToCheckmarks(allCheckmarks) {
    console.log(allCheckmarks);
    allCheckmarks.forEach(function(schedule) {
      schedule.exercises.forEach(function (exerciseId) {
        console.log(exerciseId);
        console.log($("#" + exerciseId).find(".checkbox-group"));
      })
    });
    console.log($(".checkbox-bootstrap.checkbox-green.checkbox-lg").find("input").prop('checked', true));
    console.log("kaikki checkeded");
  }
}

$(document).ready(function () {
  if (window.location.pathname.includes("/kurssit") && Session.getUserId() !== undefined) {
    if (document.getCookie('teacher') === 'true') {
      GoalCheckbox.addGoalCheckboxes();
    }
  }

  GoalCheckbox.setTicksToCheckmarks(GoalCheckbox.createSampleSchedule());
});
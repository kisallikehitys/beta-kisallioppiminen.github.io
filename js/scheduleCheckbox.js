class ScheduleCheckbox {

  static renderScheduleCheckboxes() {
    //todo: render according to schedule data
    let listOfCurrentSchedules = ScheduleCheckbox._createSampleSchedule()
    ScheduleCheckbox._renderEmptyCheckboxesForSchedules(listOfCurrentSchedules);
    ScheduleCheckbox._populateScheduleCheckboxes(listOfCurrentSchedules);
  }

  /**
   * Adds goal checkboxes to each exercise
   */
  static _renderEmptyCheckboxesForSchedules(listOfCurrentSchedules) {
    listOfCurrentSchedules.forEach(function(scheduleObject) {
      let colorString = ScheduleCheckbox._convertColorIdToColorString(scheduleObject.color);
      let scheduleId = scheduleObject.id;
      view.renderEmptyCheckboxesForOneSchedule(scheduleId, colorString);
    });
  };



  /**
   * Set checkmarks as "checked" according to current scheduleData
   * @param listOfCurrentSchedules: list of current schedule objects
   */
  static _populateScheduleCheckboxes(listOfCurrentSchedules) {
    listOfCurrentSchedules.forEach(function(scheduleObject) {
      scheduleObject.exercises.forEach(function (exerciseUUID) {
        let checkboxElement = ScheduleCheckbox._getExerciseCheckboxObject(exerciseUUID, scheduleObject.color);
        ScheduleCheckbox._setCheckboxChecked(checkboxElement);
      })
    });
  }

  /**
   * Get a checkbox element of a exercise
   * @param exerciseId (uuid)
   * @param colorId (integer)
   * @returns jQuery object: <div class="checkbox-bootstrap...">
   */
  static _getExerciseCheckboxObject(exerciseId, colorId) {
    let colorString = ScheduleCheckbox._convertColorIdToColorString(colorId);
    return $("#" + exerciseId).find(".checkbox-bootstrap.checkbox-" + colorString + ".checkbox-lg");
  }

  /**
   * Set a checkbox as 'checked'
   * @param exerciseId (uuid)
   * @param goalColorId (integer)
   */
  static _setCheckboxChecked(checkboxElement) {
    checkboxElement.find("input").prop('checked', true);
  }

  /**
   * Convert color id to string
   * @param colorId (integer)
   * @returns corresponding color in english
   */
  static _convertColorIdToColorString(colorId) {
    let colorStringsForColorIds = {
      1: "brown", //#da9887
      2: "blue", //#87b2da
      3: "green", //#c4da87
      4: "orange", //#f9bb81
      5: "yellow" //#eae981
    };
    return colorStringsForColorIds[colorId];
  }

  /**
   * Creates a sample list of schedules
   * @returns List of schedule objests
   * @private
   */
  static _createSampleSchedule() {
    let sampleScheduleGoalGreen = {
      id : 3,
      name : "GreenSchedule",
      color : 3,
      exercises :
        ["421bb053-5806-4ef2-afe1-03d628afb679",
          "a421458d-aedf-4f9f-a2c9-b01d7a2878a8",
          "ec569649-1589-42ca-9625-2233e27c1350"]
    };

    let sampleScheduleGoalOrange = {
      id : 4,
      name : "OrangeSchedule",
      color : 4,
      exercises :
        ["ec569649-1589-42ca-9625-2233e27c1350"]
    };

    return [sampleScheduleGoalGreen, sampleScheduleGoalOrange];
  }
}

$(document).ready(function () {
  if (window.location.pathname.includes("/kurssit") && Session.getUserId() !== undefined) {
    if (document.getCookie('teacher') === 'true') {
      ScheduleCheckbox.renderScheduleCheckboxes();
    }
  }
  //console.log("EDIT VERSION: a");
});
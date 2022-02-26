const fetch = require("node-fetch");

/**
 * 
 * @param {Object} course Course object
 * @param {String} date Formatted YYYY-MM-DD
 * @param {String} comment The comment when scheduling. Defaults to "Fill Slot"
 * @param {String} token The EnrichingStudents Token
 */
let scheduleCourse = async (course, date, comment, token) => {
    let saveAppointmentUrl = "https://student.enrichingstudents.com/v1.0/appointment/save"

    let requestPayload = {
        "courseId": course.courseId,
        "periodId": 1,
        "scheduleDate": date,
        "schedulerComment": comment || "Fill Slot"
    }

    // Includes application token
    let headers = {
        "Host": "student.enrichingstudents.com",
        "Connection": "keep-alive",
        "Accept": "application/json",
        "ESAuthToken": token,
        "Content-Type": "application/json;charget=UTF-8"
    }

    let options = {
        method: 'post',
        body: JSON.stringify(requestPayload),
        headers,
    }

    const completed = (json) => {
        return json;
    }

    const saveData = await fetch(saveAppointmentUrl, options)
    let saveJson = saveData.json()

    return saveJson;
}

module.exports.scheduleCourse = scheduleCourse;
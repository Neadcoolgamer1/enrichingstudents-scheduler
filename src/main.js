const fetch = require("node-fetch");
const { getOpenCourses } = require("./getOpenCourses");
const { scheduleCourse } = require("./scheduleCourse");

/**
 * 
 * @param {String} date Today's Date
 * @param {String} token ESAuthToken
 * @param {Array} wantedCourses The template for the courses wanted
 * @param {Number} weeksahead Number, 1 will schedule 1 weak ahead, 2 will schedule 2 weeks ahead, etc
 * @returns {Object}
 */
const main = (date, token, wantedCourses, weeksahead, fallbackTeachers) => {
    return new Promise(function (myResolve, myReject) {
        console.log(fallbackTeachers)
        var startTime = performance.now()

        let requestPayload = {
            "periodId": 1,
            "startDate": date
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

        // The url to Get all available courses
        let getCoursesURL = "https://student.enrichingstudents.com/v1.0/course/forstudentscheduling"

        function dates(current) {
            var week = new Array();
            // Starting Monday not Sunday
            current.setDate((current.getDate() - current.getDay() + 1));
            for (var i = 0; i < 7; i++) {
                week.push(
                    new Date(current).toISOString().split('T')[0]
                );
                current.setDate(current.getDate() + 1);
            }
            return week;
        }

        function nextweek(howmany) {
            var today = new Date();
            var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (howmany * 7));
            return nextweek;
        }

        let weeks = [];
        // Loops throught the ammount of weeks ahead the user wanted to schedule, and pushes those weeks into the weeks array
        for(let i = 0; i < weeksahead; i++){
            weeks.push(dates(nextweek(i)).slice(0, -2))
        }


        let scheduleStatus = {};

        fetch(getCoursesURL, options)
            .then(res => res.json())
            .then(async (json) => {
                console.log('Fetched all avaiable courses!')
                let courses = getOpenCourses(json, wantedCourses)
                let courseStaff = [];
                let formattedCourses = [];
                let errors = [];

                courses.forEach((course) => {
                    courseStaff.push(course.staffLastName)
                })

                // This formats the formattedCourses array with the same layout of wantedCourses array, but intead of just the staffLastName its the entire course object.
                wantedCourses.forEach((course) => {
                    if (courseStaff.indexOf(course) !== -1) {
                        formattedCourses.push(courses[courseStaff.indexOf(course)]);
                    } else {
                        //Put null in the array if the teacher isnt avaliable. this will be handled later.
                        formattedCourses.push(null);
                    }
                })
                console.log("Formatted courses!")

                console.log("Scheduling....")
                // Loop through the ammount of weeks the user provided
                for (let currentWeek = 0; currentWeek < weeks.length; currentWeek++){

                    for (let i = 0; i < formattedCourses.length; i++) {

                        if (weeks[currentWeek][i]) {

                            let res = await scheduleCourse(formattedCourses[i], weeks[currentWeek][i], "Fill slot", token);
                            scheduleStatus[weeks[currentWeek][i]] = res
                            if(res.appointmentEditorResponse !== 1) errors.push(res)

                            if(res.appointmentEditorResponse === -5) {
                                console.log(`Couldnt schedule ${weeks[currentWeek][i]} (Class is full). Trying Fallback`)
                                for (let teacher of fallbackTeachers) {
                                    if(courseStaff.indexOf(teacher) != -1) {
                                        let res = await scheduleCourse(formattedCourses[courseStaff.indexOf(teacher)], weeks[currentWeek][i], "Fill slot", token);
                                        scheduleStatus[weeks[currentWeek][i]] = res
                                        if(res.appointmentEditorResponse !== 1) errors.push(res); console.log(`Fallback teacher ${teacher} failed.`)
                                    } else {
                                        console.log(`Fallback teacher ${teacher} failed.`)
                                    }
                                }
                            }

                        }
                    }
                }

                var endTime = performance.now()

                console.log(`Completed scheduling! It took ${((endTime - startTime) / 1000).toFixed(2)}s, had ${errors.length} errors, and scheduled ${Object.keys(scheduleStatus).length - errors.length} classes all the way from ${Object.keys(scheduleStatus)[0]} to ${Object.keys(scheduleStatus)[Object.keys(scheduleStatus).length - 1]}`)

                myResolve(scheduleStatus);
            })
    })
}

module.exports.main = main;


/**
* 
* @param {Object} json The json returned from the fetch
* @returns {Array} The final availiable courses
*/
let getOpenCourses = (json, wantedCourses) => {
    // Every course fetched is put into this array
    let courses = [];

    // Only active and open courses are put into this array
    let availiableCourses = [];

    // The final array which is filled with the wanted courses, and are open.
    let finalCourses = [];

    // Put courses into the array
    courses = json.courses

    // Loop through each to check if they are open and available
    courses.forEach((course) => {
        if (course.isOpenForScheduling && course.isActive && course.blockedReason === null) {
            if (course.maxNumberStudents - course.numberOfAppointments > 0) {
                // Put all available courses into the availiableCourses array.
                availiableCourses.push(course)
            }
        }
    })


    // Loop through once again to get the courses the user requested.
    availiableCourses.forEach((course) => {
        if (wantedCourses.includes(course.staffLastName)) {
            finalCourses.push(course)
        }
    })

    return finalCourses;
}

module.exports.getOpenCourses = getOpenCourses;
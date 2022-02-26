var argv = require('minimist')(process.argv.slice(2));

if(!argv.template) {
    return console.log("You must provide a template!")
}


if(argv.template && argv.template.split(",").length !== 5) {
    return console.log("Template must be 5 teachers!")
}

if(!argv.fallback) {
    return console.log("You must provide fallback teachers!")
}

if(!argv.token) {
    return console.log("You must provide a token!")
}

if(!argv.weeks) {
    return console.log("You much provide how many weeks ahead I should schedule!")
}

const { main } = require("./src/main.js")

let yourDate = new Date()
const offset = yourDate.getTimezoneOffset()
yourDate = new Date(yourDate.getTime() - (offset*60*1000))
let date = yourDate.toISOString().split('T')[0]

main(date, argv.token, argv.template.split(","), argv.weeks, argv.fallback.split(","))
    .then((res) => {
        for (const date in res) {
            if(res[date].appointmentEditorResponse !== 1) {
                console.log(`WARNING! Couldn't schedule ${date} because ${res[date].errorMessages.join(" ")}`)
            }
        }
    })


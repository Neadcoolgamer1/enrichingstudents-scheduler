# enrichingstudents-scheduler

enrichingstudents-scheduler is a script that automatically schedules my classes for me. 
It's pretty specialized to my school, so you would need to change it to your needs.

## Installation

Clone the repository and go into the folder.
## Usage

```bash
node index.js  \
--template teachersLastName, \
teachersLastName, \
teachersLastName, \
teachersLastName, \
teachersLastName, \
--fallback otherTeachersLastName,otherTeachersLastName \
--weeks ammountOfWeeksAheadToSchedule \
--token enrichingStudentsToken \
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
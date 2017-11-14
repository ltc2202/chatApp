var moment = require('moment');

// date.add(1,'year').subtract(8, 'months');
// console.log(date.format('MMM Do, YYYY'));



var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'))

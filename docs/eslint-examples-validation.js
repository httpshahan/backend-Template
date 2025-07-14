/**
 * ESLint Examples Validation
 * This file contains the CORRECT examples from our documentation
 * to ensure they actually pass our ESLint rules.
 */

// Mock dependencies for examples
const express = require('express');
const app = express();

// Function spacing - CORRECT
function getData(a, b) {
  const result = a + b;
  const data = 'sample';
  const status = 'ok';
  return { data, status, result };
}

// Quote consistency - CORRECT
const message = 'Hello, world!';
const user = 'John Doe';

// Object formatting - CORRECT
const userObj = { name: 'John', age: 30 };
const items = [1, 2, 3];

// Control structures - CORRECT
const condition = true;
function doSomething() {
  console.log('doing something');
}
function doSomethingElse() {
  console.log('doing something else');
}

if (condition) {
  doSomething();
} else {
  doSomethingElse();
}

// Variable naming - CORRECT
const API_URL = 'https://api.example.com';
let counter = 0;
counter++; // Use the variable to avoid unused warning

// Indentation - CORRECT
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// Use all our functions/variables to avoid unused warnings
console.log(getData(1, 2));
console.log(message, user);
console.log(userObj, items);
console.log(API_URL, counter);

/* INCORRECT EXAMPLES (commented out to avoid ESLint errors):

// Function spacing - INCORRECT  
// function getData () {
//   const result = a + b;
//   return {data, status};
// }

// Quote consistency - INCORRECT
// const message = "Hello, world!";
// const user = 'John Doe';

// Object formatting - INCORRECT
// const userObj = {name: 'John',age: 30,};
// const items = [1,2,3,];

// Control structures - INCORRECT
// if(condition){
//   doSomething();
// }else{
//   doSomethingElse();  
// }

// Variable naming - INCORRECT
// const api_url = 'https://api.example.com';
// let Counter = 0;

// Indentation - INCORRECT
// app.get('/users', (req, res) => {
// res.json({users: []});
// });

*/

module.exports = { getData, app };

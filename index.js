import express from 'express';
import Greet from './greeter.js';

const app = express();

const greet = Greet();
console.log(greet);

app.get('/greeted', function(req, res){
  //display all the users that have been greeted

  // Add a link from the "/greeted page" - where you can click on a user in the list to see how many time the user has been greeted.
});

app.get('/counter/:username', function(req, res){
  //show how many times a user has been greeted
  // Display a message like this: Hello, <USER_NAME> has been greeted <COUNTER> times.
});

let PORT = process.env.PORT || 3007;

app.listen(PORT, function(){
  console.log('Server started on port :', PORT);
});
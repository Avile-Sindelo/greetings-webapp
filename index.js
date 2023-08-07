import express from 'express';
import Greet from './greeter.js';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

const greet = Greet();
console.log(greet);

app.get('/', function(req, res){
  res.render('index');
});

app.get('/greeted', function(req, res){
  //display all the users that have been greeted

  // Add a link from the "/greeted page" - where you can click on a user in the list to see how many time the user has been greeted.
});

app.get('/counter/:username', function(req, res){
  //show how many times a user has been greeted
  // Display a message like this: Hello, <USER_NAME> has been greeted <COUNTER> times.
});

let PORT = process.env.PORT ||4000;

app.listen(PORT, function(){
  console.log('Server started on port :', PORT);
});
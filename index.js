import express from 'express';
import Greet from './greeter.js';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import flash from 'express-flash';
import session from 'express-session';
import pgp from 'pg-promise';
import Database from './database.js';

const app = express();
const greet = Greet();
const database = Database();
const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_db_user:lywbHJbpiW2UKTy0xApdsDDD15vuLsEn@dpg-cjdk77rbq8nc739r9u20-a/greetings_webapp_db';
const postgresP = pgp();
const db = postgresP(connectionString);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());


//console.log(greet.greetedPersonnel());

// app.get('/', function(req, res){
//   // console.log(greet.getState())
//   req.flash('info', 'Welcome');
//   res.render('index', {greetState: greet.getState(), message: greet.getState().message});
// });

db.manyOrNone(database.viewGreetedPeople, []).catch(err => console.log(err));

app.get('/', function (req, res) {
  req.flash('info', 'Welcome');
  
  res.render('index', {greetState: greet.getState(), message: greet.getState().message})
});


app.post('/greet', function(req, res){
  //extract the name and language from the request object
  let name = req.body.name;
  let language = req.body.language;
  //Greet the user using the factory function
  greet.greetMe(name, language);
  //Populate the database

  //Use flash to display the message
  req.flash('info', greet.getState().message)
  //Go back to the home route
  res.redirect('/');
});

app.get('/greeted', function(req, res){
  //display all the users that have been greeted
  res.render('greetedPeople', {people: greet.greetedPersonnel()});
  // Add a link from the "/greeted page" - where you can click on a user in the list to see how many time the user has been greeted.
});

app.get('/counter/:username', function(req, res){
  //show how many times a user has been greeted
  // Display a message like this: Hello, <USER_NAME> has been greeted <COUNTER> times.
  const username = req.params.username;

  res.render('greetedUser', {username: username, count: greet.greetedHowManyTimes(username)})
});

let PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
  console.log('Server started on port : ', PORT);
});
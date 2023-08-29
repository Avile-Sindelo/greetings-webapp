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

const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_db_user:lywbHJbpiW2UKTy0xApdsDDD15vuLsEn@dpg-cjdk77rbq8nc739r9u20-a.oregon-postgres.render.com/greetings_webapp_db?ssl=true';
const postgresP = pgp();
const db = postgresP(connectionString);
const database = Database(db);

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

let indexDetails = {
  greetState: greet.getState(), 
  message: greet.getState().message, 
  counter: 0,
  duplicate: false
};

database.globalCounter()
  .then(result => {
    //Success
    indexDetails.counter = result.count;
  })
  .catch(error => {
    //Error
    console.log(error);
});

app.get('/', function (req, res) {
  req.flash('info', 'Welcome');

  res.render('index', indexDetails)
});


app.post('/greet', function(req, res){
  //extract the name and language from the request object
  let name = req.body.name;
  let language = req.body.language;
 
  //Greet the user using the factory function
  greet.greetMe(name, language);  

  database.duplicate(name)
          .then(result => {
            //Success
            if(result){
              //Duplicate
              database.updatePersonCounter(name);
            } else {
              //Not a duplicate
              database.addPerson(name, greet.greetedHowManyTimes(name));
            }
          })
          .catch(err => console.log(err));
   
  //Use flash to display the message
  req.flash('info', greet.getState().message)
  
  //Go back to the home route
  res.redirect('/');
});

app.get('/greeted', function(req, res){
  let greetedPersonnelList = [];

  //get the greeted people from the database
  database.viewGreetedPeople()
          .then(result => {
            result.filter(user => {
              let greetee = {}
              greetee['name'] = user.name;
              greetee['numberOfTimes'] = user.number_of_times;

              greetedPersonnelList.push(greetee);
              
            });
  
            console.log(greetedPersonnelList);
            return greetedPersonnelList;
          })
          .catch(error => {
            console.log(error);
            //display all the users that have been greeted
            

          })
          console.log('greeted people from the db :', greetedPersonnelList)
  res.render('greetedPeople', {people: greet.greetedPersonnel() /* or [] */});
  //res.render('greetedPeople', {people: greetedPersonnelList});
  // Add a link from the "/greeted page" - where you can click on a user in the list to see how many time the user has been greeted.
});

app.get('/counter/:username', function(req, res){
  //show how many times a user has been greeted
  // Display a message like this: Hello, <USER_NAME> has been greeted <COUNTER> times.
  const username = req.params.username;
  let personCount = 0;

  database.individualUserCount(username)
          .then(result => {
            personCount = result.number_of_times;
            console.log(personCount);
          })
          .catch(err => console.log(err));
          
          console.log(personCount);
  res.render('greetedUser', {username: username, count: personCount});
});

let PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
  console.log('Server started on port : ', PORT); 
}); 
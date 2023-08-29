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

// database.globalCounter()
//   .then(result => {
//     //Success
//     indexDetails.counter = result.count;
//   })
//   .catch(error => {
//     //Error
//     console.log(error);
// });

app.get('/', async function (req, res) {
  req.flash('info', 'Welcome');

  let globalCountDb = await database.globalCounter();

  res.render('index', {
    greetState: greet.getState(), 
    message: greet.getState().message, 
    counter: globalCountDb.count,
    duplicate: false,
  })
});


app.post('/greet',async  function(req, res){
  //extract the name and language from the request object
  let name = req.body.name;
  let language = req.body.language;
 
  //Greet the user using the factory function
  greet.greetMe(name, language);  

  let dupl = await database.duplicate(name);

  if(dupl.count > 0){
    //Duplicate
    database.updatePersonCounter(name);
  } else {
    //Not a duplicate
    database.addPerson(name, greet.greetedHowManyTimes(name));
  }
   
  //Use flash to display the message
  req.flash('info', greet.getState().message)
  
  //Go back to the home route
  res.redirect('/');
});

app.get('/greeted', async function(req, res){
  const dbGreetedPeople = await database.viewGreetedPeople();
    
  res.render('greetedPeople', {people: dbGreetedPeople});

  // Add a link from the "/greeted page" - where you can click on a user in the list to see how many time the user has been greeted.
});

app.get('/counter/:username', async function(req, res){
  //show how many times a user has been greeted
  
  const username = req.params.username;

  const personCount = await database.individualUserCount(username);
  res.render('greetedUser', {username: username, count: personCount.number_of_times});
});

app.get('/reset', async function(req, res){
  //await database.reset();
  console.log('You are about to delete the greeted people');
  res.redirect('/')
})

let PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
  console.log('Server started on port : ', PORT); 
}); 
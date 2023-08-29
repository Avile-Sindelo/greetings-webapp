// import assert from 'assert';
// import Greet from '../greeter.js';


// describe('Greet function tested on the terminal', function(){
    
//     it('basic test!', function(){
//         let greeter = Greet();
//         assert.equal('Hello, Nkwenkwezi', greeter.greetMe('Nkwenkwezi', 'english'));
//     });
    
//     it('basic test!', function(){
//         let greeter = Greet();
//         greeter.greetMe('Lande', 'english');
//         greeter.greetMe('Lande', 'afrikaans');
        
//         assert.equal(2, greeter.greetedHowManyTimes('Lande'));
//     });
// });

import assert from 'assert';
import Database from '../database.js';
import pgp from 'pg-promise';
const pgp = require('pg-promise')();

// we are using a special test database for the tests
process.env.DATABASE_URL || 'postgres://greetings_webapp_db_user:lywbHJbpiW2UKTy0xApdsDDD15vuLsEn@dpg-cjdk77rbq8nc739r9u20-a.oregon-postgres.render.com/greetings_webapp_db?ssl=true';
const postgresP = pgp();
const db = postgresP(connectionString);
let database = Database(db)
describe('The basic database web app', function(){

    beforeEach(async function(){
        // clean the tables before each test run
        await db.none("delete from products;");
        await db.none("delete from categories;");
    });

    it('should pass the db test', async function(){
        
        // the Factory Function is called CategoryService
        let categoryService = CategoryService(db);
        await categoryService.add({
            description : "Diary"
        });

        let categories = await categoryService.all();
        assert.equal(1, categories.length);

    });

    after(function(){
        db.$pool.end
    })
});
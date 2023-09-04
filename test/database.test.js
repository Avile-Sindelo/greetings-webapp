import assert from 'assert';
import Database from '../database.js';
import pgp from 'pg-promise';


const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_db_user:lywbHJbpiW2UKTy0xApdsDDD15vuLsEn@dpg-cjdk77rbq8nc739r9u20-a.oregon-postgres.render.com/greetings_webapp_db?ssl=true';
const postgresP = pgp();
const db = postgresP(connectionString);


describe('The basic database web app', function(done){
    this.timeout(10000);
    beforeEach(async function(){
        // clean the tables before each test run
        await db.none("delete from greeted;");
        done();
        
    });

    it('should pass the db test', async function(){
        
        // the Factory Function is called Database
        let database = Database(db);
        let greetedCitizens = await database.viewGreetedPeople();

        assert.equal(0, greetedCitizens.length);
        done();
    });

    after(function(){
        db.$pool.end
    })
});
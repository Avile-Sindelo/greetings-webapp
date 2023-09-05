import assert from 'assert';
import Database from '../database.js';
import pgp from 'pg-promise';


const connectionString = process.env.DATABASE_URL || 'postgres://greetings_webapp_db_user:lywbHJbpiW2UKTy0xApdsDDD15vuLsEn@dpg-cjdk77rbq8nc739r9u20-a.oregon-postgres.render.com/greetings_webapp_db?ssl=true';
const postgresP = pgp();
const db = postgresP(connectionString);


describe('The basic database web app', function(){
    this.timeout(4000);
    beforeEach(async function(){
        // clean the tables before each test run
        await db.none("delete from greeted;");
        
    });

    it('should test if you able to add a person into the database', async function(){
        
        // the Factory Function is called Database
        let database = Database(db);
        await database.addPerson('Lunje', 3);
        let greetedCitizens = await database.viewGreetedPeople();

        assert.equal(1, greetedCitizens.length);
    });
    
    it('should test whether or not the added person is a duplicate', async function(){
        
        // the Factory Function is called Database
        let database = Database(db);
        let dupl = await database.duplicate('Lunje');
        let greetedCitizens = await database.viewGreetedPeople();

        assert.deepEqual({count: 0}, dupl);
        assert.equal(0, greetedCitizens.length);

        await database.addPerson('Nkwenkwezi', 10);
        assert.deepEqual({count: 1}, await database.duplicate('Nkwenkwezi'));
    });

    it('should test if the person counter is updated if the person has already been greeted before', async function(){
        let database = Database(db);
        await database.addPerson('Sozayive', 3);
        assert.deepEqual({number_of_times: 3}, await database.individualUserCount('Sozayive'));
        await database.updatePersonCounter('Sozayive');
        assert.deepEqual({number_of_times: 4}, await database.individualUserCount('Sozayive'));
    });
    
    it('should test the delete functionality for each person from the table', async function(){
        let database = Database(db);
        //Check if the database is empty to start with
        assert.deepEqual({count: 0}, await database.globalCounter());

        //Add a few people on the database 
        await database.addPerson('Alpha', 4);
        await database.addPerson('Bravo', 2);
        await database.addPerson('Charlie', 1);
       
        //delete one person from the database table
        await database.deletePerson('Bravo')
        assert.deepEqual({count: 2}, await database.globalCounter())
    });

    it('should test if you able to delete all the people in the table using the Reset funtion', async function(){
        let database = Database(db);

        //make sure the table is empty
        assert.deepEqual({count: 0}, await database.globalCounter());

        //Add a few records into the table 
        await database.addPerson('Delta', 1);
        await database.addPerson('Echo', 3);
        await database.addPerson('Foxtrot', 5);
        await database.addPerson('Golf', 7);
        await database.addPerson('Hotel', 9);

        //check if the records are available in the database table
        assert.deepEqual({count: 5}, await database.globalCounter());

        // RESET the table
        await database.reset();
        
        //check if the table has been reset
        assert.deepEqual({count: 0}, await database.globalCounter());
    });

    after(function(){
        db.$pool.end
    })
});
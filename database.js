export default function Database(db){
    async function viewGreetedPeople(){
        let people = await db.manyOrNone("SELECT * FROM greeted"); 
        return people;
    }

    async function addPerson(name, numberOfTimes){
        await db.oneOrNone(`INSERT INTO greeted (name, number_of_times) VALUES ($1, $2)`, [name, numberOfTimes]);
    }

    async function deletePerson(name){
        await db.none('DELETE FROM greeted WHERE name=$1', [name]);        
    }

    async function updatePersonCounter(name){
        await db.none(`UPDATE greeted 
                        SET number_of_times = number_of_times + 1 where name=$1
                    `, [name]
                    );
    }

    async function duplicate(name){
        let personCount = await db.oneOrNone('select count(*) from greeted where name=$1', [name]); 
     
        return personCount;
    }

    async function globalCounter(){
        let countGlobal = await db.one('select count(*) from greeted');
        return countGlobal;
    }

    async function individualUserCount(username){
        let loneCount = db.oneOrNone('select number_of_times from greeted where name=$1', [username])
        return loneCount;
    }

    async function reset(){
        let message = 'Table contents deleted';
        await db.none('delete from greeted');
        return message;
    }
    
    return {
        addPerson,
        viewGreetedPeople,
        deletePerson,
        updatePersonCounter,
        duplicate,
        globalCounter,
        individualUserCount,
        reset
    }
}


   
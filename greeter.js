export default function Greet(namesGreeted){

    var state = namesGreeted || {
        count: 0,
        message: '',
        errorMessage: '',
    }

    function greetMe(name, language){
        //clear the previous message of the state variable
        state.errorMessage = '';
        state.message = '';
        //message variable for the greeting text
        var message = '';
        //make sure a name has been provided
        if(!name || !language){
            message = 'Please provide both a name and language for the function to greet';
            state.errorMessage = message;
            
            return state.errorMessage;
        } else {
            var pattern = /^[a-zA-Z\s]+$/;
            if(pattern.test(name)){
                //Convert the name to lower case
                let nameSmallCase = name.toLowerCase();
                //If the name has NOT been greeted before
                if(state[nameSmallCase] == undefined){
                    //handle language
                    if(language == 'english'){
                        message = 'Hello, ' + nameSmallCase[0].toUpperCase() + nameSmallCase.slice(1);
                        state.message = message;
                        
                    } else if(language == 'afrikaans'){
                        message = 'Halo, ' + nameSmallCase[0].toUpperCase() + nameSmallCase.slice(1);
                        state.message = message;
                       
                    } else if(language == 'xhosa'){
                        message = 'Molo, ' + nameSmallCase[0].toUpperCase() + nameSmallCase.slice(1);
                        state.message = message;
                       
                    } else {
                        message = 'Please make sure you select a language to greet with'
                        state.errorMessage = message;
                        
                        return state.errorMessage;
                    }
                    //create a property of that name and assign a value of how many times the name has been greeted, 1
                    state[nameSmallCase] = 1;

                    //increment global counter
                    state.count++;
                } else {
                    state[nameSmallCase]++;
                    //when the name has been greeted before
                    message = nameSmallCase[0].toUpperCase() + nameSmallCase.slice(1) + ' has already been greeted!';
                    state.message = message;
                }
            } else {
                //Invalid name
                message = 'Please enter a valid name';
                state.errorMessage = message;
                
                return state.errorMessage;
            }
        }

        return state.message == ''? state.errorMessage : state.message;
    }

    function getState(){
        return state;
    }

    function greetedPersonnel(){
        let peopleGreetedObj = getState();
        let peopleGreetedArr = [];
        let onlyPeopleArr = [];

        //loop over the object and make an array of objects for each key-value pair on the returned object

        for(let greeter in peopleGreetedObj){
            let currentPersonObj = {};
            currentPersonObj['name'] = greeter[0].toUpperCase() + greeter.slice(1);
            currentPersonObj['numberOfTimes'] = peopleGreetedObj[greeter];

            peopleGreetedArr.push(currentPersonObj);
        
        }
        

        //loop over the newly created array and remove the COUNT and MESSAGE properties
        for(let i = 3; i < peopleGreetedArr.length; i++){
            onlyPeopleArr.push(peopleGreetedArr[i]);
        }

       return onlyPeopleArr;
    }

    function greetedHowManyTimes(name){
        //loop through the greeted personnel
        let greetedCitizens = greetedPersonnel();
        let counter = 0;

        for(let i = 0; i < greetedCitizens.length; i++){
            if(greetedCitizens[i].name == name){
                counter = greetedCitizens[i].numberOfTimes;
            }
        }
        
        return counter;
    }

    return {
        greetMe,
        getState,
        greetedPersonnel,
        greetedHowManyTimes
    }
}
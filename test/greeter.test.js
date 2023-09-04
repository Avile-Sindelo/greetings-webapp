import assert from 'assert';
import Greet from '../greeter.js';


describe('Greet function tested on the terminal', function(){
    
    it('should test if the Greet factory function', function(){
        let greeter = Greet();
        assert.equal('Hello, Nkwenkwezi', greeter.greetMe('Nkwenkwezi', 'english'));
        assert.equal('Please provide both a name and language for the function to greet', greeter.greetMe('', 'xhosa'));
        
    });
    
    
    it('should test how many times has a person been greeted by far', function(){
        let greeter = Greet();
        greeter.greetMe('Lande', 'english');
        greeter.greetMe('Lande', 'afrikaans');
        
        assert.equal(2, greeter.greetedHowManyTimes('Lande'));
        assert.equal('Lande has already been greeted!', greeter.greetMe('Lande', 'xhosa'));
    });
});


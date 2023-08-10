import assert from 'assert';
import Greet from '../greeter.js';


describe('Greet function tested on the terminal', function(){
    
    it('basic test!', function(){
        let greeter = Greet();
        assert.equal('Hello, Nkwenkwezi', greeter.greetMe('Nkwenkwezi', 'english'));
    });
    
    it('basic test!', function(){
        let greeter = Greet();
        greeter.greetMe('Lande', 'english');
        greeter.greetMe('Lande', 'afrikaans');
        
        assert.equal(2, greeter.greetedHowManyTimes('Lande'));
    });
});
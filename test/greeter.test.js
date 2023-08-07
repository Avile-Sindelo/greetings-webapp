import assert from 'assert';
import Greet from '../greeter.js';


describe('Greet function tested on the terminal', function(){
    let greeter = Greet();
    it('basic test!', function(){
        assert.equal('Hello, Nkwenkwezi', greeter.greetMe('Nkwenkwezi', 'english'));
    });
});
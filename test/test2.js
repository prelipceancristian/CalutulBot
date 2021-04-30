var assert = require('assert');

describe('another test', function() {
    describe('add', function(){
        it('should return 10', function(){
            var x = 5;
            x = x + 5;
            assert.strictEqual(x, 10);
        })
    })
})
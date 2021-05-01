const Inventory = require('../modules/Inventory/Inventory');
var assert = require('assert');

describe('Inventory', function() {
    describe('create()', function() {
        it('Unique user creation', function() {
            let inv = new Inventory();
            inv.create(1);
            try{
                inv.create(1);
            }
            catch(error){
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
        it('Default usage', function() {
            let inv = new Inventory();
            for(i = 0; i < 100; i++)
                inv.create(i);
            for(i = 0; i < 100; i++)
                assert.deepStrictEqual(inv.transactions.get(i), []);
        });
    });
    describe('add()', function(){
        it('Default Usage', function() {
            inv = new Inventory();
            for(i = 0; i < 5; i++)
                inv.create(i);
            inv.add(1, 1);
            inv.add(2, 1);
            inv.add(3, 2);
            inv.add(4, 1);
            inv.add(0, 3);
        });
        it('Adding items to inexistent users', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            try {
                inv.add(2, 1);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
        it('Adding items twice', function() {
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            try {
                inv.add(1, 2);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('read()', function(){
        it('Default usage', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            inv.add(1, 3);
            assert.deepStrictEqual(inv.read(1), [1, 2, 3]);
            inv.create(2);
            assert.deepStrictEqual(inv.read(2), []);
        });
        it('Reading for inexistent users', function(){
            let inv = new Inventory();
            inv.create(1);
            try {
                let res = inv.read(2);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('hasItem()', function(){
        it('Default usage', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            inv.add(1, 3);
            assert(inv.hasItem(1, 1));
            assert(inv.hasItem(1, 2));
            assert(!inv.hasItem(1, 4));
            inv.create(2);
            assert(!inv.hasItem(2, 1));
            inv.add(2, 1)
            assert(inv.hasItem(2, 1));
        });
        it('Checking for inexistent users', function(){
            let inv = new Inventory();
            inv.create(1);
            try {
                let res = inv.hasItem(2, 1);  
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('delete()', function(){
        it('Default Usage', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            assert(inv.hasItem(1, 1));
            assert(inv.hasItem(1, 2));
            assert(!inv.hasItem(1, 3));
            inv.delete(1);
            try {
                inv.add(1, 1);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            inv.create(1);
            inv.add(1, 3);
            assert(!inv.hasItem(1, 1));
        });
        it('Deleting inexistent users', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.create(2);
            inv.add(2, 1);
            inv.delete(2);
            try {
                inv.delete(2);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('remove()', function(){
        it('Default usage', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            inv.add(1, 3);
            assert.deepStrictEqual(inv.read(1), [1, 2, 3]);
            inv.remove(1, 1);
            assert.deepStrictEqual(inv.read(1), [2, 3]);
            inv.remove(1, 2);
            assert.deepStrictEqual(inv.read(1), [3]);
            inv.remove(1, 3);
            assert.deepStrictEqual(inv.read(1), []);
        });
        it('Removing for inexistent users', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 1);
            inv.add(1, 2);
            inv.remove(1, 1);
            try {
                inv.remove(2, 1);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
        it('Removing inexistent items', function(){
            let inv = new Inventory();
            inv.create(1);
            inv.add(1, 2);
            inv.add(1, 1);
            try {
                inv.remove(1, 3);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    })
  });
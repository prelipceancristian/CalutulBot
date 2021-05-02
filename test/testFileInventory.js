var assert = require('assert');
const fs = require('fs').promises;
const testFileName = './test/AuxFiles/testFile.json';
const FileInventory = require('../modules/Inventory/FileInventory')

describe('File Inventory', function() {
    describe('create()', function(){
        it('Default usage', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.create("2");
            await fileInv.create("3");
            await fileInv.create("4");
        });
        it('Creating userAcc twice', async function() {
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.create("2");
            try {
                await fileInv.create("1");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('add()', function(){
        it('Default usage', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            await fileInv.add("1", "3");
            var res = await fileInv.transactions.get("1");
            assert.deepStrictEqual(res, ["1", "2", "3"]);
            await fileInv.create("2");
            await fileInv.add("2", "1");
            await fileInv.add("2", "2");
            await fileInv.add("2", "4");
            var res = await fileInv.transactions.get("2");
            assert.deepStrictEqual(res, ["1", "2", "4"]);
        });
        it('Adding to inexistent user', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            try {
                await fileInv.add("2", "1");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            var res = await fileInv.transactions.get("1");
            assert.deepStrictEqual(res, ["1", "2"]);
        });
        it('Adding item twice', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            try {
                await fileInv.add("1", "2");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            var res = await fileInv.transactions.get("1");
            assert.deepStrictEqual(res, ["1", "2"]);
        });
    });
    describe('read()', function(){
        it('Default usage', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            var res = await fileInv.read("1");
            assert.deepStrictEqual(res, ["1", "2"]);
        });
        it('Read inexistent user', async function(){
            var fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            try {
                var res = await fileInv.read("2");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    });
    describe('hasItem()', function(){
        it('Default usage', async function(){
            let fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            await fileInv.add("1", "1");
            await fileInv.add("1", "2");
            await fileInv.add("1", "3");
            assert(await fileInv.hasItem("1", "1"));
            assert(await fileInv.hasItem("1", "2"));
            assert(!(await fileInv.hasItem("1", "4")));
            await fileInv.create("2");
            assert(!(await fileInv.hasItem("2", "1")));
            await fileInv.add("2", "1")
            assert(await fileInv.hasItem("2", "1"));
        });
        it('Checking for inexistent users', async function(){
            let fileInv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create("1");
            try {
                let res = await fileInv.hasItem("2", "1");  
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('delete()', function(){
        it('Default Usage', async function(){
            let inv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create("1");
            await inv.add("1", "1");
            await inv.add("1", "2");
            assert(await inv.hasItem("1", "1"));
            assert(await inv.hasItem("1", "2"));
            assert(!(await inv.hasItem("1", "3")));
            await inv.delete("1");
            try {
                await inv.add("1", "1");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            await inv.create("1");
            await inv.add("1", "3");
            assert(!(await inv.hasItem("1", "1")));
        });
        it('Deleting inexistent users', async function(){
            let inv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create("1");
            await inv.create("2");
            await inv.add("2", "1");
            await inv.delete("2");
            try {
                await inv.delete("2");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('remove()', function(){
        it('Default usage', async function(){
            let inv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create("1");
            await inv.add("1", "1");
            await inv.add("1", "2");
            await inv.add("1", "3");
            assert.deepStrictEqual(await inv.read("1"), ["1", "2", "3"]);
            await inv.remove("1", "1");
            assert.deepStrictEqual(await inv.read("1"), ["2", "3"]);
            await inv.remove("1", "2");
            assert.deepStrictEqual(await inv.read("1"), ["3"]);
            await inv.remove("1", "3");
            assert.deepStrictEqual(await inv.read("1"), []);
        });
        it('Removing for inexistent users', async function(){
            let inv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create("1");
            await inv.add("1", "1");
            await inv.add("1", "2");
            await inv.remove("1", "1");
            try {
                await inv.remove("2", "1");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
        it('Removing inexistent items', async function(){
            let inv = new FileInventory(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create("1");
            await inv.add("1", "2");
            await inv.add("1", "1");
            try {
                await inv.remove("1", "3");
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    });
});
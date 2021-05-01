var assert = require('assert');
const fs = require('fs').promises;
const testFileName = 'test/testFile.json';
const FileShopRepo = require('../modules/ShopRepo/FileShopRepo')
const Shoppable = require('../modules/Shop/Shoppable');
const SoundBite = require('../modules/Shop/SoundBite');

const sh1 = new Shoppable(1, "MyShoppable1", "A shoppable object created for testing purposes", "Cathegory 1");
const sh2 = new Shoppable(2, "MyShoppable2", "A shoppable object created for testing purposes", "Cathegory 1");
const sb1 = new SoundBite(3, "MySoundBite1", "A soundbite object created for testing purposes", "Cathegory 2", "path1");
const sb2 = new Shoppable(4, "MySoundBite2", "A soundbite object created for testing purposes", "Cathegory 2", "path2");


describe('File Inventory', function() {
    describe('create()', function(){
        it('Default usage', async function(){
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            await fileInv.create(sh2);
            await fileInv.create(sb1);
            await fileInv.create(sb2);
        });
        it('Creating shopAcc twice', async function() {
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            await fileInv.create(sb1);
            try {
                await fileInv.create(sb1);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('read()', function(){
        it('Default usage', async function(){
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            var res = await fileInv.read(sh1.id);
            assert.deepStrictEqual(res, sh1);
        });
        it('Read inexistent user', async function(){
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            try {
                var res = await fileInv.read(sh2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    });
    describe('update()', function(){
        it('Default usage', async function(){
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            var tempShoppable = new Shoppable(1, "updatedVersion", "whatever", "Cathegory 1");
            fileInv.update(tempShoppable);
        });
        it('Updating inexistent items', async function(){
            var fileInv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileInv.create(sh1);
            try {
                await fileInv.update(sh2);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    })
    describe('delete()', function(){
        it('Default Usage', async function(){
            let inv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create(sb1);
            await inv.delete(sb1.id);
            try {
                await inv.read(sb1.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            await inv.create(sb1);
            assert(await inv.read(sb1.id), sb1);
        });
        it('Deleting inexistent users', async function(){
            let inv = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await inv.create(sb1);
            await inv.create(sb2);
            await inv.delete(sb2.id);
            try {
                await inv.delete(sb2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
});
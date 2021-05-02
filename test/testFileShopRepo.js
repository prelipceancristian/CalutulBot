var assert = require('assert');
const fs = require('fs').promises;
const testFileName = 'test/AuxFiles/testFile3.json';
const FileShopRepo = require('../modules/ShopRepo/FileShopRepo')
const Shoppable = require('../modules/Shop/Shoppable');
const SoundBite = require('../modules/Shop/SoundBite');

const sh1 = new Shoppable(1, "MyShoppable1", "A shoppable object created for testing purposes", "Cathegory 1", 100);
const sh2 = new Shoppable(2, "MyShoppable2", "A shoppable object created for testing purposes", "Cathegory 1", 2000);
const sb1 = new SoundBite(3, "MySoundBite1", "A soundbite object created for testing purposes", "Cathegory 2", 1000, "path1",);
const sb2 = new SoundBite(4, "MySoundBite2", "A soundbite object created for testing purposes", "Cathegory 2", 10, "path2");


describe('File Shop Repo', function() {
    describe('create()', function(){
        it('Default usage', async function(){
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            await fileShRepo.create(sh2);
            await fileShRepo.create(sb1);
            await fileShRepo.create(sb2);
        });
        it('Creating shopAcc twice', async function() {
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            await fileShRepo.create(sb1);
            try {
                await fileShRepo.create(sb1);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
    describe('read()', function(){
        it('Default usage', async function(){
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            var res = await fileShRepo.read(sh1.id);
            assert.deepStrictEqual(res, sh1);
        });
        it('Read inexistent user', async function(){
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            try {
                var res = await fileShRepo.read(sh2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    });
    describe('update()', function(){
        it('Default usage', async function(){
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            var tempShoppable = new Shoppable(1, "updatedVersion", "whatever", "Cathegory 1");
            fileShRepo.update(tempShoppable);
        });
        it('Updating inexistent items', async function(){
            var fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sh1);
            try {
                await fileShRepo.update(sh2);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        })
    })
    describe('delete()', function(){
        it('Default Usage', async function(){
            let fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sb1);
            await fileShRepo.delete(sb1.id);
            try {
                await fileShRepo.read(sb1.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
            await fileShRepo.create(sb1);
            assert(await fileShRepo.read(sb1.id), sb1);
        });
        it('Deleting inexistent users', async function(){
            let fileShRepo = new FileShopRepo(testFileName);
            await fs.writeFile(testFileName, "{}", () => {});
            await fileShRepo.create(sb1);
            await fileShRepo.create(sb2);
            await fileShRepo.delete(sb2.id);
            try {
                await fileShRepo.delete(sb2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'KeyError')
                    assert.fail();
            }
        });
    });
});
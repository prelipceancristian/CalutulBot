const Shopkeeper = require('../modules/Shopkeeper/Shopkeeper');
const BankRepoFile = require('../modules/CalutulBank/Repository/RepoFile');
const FileShopRepo = require('../modules/ShopRepo/FileShopRepo');
const Inventory = require('../modules/Inventory/FileInventory');
const TransactionLogger = require('../modules/TransactionLogger/TransactionLogger');
const Shoppable = require('../modules/Shop/Shoppable');
const SoundBite = require('../modules/Shop/SoundBite');
const fs = require('fs').promises;
const assert = require('assert');
const BankAccount = require('../modules/CalutulBank/Domain/BankAccount');
const { setgroups } = require('process');
const filePath1 = 'test/AuxFiles/testFile.json';
const filePath2 = 'test/AuxFiles/testFile2.json';
const filePath3 = 'test/AuxFiles/testFile3.json';
const filePath4 = 'test/AuxFiles/testFile4.txt';

var bankRepo = new BankRepoFile(filePath1);
var shopRepo = new FileShopRepo(filePath2);
var inventory = new Inventory(filePath3);
var transactionLogger = new TransactionLogger(filePath4);
var shopkeeper = new Shopkeeper(bankRepo, shopRepo, transactionLogger, inventory);

const sh1 = new Shoppable("1", "MyShoppable1", "asd", "Cathegory 1", 100);
const sh2 = new Shoppable("2", "MyShoppable2", "A shoppable object created for testing purposes", "Cathegory 1", 2000);
const sb1 = new SoundBite("3", "MySoundBite1", "A soundbite object created for testing purposes", "Cathegory 2", 1000, "path1",);
const sb2 = new SoundBite("4", "MySoundBite2", "A soundbite object created for testing purposes", "Cathegory 2", 10, "path2");

const bk1 = new BankAccount("1", 1000);
const bk2 = new BankAccount("2", 210);

async function setup(){
    await bankRepo.create(bk1);
    await bankRepo.create(bk2);
    await shopRepo.create(sh1);
    await shopRepo.create(sh2);
    await shopRepo.create(sb1);
    await shopRepo.create(sb2);
}

async function clearFiles(){
    await fs.writeFile(filePath1, "{}", () => {});
    await fs.writeFile(filePath2, "{}", () => {});
    await fs.writeFile(filePath3, "{}", () => {});
    await fs.writeFile(filePath4, "", () => {});
}

describe('Shopkeeper', function(){
    describe('buy()', function(){
        it('Default usage', async function() {
            await clearFiles();

            await setup();
            
            await shopkeeper.buy(bk1.UId, sh1.id);
            await shopkeeper.buy(bk2.UId, sb2.id);
            await shopkeeper.buy(bk2.UId, sh1.id);

            await clearFiles();
        });
        it('Insufficient funds', async function(){
            await clearFiles();

            await setup();
            
            await shopkeeper.buy(bk1.UId, sh1.id);
            var res = await bankRepo.read(bk1.UId);
            assert.strictEqual(res.amount, 900);

            try {
                await shopkeeper.buy(bk1.UId, sh2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'ShopkeeperError')
                    assert.fail();
            }
            await shopkeeper.buy(bk1.UId, sb2.id);
            try {
                await shopkeeper.buy(bk2.UId, sb1.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'ShopkeeperError')
                    assert.fail();
            }
            var newBankAcc1 = new BankAccount(bk1.UId, 1001);
            await bankRepo.update(newBankAcc1);
            await shopkeeper.buy(bk1.UId, sb1.id);
            var res = await bankRepo.read(newBankAcc1.UId);
            assert.strictEqual(res.amount, 1);
        });
        it('Buying the same item multiple times', async function(){
            await clearFiles();

            await setup();

            await shopkeeper.buy(bk1.UId, sh1.id);
            try {
                await shopkeeper.buy(bk1.UId, sh1.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'ShopkeeperError')
                    assert.fail();
            }
            try {
                await shopkeeper.buy(bk1.UId, sh1.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'ShopkeeperError')
                    assert.fail();
            }
            await inventory.remove(bk1.UId, sh1.id);
            await shopkeeper.buy(bk1.UId, sh1.id);
        });
    });
    describe('sell()', function(){
        it('Default usage', async function(){
            await clearFiles();

            await setup();

            await shopkeeper.buy(bk1.UId, sb1.id);
            var res = await bankRepo.read(bk1.UId);
            assert.deepStrictEqual(res.amount, 0);
            assert.strictEqual(await inventory.hasItem(bk1.UId, sb1.id), true);

            await shopkeeper.sell(bk1.UId, sb1.id);
            res = await bankRepo.read(bk1.UId);
            assert.deepStrictEqual(res.amount, 0.5 * bk1.amount);
            assert.strictEqual(await inventory.hasItem(bk1.UId, sb1.id), false);
        });
        it('Selling inexistent items', async function(){
            await clearFiles();

            await setup();

            await shopkeeper.buy(bk1.UId, sh1.id);
            try {
                await shopkeeper.sell(bk1.UId, sb2.id);
                assert.fail();
            } catch (error) {
                if(error.name != 'ShopkeeperError')
                    assert.fail();
            }
            await shopkeeper.buy(bk1.UId, sb2.id);
            await shopkeeper.sell(bk1.UId, sb2.id);

        });
    })
});
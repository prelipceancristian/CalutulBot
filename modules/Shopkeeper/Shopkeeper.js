const BankRepo = require('../CalutulBank/Repository/Repo');
const BankRepoFile = require('../CalutulBank/Repository/RepoFile');
const ShopRepo = require('../ShopRepo/ShopRepo');
const FileShopRepo = require('../ShopRepo/FileShopRepo');
const TransactionLogger = require('../TransactionLogger/TransactionLogger');
const Inventory = require('../Inventory/Inventory');
const FileInventory = require('../Inventory/FileInventory');
const ShopkeeperError = require('./ShopkeeperError');
const BankAccount = require('../CalutulBank/Domain/BankAccount');

class Shopkeeper {

    constructor(_bankRepo, _shopRepo, _transactionLogger, _inventory){
        this.bankRepo = _bankRepo;
        this.shopRepo = _shopRepo;
        this.transactionLogger = _transactionLogger;
        this.inventory = _inventory;
    }

    availableItems(){
        return this.shopRepo.getAll();
    }

    async buy(userId, itemId){
        const userBankAccount = await this.bankRepo.read(userId);
        const boughtItem = await this.shopRepo.read(itemId);
        if(!(await this.inventory.hasAcc(userId)))
            await this.inventory.create(userId);
        if(await this.inventory.hasItem(userId, itemId))
            throw new ShopkeeperError('You already have this item!');
        if(userBankAccount.amount < boughtItem.price)
            throw new ShopkeeperError('You do not have enough money for this item!');
        const newUserBankAccount = new BankAccount(userId, userBankAccount.amount - boughtItem.price);
        await this.inventory.add(userId, itemId);
        await this.bankRepo.update(newUserBankAccount);
        //console.log(await this.shopRepo.read(itemId));
        await this.transactionLogger.logToFile(userId, await this.shopRepo.read(itemId), true);
    }
}

module.exports  = Shopkeeper;
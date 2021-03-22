const BankAccount = require("../Domain/BankAccount");

class Service{
    constructor(repo){
        this.repo = repo;
    }

    createAccount(UId, amount){
        let bA = new BankAccount(UId, amount);
        //TODO: add a validator
        this.repo.create(bA);
        return true;
    }

    readAccount(UId){
        return this.repo.read(UId);
    }

    updateAccount(UId, newAmount){
        let bA = new BankAccount(UId, newAmount);
        this.repo.update(bA);
        return true;
    }

    deleteAccount(UId){
        return this.repo.delete(UId);
    }

    addToAccount(UId, amountToAdd){
        let oldAmount = this.repo.read(UId).amount;
        let bA = new BankAccount(UId, oldAmount + amountToAdd);
        this.repo.update(bA);
        return true;
    }

}

module.exports = Service;
const BankAccount = require("../Domain/BankAccount");

class Service{
    constructor(repo){
        this.repo = repo;
    }

    async createAccount(UId, amount){
        let bA = new BankAccount(UId, amount);
        //TODO: add a validator
        await this.repo.create(bA);
        return true;
    }

    async readAccount(UId){
        const res = await this.repo.read(UId);
        console.log("In service:")
        console.log(res);
        return res;
    }

    async updateAccount(UId, newAmount){
        let bA = new BankAccount(UId, newAmount);
        const res = await this.repo.update(bA);
        return res;
    }

    async deleteAccount(UId){
        const res = await this.repo.delete(UId);
        return res;
    }

    async addToAccount(UId, amountToAdd){
        const oldAcc = await this.repo.read(UId);
        const oldAmount = oldAcc.amount;
        let bA = new BankAccount(UId, oldAmount + amountToAdd);
        const res = await this.repo.update(bA);
        return true;
    }

}

module.exports = Service;
const BankAccount = require("../Domain/BankAccount");
const ServiceError = require("../Errors/ServiceError");

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
        //console.log("In service:")
        //console.log(res);
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

    async gift(giverId, recieverId, value){
        const giverAcc = await this.repo.read(giverId);
        const recieverAcc = await this.repo.read(recieverId);
        if (giverId == recieverId)
            throw new ServiceError("You cannot send money to yourself!");
        if (giverAcc.amount < value)
            throw new Error("You don't have enough money!");
        console.log(giverAcc)
        console.log(recieverAcc)
        console.log(value)
        const updatedGiverAcc = new BankAccount(giverId, giverAcc.amount - parseInt(value));
        const updatedRecieverAcc = new BankAccount(recieverId, recieverAcc.amount + parseInt(value));
        console.log(updatedGiverAcc)
        console.log(updatedRecieverAcc)
        const res1 = await this.repo.update(updatedGiverAcc);
        const res2 = await this.repo.update(updatedRecieverAcc);
    }

}

module.exports = Service;
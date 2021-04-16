class BankAccount {

    constructor(UId, amount){
        this.UId = UId;
        this.amount = amount;
    }

    // get amount(){
    //     return this.amount;
    // }

    // set amount(other){
    //     this.amount = other;
    // }

    // get UId(){
    //     return this.UId;
    // }

    // set UId(other){
    //     this.UId = other;
    // }

    equals(other){
        return this.UId == other.UId;
    }

}

module.exports = BankAccount;
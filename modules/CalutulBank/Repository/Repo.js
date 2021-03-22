const KeyError = require('../Errors/KeyError');

class Repo{

    constructor(){
        this.accs = new Map();
    }

    create(bankAccount){
        if(this.accs.has(bankAccount.UId)){
            console.log("Got the error in the repo");
            throw new KeyError("There already exists an account with this user id!");
        }
        else//should be useless but whatever
            this.accs.set(bankAccount.UId, bankAccount);
    }

    read(UId){
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        let cpy = this.accs.get(UId); // return copy for safety
        return cpy;
    }

    update(bankAccount){
        if(!(this.accs.get(bankAccount.UId))){
            console.log(this.accs);
            console.log(bankAccount.UId);
            //console.log(this.accs["ooga"]);
            throw new KeyError("There is no account under this user id!");
        }
        this.accs.set(bankAccount.UId, bankAccount);
    }

    delete(UId){
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        return this.accs.delete(UId);
    }

}

module.exports = Repo;
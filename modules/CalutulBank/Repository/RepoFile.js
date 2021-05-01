const fs = require('fs').promises;
const KeyError = require("../Errors/KeyError");
const Repo = require("./Repo");

class RepoFile extends Repo{

    constructor(filePath){
        super();
        this.filePath = filePath;
    }

    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
    }

    objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
          strMap.set(k, obj[k]);
        }
        return strMap;
    }

    async create(bankAccount){
        const data = await fs.readFile(this.filePath);
        this.accs = this.objToStrMap(JSON.parse(data));
        if(this.accs.has(bankAccount.UId)){
            //console.log("Got the error in the repo");
            throw new KeyError("There already exists an account with this user id!");
        }
        this.accs.set(bankAccount.UId, bankAccount);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        //console.log(code);
    }

    async read(UId){
        const data = await fs.readFile(this.filePath);
        //console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        let cpy = this.accs.get(UId);
        //console.log("din async read:")
        //console.log(cpy);
        return cpy;
    }


    async update(bankAccount){
        const data = await fs.readFile(this.filePath);
        //console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        if(!(this.accs.has(bankAccount.UId)))
            throw new KeyError("There is no account under this user id!");
        this.accs.set(bankAccount.UId, bankAccount);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        //console.log(code);
    }

    async delete(UId){
        const data = await fs.readFile(this.filePath);
        //console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        const res = this.accs.delete(UId);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        return res;
    }
}

module.exports = RepoFile;
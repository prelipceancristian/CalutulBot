const fs = require('fs').promises;
const KeyError = require("../Errors/KeyError");
const Repo = require("./Repo");

class RepoFile extends Repo{

    constructor(filePath){
        super();//check
        this.filePath = filePath;
    }

    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          // We don’t escape the key '__proto__'
          // which can cause problems on older engines
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

    // writeToFile(){
    //     // await fs.writeFile(this.filePath, this.accs);
    //     console.log("what to write:");
    //     console.log(JSON.stringify(this.strMapToObj(this.accs)));
    //     fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)), (err) => {
    //         //if(err)
    //         //    console.log(err);
    //         console.log("Writing ok!");
    //     })
    // }

    // readFromFile(){
    //     // const data = await fs.readFile(this.filePath);
    //     // console.log(data);
    //     // this.accs = data;
    //     fs.readFile(this.filePath, (err, data) => {
    //         if (err)
    //             throw err;
    //         console.log("read data:");
    //         console.log(data);
    //         // if(data.toString().length == 0)
    //         //     this.accs = {};
    //         // else
    //         this.accs = this.objToStrMap(JSON.parse(data));
    //     })
    // }
    //async readFromFile

    

    // create(bankAccount){
    //     // this.readFromFile();
    //     // super.create(bankAccount);
    //     // this.writeToFile();
    //     // fs.readFile(this.filePath, (err, data) => {
    //     //     console.log("read data:")
    //     //     console.log(data);
    //     //     this.accs = this.objToStrMap(JSON.parse(data));
    //     // })
    //     // .then(() => {
    //     //     super.create(bankAccount);
    //     // })
    //     // .then(() =>{
    //     //     console.log("what to write:");
    //     //     console.log(JSON.stringify(this.strMapToObj(this.accs)));
    //     //     fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)), (err) => {
    //     //     //if(err)
    //     //     //    console.log(err);
    //     //     console.log("Writing ok!");
    //     //     })
    //     // })
    //     // .catch((err) => {
    //     //     console.log(err);
    //     // })
    //     fs.readFile(this.filePath, (err, data) => {
    //             console.log("read data:")
    //             console.log(data);
    //             this.accs = this.objToStrMap(JSON.parse(data));
    //         })
    //     super.create(bankAccount);
    //     fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)), (err) => {
    //             //if(err)
    //             //    console.log(err);
    //             console.log("Writing ok!");
    //             })
    // }

    // read(UId){
    //     // this.readFromFile();
    //     // return super.read(UId);
    //     fs.readFile(this.filePath, (err, data) => {
    //         console.log("read data:")
    //         console.log(data);
    //         this.accs = this.objToStrMap(JSON.parse(data));
    //     })
    //     return super.read(UId);
    // }

    async create(bankAccount){
        const data = await fs.readFile(this.filePath);
        console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        if(this.accs.has(bankAccount.UId)){
            console.log("Got the error in the repo");
            throw new KeyError("There already exists an account with this user id!");
        }
        else//should be useless but whatever
            this.accs.set(bankAccount.UId, bankAccount);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        console.log(code);
    }

    async read(UId){
        const data = await fs.readFile(this.filePath);
        console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        //return super.read();//this shit fucks me over
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        let cpy = this.accs.get(UId); // return copy for safety
        console.log("din async read:")
        console.log(cpy);
        return cpy;
    }


    async update(bankAccount){
        // this.readFromFile(); 
        // super.update(bankAccount);
        // this.writeToFile();
        const data = await fs.readFile(this.filePath);
        console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        if(!(this.accs.has(bankAccount.UId)))
            throw new KeyError("There is no account under this user id!");
        this.accs.set(bankAccount.UId, bankAccount);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        console.log(code);
    }

    async delete(UId){
        // this.readFromFile();
        // let res = super.delete(UId);
        // this.writeToFile();
        // return res;
        const data = await fs.readFile(this.filePath);
        console.log(data.toString());
        this.accs = this.objToStrMap(JSON.parse(data));
        //return super.read();//this shit fucks me over
        if(!(this.accs.has(UId)))
            throw new KeyError("There is no account under this user id!");
        const res = this.accs.delete(UId);
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.accs)));
        return res;
    }
}

module.exports = RepoFile;
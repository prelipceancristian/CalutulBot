const fs = require('fs').promises;
const KeyError = require('../CalutulBank/Errors/KeyError');
const Inventory = require('./Inventory');

class FileInventory extends Inventory{
    
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

    async readFromFile(){
        const data = await fs.readFile(this.filePath);
        this.transactions = this.objToStrMap(JSON.parse(data));
    }

    async writeToFile(){
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.transactions)));
    }

    async create(id){
        await this.readFromFile();
        super.create(id);
        await this.writeToFile();
    }

    async add(idUser, idItem){
        await this.readFromFile();
        super.add(idUser, idItem);
        await this.writeToFile();   
    }

    async read(id){
        await this.readFromFile();
        return super.read(id);
    }

    async hasItem(idUser, idItem){
        await this.readFromFile();
        return super.hasItem(idUser, idItem);
    }

    async delete(idUser){
        await this.readFromFile();
        super.delete(idUser);
        await this.writeToFile();
    }

    async remove(idUser, idItem){
        await this.readFromFile();
        super.remove(idUser, idItem);
        await this.writeToFile();
    }

    async hasAcc(idUser){
        await this.readFromFile();
        return super.hasAcc(idUser);
    }
}

module.exports = FileInventory;

const ShopRepo = require('./ShopRepo');
const fs = require('fs').promises;
const KeyError = require('../CalutulBank/Errors/KeyError');

class FileShopRepo extends ShopRepo{
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
        this.items = this.objToStrMap(JSON.parse(data));
        //console.log(this.items);
    }

    async writeToFile(){
        const code = await fs.writeFile(this.filePath, JSON.stringify(this.strMapToObj(this.items)));
    }

    async create(shoppable){
        await this.readFromFile();
        super.create(shoppable);
        await this.writeToFile();
    }

    async read(id){
        await this.readFromFile();
        return super.read(id);
    }

    async update(shoppable){
        await this.readFromFile();
        super.update(shoppable);
        await this.writeToFile();
    }

    async delete(id){
        await this.readFromFile();
        super.delete(id);
        await this.writeToFile();
    }

}

module.exports = FileShopRepo;
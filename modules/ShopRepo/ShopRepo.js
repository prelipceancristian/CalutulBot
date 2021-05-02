const KeyError = require('../CalutulBank/Errors/KeyError');

class ShopRepo {
    constructor(){
        this.items = new Map();
    }

    create(shoppable){
        //console.log(shoppable);
        if(this.items.has(shoppable.id)){
            throw new KeyError("There already exists an item with this id!");
        }
        this.items.set(shoppable.id, shoppable);
    }

    read(id){
        if(!(this.items.has(id)))
            throw new KeyError("There is no item under this id!");
        let cpy = this.items.get(id);
        return cpy;
    }

    update(shoppable){
        if(!(this.items.has(shoppable.id))){
            throw new KeyError("There is no item under this id!");
        }
        this.items.set(shoppable.id, shoppable);
    }

    delete(id){
        if(!(this.items.has(id)))
            throw new KeyError("There is no item under this id!");
        return this.items.delete(id);
    }

    getAll(){
        return this.items.values();
    }
}

module.exports = ShopRepo;
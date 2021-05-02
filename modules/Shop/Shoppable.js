class Shoppable{
    
    constructor(_id, _name, _description, _cathegory, _price){
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.cathegory = _cathegory;
        this.price = _price;
    }

    equals(other){
        return this.id === other.id;
    }

}

module.exports = Shoppable;
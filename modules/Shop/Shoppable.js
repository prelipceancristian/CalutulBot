class Shoppable{
    
    constructor(_id, _name, _description, _cathegory){
        this.id = _id;
        this.name = _name;
        this.description = this.description;
        this.cathegory = _cathegory;
    }

    equals(other){
        return this.id === other.id;
    }

}

module.exports = Shoppable;
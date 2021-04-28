const Shoppable  = require("./Shoppable");

class SoundBite extends Shoppable{
    constructor(_id, _name, _description, _cathegory, _filePath){
        super(_id, _name, _description, _cathegory);
        this.filePath = _filePath;
    }

    equals(other){
        return super.equals(other);
    }
}

module.exports = SoundBite;
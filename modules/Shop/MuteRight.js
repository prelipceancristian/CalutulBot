class MuteRight extends Shoppable{

    constructor(_id, _name, _description, _cathegory, _duration){
        super(_id, _name, _description, _cathegory);
        this.duration = _duration;
    }

    equals(other){
        return super.equals(other);
    }

}

module.exports = MuteRight;
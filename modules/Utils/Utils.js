class Utils{
    constructor(){}

    stringDate(){
    var currentDate = new Date();
    return currentDate.getDate() + "." 
    + (currentDate.getMonth() + 1) + "." 
    + currentDate.getFullYear() + " " 
    + currentDate.getHours() + ":" 
    + currentDate.getMinutes() + ":" 
    + currentDate.getSeconds();
    }
}

module.exports = Utils;
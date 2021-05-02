const fs = require('fs').promises;

class TransactionLogger{

    constructor(filePath){
        this.filePath = filePath;
    }

    stringDate(){
        var currentDate = new Date();
        return currentDate.getDate() + "." 
        + (currentDate.getMonth() + 1) + "." 
        + currentDate.getFullYear() + " " 
        + currentDate.getHours() + ":" 
        + currentDate.getMinutes() + ":" 
        + currentDate.getSeconds();
    }

    async logToFile(userId, item, isPaid){
        var temp = ""
        if(isPaid)
            temp = " bought ";
        else
            temp = " sold ";
        var s = "At " + this.stringDate() +  ", the user with the id " + userId.toString() + temp + "item " + item.name + " (id: " + item.id + ") for " + item.price + " CalutulCoins\n";
        await fs.appendFile(this.filePath, s);
    }
}

module.exports = TransactionLogger;


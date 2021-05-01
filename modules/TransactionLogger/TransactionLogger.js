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

    async logToFile(userId, item, amount, isPaid){
        var temp = ""
        if(isPaid)
            temp = " bought ";
        else
            temp = " sold ";
        var s = "At " + this.stringDate() +  ", user " + userId.toString() + temp + "item " + item.toString() + " for " + amount.toString();
        const code = await fs.writeFile(this.filePath, s);
    }
}

module.exports = TransactionLogger;


var myEmojis = require('../Storage/myEmojis.json');

module.exports = {
    /**
     * The function recieves a message and creates a string based on the message content that contains emojis that fit
     * @param {Message} message - the message that issued the command, along with the given text to emojify
     * @returns {string} res - the modified message content
     */
    emojify: function(message){
        res = ""
        args = message.content.split(' ');
        args.splice(0,1);
        args.forEach(element => {
            res += element + " ";
            if(typeof myEmojis[element] !== "undefined")
                res += myEmojis[element].char + " ";
            else
                for(var key in myEmojis){
                    if(myEmojis[key].keywords.includes(element)){
                        res += myEmojis[key].char + " ";
                        break;
                    }
                }
        });
        return res;
    }
}
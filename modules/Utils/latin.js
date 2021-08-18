module.exports = {
    /**
     * The function recieves a message and creates a string based on the message content that adds certain suffixes at the end of each word
     * @param {Message} message - the message that issued the command, along with the given text to emojify
     * @returns {string} res - the modified message content
     */
    textToLatin: function(message){
        let res = "";
        args = message.content.split(' ');
        args.splice(0,1);
        args.forEach(element => {
            res+= element + "us ";
        });
        return res;
    }
}
module.exports = {
    /**
     * The function breakes a long text into smaller texts that would not exceed the discord maximum message length
     * @param {Message} message - the message to which the long text should respond
     * @param {string} longText - the long text to be transmitted 
     */
    replyLongText: function(message, longText){
        let longTextSize = longText.length;
        let i = 0;
        let partSize = 1000;
        while(i < longTextSize && i >= 0){
            let nextIndex = longText.indexOf("\n", i+partSize);
            if(nextIndex > longTextSize)
                nextIndex = longTextSize;
            message.reply(longText.slice(i, nextIndex));
            i = nextIndex;
        }
    }
}
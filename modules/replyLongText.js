module.exports = {
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
var myEmojis = require('../myEmojis.json');

module.exports = {
    emojify: function(message){
        res = ""
        args = message.content.split(' ');
        args.splice(0,1);
        args.forEach(element => {
            res += element + " ";
            //let supposedEmoji = myEmojis[element];
            // myEmojis.forEach(element => {
            //     console.log(element.keywords);
            // });
            // if(typeof supposedEmoji !== "undefined")
            //     res += supposedEmoji.char + " ";
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
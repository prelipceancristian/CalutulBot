module.exports = {
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
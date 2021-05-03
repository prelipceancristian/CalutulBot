const Discord = require('discord.js');

class ItemEmbed {
    constructor(){
        this.aa = new Map();
    }

    /*
    Foloseste url urile pentru a da un preview la sunet 
    */

    createEmbed(item){
        return {
            color: "#990000",
            title: 'Tip',
            fields: [
                {
                    name: item.name,
                    value: '\u200b',
                    inline: true,
                },
                {
                    name: "Tipped",
                    value: item.price + " CalutulCoins",
                    inline: true,
                },
                {
                    name: item.id,
                    value: '\u200b',
                    inline: true,
                },
            ],
            image: {
                //url: 'attachment://buyback.png',
            },
            timestamp: new Date(),
            footer: {
                text: 'Get fked lmao'
            },
        };
    }
}

module.exports = ItemEmbed;
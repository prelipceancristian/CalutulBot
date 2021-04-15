module.exports = {
    tip: function(tipper, tipped, amount){
        return {
            color: "#990000",
            title: 'Tip',
            fields: [
                {
                    name: tipper.username,
                    value: '\u200b',
                    inline: true,
                },
                {
                    name: "Tipped",
                    value: amount + "CalutulCoins",
                    inline: true,
                },
                {
                    name: tipped.username,
                    value: 'Some value here',
                    inline: true,
                },
            ],
            image: {
                url: 'attachment://buyback.png',
            },
            timestamp: new Date(),
            footer: {
                text: 'Get fked lmao'
            },
        };
    }
}
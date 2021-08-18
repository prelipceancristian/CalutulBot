module.exports = {
    /**
     * The function returns an embed message that contains details about the tipping process
     * @param {User} tipper - the user who tipped
     * @param {User} tipped - the user who got tipped
     * @param {number} amount - the amount of currency tipped
     * @returns 
     */
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
                    value: amount + " CalutulCoins",
                    inline: true,
                },
                {
                    name: tipped.username,
                    value: '\u200b',
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
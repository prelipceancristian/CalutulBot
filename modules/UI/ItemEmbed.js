const Discord = require('discord.js');

class ItemEmbed {
    constructor(){}

    /*
    Foloseste url urile pentru a da un preview la sunet 
    */

    createEmbed(item){
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(item.name)
        .setAuthor("Shop items - Id " + item.id)
        .setDescription(item.description)
        .setThumbnail('attachment://soundbite3.png')
        .addField( "Category", item.cathegory, true)
        .addField( "Price", item.price.toString() + " CalutulCoins", true)
        .addField( "Command", "!buy " + item.id)
        //.setImage('attachment://soundbite2.png')
        .setTimestamp()
        .setFooter("Protip: Click the item name for a preview!")
        .setURL('https://discord.js.org/');
        return exampleEmbed;
    }
}

module.exports = ItemEmbed;
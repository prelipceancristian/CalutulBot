/**
 * A module used for muting and unmuting users
 * @module mute
 */

module.exports = {
    /**
     * The function recieves a message and mutes the user mentioned in the message content
     * @param {Message} msg - the message that issued the mute command 
     */
    muteUser: function(msg){
        const target = msg.mentions.users.first();
        if (target){
            let mainRole = msg.guild.roles.cache.find(role => role.name === 'Monkey');
            let muteRole = msg.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = msg.guild.members.cache.get(target.id);
            memberTarget.roles.remove(mainRole.id);
            memberTarget.roles.add(muteRole.id);
            return msg.channel.send(`User <@${memberTarget.user.id}> got nay-nayed succesfully`);
        }
        else
            return msg.reply("User can't be found!");
    },
    /**
     * The function recieves a message and unmutes the user mentioned in the message content
     * @param {Message} msg - the message that issued the unmute command 
     */
    unmuteUser: function(msg){
        const target = msg.mentions.users.first();
        if (target){
            let mainRole = msg.guild.roles.cache.find(role => role.name === 'Monkey');
            let muteRole = msg.guild.roles.cache.find(role => role.name === 'Muted');

            let memberTarget = msg.guild.members.cache.get(target.id);
            memberTarget.roles.remove(muteRole.id);
            memberTarget.roles.add(mainRole.id);
            return msg.channel.send(`User <@${memberTarget.user.id}> got unmuted`);
        }
        else
            return msg.reply("User can't be found!");
    }
}
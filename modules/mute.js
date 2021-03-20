module.exports = {
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
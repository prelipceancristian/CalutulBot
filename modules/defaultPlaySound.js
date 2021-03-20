module.exports = {
    defaultPlaySound: function(msg, filepath) {
        /*
        Function takes a filePath as an argument and plays the soundbite located at the given location in the current VoiceChannel.
        args:
            filePath: string, the path of the soundbite
            msg: the message that activated the command
        ret: message reply if the command was called during an ongoing process, message reply if user is not present in voice channel, no return in all goes well.
        */ 
            if (!msg.member.voice.channel) return msg.reply("We da vezi ca nu esti in voice channel fmm.");
    
            if (msg.guild.me.voice.channel) return msg.reply("Vezi ca deja vorbesc ba");
    
            msg.member.voice.channel.join().then(VoiceConnection => {
                VoiceConnection.play(filepath).on("finish", () => VoiceConnection.disconnect());
            }).catch(e => console.log(e))
    }

}


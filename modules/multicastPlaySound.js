module.exports = {
   multicastPlaySound: function (msg, filepath, multicastFactor, alwaysOn) {
    if (!msg.member.voice.channel)
      return msg.reply('You are not connected to a voice channel.')

    if (msg.guild.me.voice.channel && !alwaysOn)
      return msg.reply('I am already talking, moron.')

    msg.member.voice.channel
      .join()
      .then(VoiceConnection => {
        if (multicastFactor != 1)
          msg.reply('**MULTICAST X' + multicastFactor.toString() + '!!**')
        else msg.reply('Only once sadge')
        console.log("here")
        //VoiceConnection.play(filepath).on("finish", () => VoiceConnection.disconnect());
        //recursiveCall(filepath, multicastFactor, VoiceConnection);
        //multicastPlay(VoiceConnection, filepath, multicastFactor);
        msg.member.voice.channel
        .join()
        .then(VoiceConnection => {
          VoiceConnection.play(filepath).on('finish', () =>
            VoiceConnection.disconnect()
          )
        })
        .catch(e => console.log(e))
        if(!alwaysOn)
            VoiceConnection.disconnect();
      })
      .catch(e => console.error(e))
  }
}

function recursiveCall(filepath, multicastFactor, VoiceConnection){
    if(multicastFactor != 0){
        console.log("we are here and the multicast factor is " + multicastFactor.toString())
        VoiceConnection.play(filepath).on("finish", () => VoiceConnection.disconnect());
    }
    else
        return;
}

function multicastPlay (VoiceConnection, soundPath, multicastFactor) {
    if (multicastFactor != 0) {
      VoiceConnection.play(soundPath).on('finish', () =>
        multicastPlay(VoiceConnection, soundPath, multicastFactor - 1)
      )
      burpTimer = new Date()
    } else VoiceConnection.disconnect()
  }

  /*
const myPromise = new Promise((resolve, reject) => {
    VoiceConnection.play(soundPath)
})
*/
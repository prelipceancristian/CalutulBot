

module.exports = {
    calculateMulticast: function(){
            /**
             * The function calculates a "multicast" value between 1 and 4 and returns it.
             */
            let burpMulticast = Math.floor(Math.random() * 100);
            if(burpMulticast < 15)
                burpMulticast = 4;// 15%
            else if(burpMulticast < 30)
                burpMulticast = 3;// 15%
            else if(burpMulticast < 75)
                burpMulticast = 2;// 25%
            else
                burpMulticast = 1;// 25%
            return burpMulticast;
    },

    multicastPlay: function(VoiceConnection, soundPath, multicastFactor){
        // if(multicastFactor != 0)
        //         {
        //         VoiceConnection.play(soundPath).on("finish", () => multicastPlay(VoiceConnection, soundPath, multicastFactor - 1));
        //         burpTimer = new Date();
        //         }   
        // else
        //     VoiceConnection.disconnect();}
        let i = 0;
        while(i < multicastFactor){
            VoiceConnection.play(soundPath).on("finish", () => i++);
            console.log("i is " + i);
        }
        VoiceConnection.disconnect();
        return Date();
    }


}
module.exports = {
    /**
     * The function calculates a "multicast" value between 1 and 4 and returns it.
     * @returns {number} burpMulticast - the random value between 1 and 4
     */
    calculateMulticast: function(){
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
    }
}
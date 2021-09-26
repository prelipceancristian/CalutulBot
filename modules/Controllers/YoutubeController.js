const axios = require('axios').default
const APIRoot = 'https://youtube.googleapis.com/youtube/v3'
require('dotenv').config()
const APIKey = process.env.YOUTUBE

class YoutubeController {

    prepareQuery(msg) {
        return msg.replace(/ /g, '%20')
    }

    async getLinkResult (searchTerm) {
        const url = `${APIRoot}/search?part=snippet&q=${this.prepareQuery(searchTerm)}&key=${APIKey}`
        const response = await axios.get(url)
        return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`
    }

    async getLinkResults(searchTerm) {
        //return response.data.items.map((x) => ({title: x.snippet.title, id: x.id.videoId}))
    }

}

module.exports = YoutubeController

'use strict'

const axios = require('axios')
const { log } = require('utils/UtlLog.js')

class IsGd {

    constructor () {
        this.baseUrl = 'https://is.gd/create.php?format=simple&url='
    }

    shortenUrl (_longUrl) {
        return new Promise( (resolve, reject) => {
            axios.get(this.baseUrl + encodeURIComponent(_longUrl))
                .then( (res) => {
                    log.write('is.gd shortened url:', res.data)
                    resolve(res.data)
                })
                .catch( (err) => {
                    log.write('is.gd shorten url error:', err)
                    reject(err)
                })
        })
    }
}

const isGdInst = new IsGd()

module.exports.isGd = isGdInst
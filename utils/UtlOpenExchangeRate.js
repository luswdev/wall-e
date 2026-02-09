'use strict'

const schedule = require('node-schedule')
const axios = require('axios')

const { log } = require('utils/UtlLog.js')

class OpenExchangeRate {

    constructor () {
        const { openexchangerates } = require('config.json')

        this.apiBase = 'https://openexchangerates.org/api/latest.json'
        this.apiKey = openexchangerates.key
    }

    async fetch () {
        const res = await axios.get(`${this.apiBase}?app_id=${this.apiKey}`)
        this.data = res.data
    }

    scheduler () {
        log.write('start fetch openexchangerates.org api every hour')
        schedule.scheduleJob('0 * * * *', async () => {
            await this.fetch()
        })
    }

    /**
     * Get exchanged rate between two currencies
     * @param {*} _currency1 input currency
     * @param {*} _currency2 target currency
     * @returns exchange rate from _currency1 to _currency2
     */
    getRate(_currency1, _currency2) {
        const curI2USD = this.data.rates[_currency1]        // _currency1 / USD
        const curII2USD = this.data.rates[_currency2]       // _currency2 / USD

        //                                                                   1
        //                                                            --------------
        // _currency2     _currency2         USD        _currency2      _currency1
        // ----------- = ------------ x ------------ = ------------ x  ------------
        // _currency1         USD        _currency1         USD             USD
        return curII2USD * (1 / curI2USD)                   // _currency2 / _currency1
    }

    getUpdateTime() {
        return this.data.timestamp
    }
}

const openExchangeRateInst = new OpenExchangeRate()
openExchangeRateInst.fetch()
openExchangeRateInst.scheduler()

module.exports.openExchangeRate = openExchangeRateInst

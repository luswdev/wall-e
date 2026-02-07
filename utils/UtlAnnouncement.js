'use strict'

const schedule = require('node-schedule')
const { EmbedBuilder } = require('discord.js')

const { openExchangeRate } = require('utils/UtlOpenExchangeRate.js')
const currencyList = require('data/currencies.json')

class Announcement {

    constructor (_channel, _client) {
        this.client = _client
        _client.channels.fetch(_channel).then( (ch) => {
            this.channel = ch
            this.send(['USD', 'KRW'])
        })
    }

    send (_currencies) {
        const embed = this.buildMessage(_currencies)
        this.channel.send(embed)
    }

    buildMessage (_currencies) {
        const embed = new EmbedBuilder()
            .setTitle(`Today's exchanged rate ${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`)
            .setColor('#D4AF37')
            .setFooter({ text: 'Powered by OpenExchangeRate', iconURL: this.client.user.displayAvatarURL()})
            .setTimestamp()

        let announcements = ''
        for (let currency of _currencies) {
            const rate = openExchangeRate.getRate("TWD", currency)
            if (rate > 1) {
                announcements += `1 :${currencyList["TWD"]}:\`TWD\` = \`${rate.toFixed(6)}\` :${currencyList[currency]}:\`${currency}\`\n`
            } else {
                announcements += `1 :${currencyList[currency]}:\`${currency}\` = \`${(1/rate).toFixed(6)}\` :${currencyList["TWD"]}:\`TWD\`\n`
            }
        }
        embed.setDescription(announcements)
        return { embeds: [embed] }
    }

    scheduler () {
        schedule.scheduleJob('30 8 * * *', async () => {
            this.send(['USD', 'KRW'])
        })
    }

}

module.exports = Announcement

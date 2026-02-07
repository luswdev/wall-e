'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { log } = require('utils/UtlLog.js')
const { isGd } = require('utils/UtlIsGd.js')

class CmdShortUrl extends CmdBase {

    constructor () {
        super('surl', [
            { type: 'string', name: 'url', info: 'URL to shorten'},
        ])
    }

    async doCmd (_interaction, _client) {
        const url2shorten = _interaction.options.getString('url') ?? ''
        const reply = await this.buildMessage(url2shorten, _interaction, _client)
        return reply
    }

    async buildMessage (_url2shorten, _interaction, _client) {
        const embed = new EmbedBuilder()
            .setTitle(`Shortened URL`)
            .setColor('#9B59B6')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        try {
            let shortenedUrl = await isGd.shortenUrl(_url2shorten)
            embed.setDescription(`➡️ ${shortenedUrl}`)
            return { embeds: [embed] }
        } catch (error) {
            embed.setDescription(`Error shortening URL: ${error.message}`)
            return { embeds: [embed] }
        }
    }
}

module.exports = CmdShortUrl

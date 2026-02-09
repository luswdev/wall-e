'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { isGd } = require('utils/UtlIsGd.js')

class CmdShortUrl extends CmdBase {

    constructor () {
        super('surl')
    }

    async doCmd (_interaction) {
        const url2shorten = _interaction.options.getString('url') ?? ''
        const reply = await this.buildMessage(url2shorten, _interaction)
        return reply
    }

    async buildMessage (_url2shorten, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:browser:1470372416034177187> Shortened URL`)
            .setColor('#9B59B6')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        try {
            let shortenedUrl = await isGd.shortenUrl(_url2shorten)
            embed.setDescription(`${shortenedUrl}\n\n(original for: \`${_url2shorten}\`)`)
            return { embeds: [embed] }
        } catch (error) {
            embed.setDescription(`Error shortening URL: ${error.message}`)
            return { embeds: [embed] }
        }
    }
}

module.exports = CmdShortUrl

'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { qrcodeGen } = require('utils/UtlQRCodeGen.js')

class CmdQRCode extends CmdBase {

    constructor () {
        super('qrcode', [
            { type: 'string', name: 'text', info: 'text to generate QR code for'},
        ])
    }

    async doCmd (_interaction) {
        const text2gen = _interaction.options.getString('text') ?? ''
        const reply = await this.buildMessage(text2gen, _interaction)
        return reply
    }

    async buildMessage (_text2gen, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:qrcode:1470370977899745310> QR Code Generator`)
            .setColor('#2980B9')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        try {
            let qrcodeFilePath = await qrcodeGen.genQRCode(_text2gen)
            embed.setDescription(`\`${_text2gen}\``)
            embed.setImage(`attachment://${qrcodeFilePath.split('/').pop()}`)
            return { embeds: [embed], files: [qrcodeFilePath] }
        } catch (error) {
            embed.setDescription(`Error generating QR code: ${error.message}`)
            return { embeds: [embed] }
        }
    }
}

module.exports = CmdQRCode

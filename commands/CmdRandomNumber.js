'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { random } = require('utils/UtlRandom.js')

class CmdRandomNumber extends CmdBase {

    constructor () {
        super('random')
    }

    doCmd (_interaction) {
        random.initRandom()
        const range = _interaction.options.getInteger('range') ?? 1
        const reply = this.buildMessage(range, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        random.initRandom()
        const range = _btn.range
        const reply = this.buildMessage(range, _interaction)
        return reply
    }

    buildMessage (_range, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:shuffle:1470564647902908515> Random Number!`)
            .setColor('#48C9B0')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        const randomIndex = random.getRandomRange(_range)
        const pickedNumber = randomIndex + 1

        embed.setDescription(`I picked: **${pickedNumber}**\n\n(from: 1 to ${_range})`)

        const btn = { cmd: this.cmdKey, range: _range }

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btn))
                .setLabel('Pick Again')
                .setStyle(ButtonStyle.Primary)
            )

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomNumber

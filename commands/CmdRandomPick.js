'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { random } = require('utils/UtlRandom.js')

class CmdRandomPick extends CmdBase {

    constructor () {
        super('rpick')
    }

    doCmd (_interaction) {
        random.initRandom()
        const item1 = _interaction.options.getString('item1') ?? ''
        const item2 = _interaction.options.getString('item2') ?? ''
        const reply = this.buildMessage(item1, item2, _interaction)
        return reply
    }

    doButton (_btn, _interaction) {
        random.initRandom()
        const item1 = _btn.item1
        const item2 = _btn.item2
        const reply = this.buildMessage(item1, item2, _interaction)
        return reply
    }

    buildMessage (_item1, _item2, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:casino:1470371657041317939> Random Picker!`)
            .setColor('#F1948A')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        const randomIndex = random.getRandomRange(2)
        const pickedItem = randomIndex === 0 ? _item1 : _item2

        embed.setDescription(`<@${_interaction.user.id}>, I picked: **${pickedItem}**\n\n(from: \`${_item1}\` and \`${_item2}\`)`)

        const btn = {cmd: this.cmdKey, item1: _item1, item2: _item2 }

        const row = new ActionRowBuilder()
            .addComponents( new ButtonBuilder()
                .setCustomId(JSON.stringify(btn))
                .setLabel('Pick Again')
                .setStyle(ButtonStyle.Primary)
            )

        return { embeds: [embed], components: [row] }
    }
}

module.exports = CmdRandomPick

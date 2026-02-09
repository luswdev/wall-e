'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { random } = require('utils/UtlRandom.js')

class CmdRandomPick extends CmdBase {

    constructor () {
        super('rpick', [
            { type: 'string', name: 'item1', info: 'first item to pick from' , required: true },
            { type: 'string', name: 'item2', info: 'second item to pick from' , required: true },
        ])
    }

    async doCmd (_interaction, _client) {
        random.initRandom()
        const item1 = _interaction.options.getString('item1') ?? ''
        const item2 = _interaction.options.getString('item2') ?? ''
        const reply = await this.buildMessage(item1, item2, _interaction, _client)
        return reply
    }

    async buildMessage (_item1, _item2, _interaction, _client) {
        const embed = new EmbedBuilder()
            .setTitle(`❓ Random Picker!`)
            .setColor('#F1948A')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        const randomIndex = random.getRandomRange(2)
        const pickedItem = randomIndex === 0 ? _item1 : _item2

        embed.setDescription(`I picked: **${pickedItem}**`)

        return { embeds: [embed] }
    }
}

module.exports = CmdRandomPick

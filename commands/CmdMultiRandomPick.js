'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')
const { random } = require('utils/UtlRandom.js')

class CmdRandomPick extends CmdBase {

    constructor () {
        super('mrpick', [
            { type: 'string', name: 'items', info: 'items to pick from (use , to separate items, eg: "apple, banana, cherry")' , required: true },
        ])
    }

    async doCmd (_interaction, _client) {
        random.initRandom()
        const items = _interaction.options.getString('items') ?? ''
        const itemsArray = items.split(',').map(item => item.trim())
        const reply = await this.buildMessage(itemsArray, _interaction, _client)
        return reply
    }

    async doButton (_btn, _interaction, _client) {
        random.initRandom()
        const itemsArray = _btn.items
        const reply = await this.buildMessage(itemsArray, _interaction, _client)
        return reply
    }

    async buildMessage (_itemsArray, _interaction, _client) {
        const embed = new EmbedBuilder()
            .setTitle(`<:d20:1470395769352880268> Random Picker!`)
            .setColor('#F1948A')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        const randomIndex = random.getRandomRange(_itemsArray.length)
        const pickedItem = _itemsArray[randomIndex]

        embed.setDescription(`I picked: **${pickedItem}**\n\n(from: ${_itemsArray.map(item => `\`${item}\``).join(', ')})`)

        const btn = {cmd: this.cmdKey, items: _itemsArray }

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

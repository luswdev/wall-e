'use strict'

const { EmbedBuilder } = require('discord.js')

const CmdBase = require('commands/CmdBase.js')

const { openExchangeRate } = require('utils/UtlOpenExchangeRate.js')
const currencyList = require('data/currencies.json')

class CmdGetCurrency extends CmdBase {

    constructor () {
        super('currency')
    }

    doCmd (_interaction) {
        const price = _interaction.options.getInteger('price') ?? 1
        const input_currency = _interaction.options.getString('currency1') ?? 'USD'
        const target_currency = _interaction.options.getString('currency2') ?? 'TWD'
        const reply = this.buildMessage(input_currency.toUpperCase(), target_currency.toUpperCase(), price, _interaction)
        return reply
    }

    buildMessage (_input_currency, _target_currency, _price, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:dollar:1470373083457261568> Currency Conversion`)
            .setColor('#D4AF37')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL()})
            .setTimestamp()

        const rate = openExchangeRate.getRate(_input_currency, _target_currency) // _target_currency / _input_currency

        let description = `${_price} :${currencyList[_input_currency]}:\`${_input_currency}\` = \`${(rate * _price).toFixed(6)}\` :${currencyList[_target_currency]}:\`${_target_currency}\`\n`
        description += `\nPowered by [OpenExchangeRate](https://openexchangerates.org/), last updated at <t:${openExchangeRate.getUpdateTime()}:F>`

        embed.setDescription(description)
        return { embeds: [embed] }
    }
}

module.exports = CmdGetCurrency

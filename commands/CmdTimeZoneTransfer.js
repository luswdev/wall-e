'use strict'

const { EmbedBuilder } = require('discord.js')

const cityTimezones = require('city-timezones');

const CmdBase = require('commands/CmdBase.js')

const { log } = require('utils/UtlLog.js')

class CmdTimeZoneTransfer extends CmdBase {

    constructor () {
        super('tztrans')
    }

    doCmd (_interaction) {
        const from_tz = _interaction.options.getString('from_tz') ?? ''
        const to_tz = _interaction.options.getString('to_tz') ?? ''
        const time = _interaction.options.getString('time') ?? ''
        const reply = this.buildMessage(from_tz, to_tz, time, _interaction)
        return reply
    }

    buildMessage (_from_tz, _to_tz, _time, _interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`<:clock:1470729126477299834> Timezone Transfer`)
            .setColor('#F6339A')
            .setFooter({ text: `Requested by ${_interaction.user.tag}`, iconURL: _interaction.user.avatarURL() })
            .setTimestamp()

        let fromCity = _from_tz ? cityTimezones.findFromCityStateProvince(_from_tz) : undefined;
        let toCity = cityTimezones.findFromCityStateProvince(_to_tz);

        if (fromCity && fromCity.length === 0) {
            embed.setDescription(`Error: Could not find timezone for '${_from_tz}'`)
            return { embeds: [embed] }
        }

        if (toCity.length === 0) {
            embed.setDescription(`Error: Could not find timezone for '${_to_tz}'`)
            return { embeds: [embed] }
        }

        let dateInFromTz;
        if (_time) {
            // if time is given, need all timezone to calculate transformation
            if (!fromCity) {
                embed.setDescription(`Error: \`from_tz\` is required for given time mode.`)
                return { embeds: [embed] }
            }

            // if date is not provided, use current date
            if (_time.indexOf('-') === -1) {
                _time = new Date().toISOString().split('T')[0] + ' ' + _time;
            }
            dateInFromTz = new Date(new Date(_time).toLocaleString("en-US", { timeZone: fromCity[0].timezone }));
        } else {
            // if from_tz is not provided, just use current time and not care about timezone
            dateInFromTz = new Date(new Date().toLocaleString("en-US"));
        }

        let options = {
            timeZone: toCity[0].timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        let formatter = new Intl.DateTimeFormat([], options);
        let parts = formatter.formatToParts(dateInFromTz);
        let formattedDate = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value} ` +
                            `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}`;

        let resultStr
        if (fromCity) {
            resultStr = `${_time} in \`${fromCity[0].timezone}\` is: \n\n**${formattedDate}** in \`${toCity[0].timezone}\``;
        } else {
            resultStr = `Current time in \`${toCity[1].timezone}\` is: \n\n**${formattedDate}**`;
        }

        embed.setDescription(resultStr)
        return { embeds: [embed] }
    }
}

module.exports = CmdTimeZoneTransfer

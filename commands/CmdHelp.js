'use strict'

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { version } = require('package.json')

const cmds = require('commands/cmds.json')
const CmdBase = require('commands/CmdBase.js')

const { log } = require('utils/UtlLog.js')


class CmdHelp extends CmdBase {

    constructor () {
        let choices = []
        for (let cmd of cmds) {
            if (cmd.permission) {
                continue
            }

            choices.push({name: cmd.info, value: cmd.value})
        }

        super('help', [{ type: 'string', name: 'command', info: 'Show help for a specific command', choices: choices }])

        this.choices = choices
    }

    doCmd (_interaction, _client) {
        const cmd = _interaction.options.getString('command') ?? ''
        const reply = this.buildMessage(cmd, _client)
        return reply
    }

    doSelect (_option, _interaction, _client) {
        const cmd = _option.res
        const reply = this.buildMessage(cmd, _client)
        return reply
    }

    buildCmdSelect (_curCmd) {
        const row = new ActionRowBuilder()
        const selected = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Which command to show?')

        for (let cmd of cmds) {
            if (cmd.permission) {
                continue
            }

            const val = {
                cmd: this.cmdKey,
                res: cmd.value,
            }

            selected.addOptions([
                new StringSelectMenuOptionBuilder()
                    .setDefault(cmd.value === _curCmd)
                    .setDescription(cmd.info)
                    .setEmoji(cmd.icon)
                    .setLabel(cmd.value)
                    .setValue(JSON.stringify(val)),
            ])
        }
        row.addComponents(selected)

        return row
    }

    buildMessage (_cmd, _client) {
        let isCmd = false
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: _client.user.username, iconURL: _client.user.displayAvatarURL() })
            .setColor('#3498DB')
            .setThumbnail(_client.user.displayAvatarURL())
            .setFooter({ text: `A agent Discord bot`, iconURL: _client.user.displayAvatarURL() })

        for (let cmd of cmds) {
            if (cmd.value === _cmd) {
                log.write('found command info for:', cmd.value)

                let rawCmd = _client.commands.toJSON().find( (c) => c.name === cmd.value )
                isCmd = true

                let description = cmd.details.map( (line) => `- ${line}` ).join('\n')
                let usage = cmd.arguments.length ? `[${cmd.arguments.join(' ')}]` : ''
                let cmdID = `</${rawCmd.name}:${rawCmd.id}>`
                let examples = cmd.examples.map( (elem, i) => `${i + 1}. ${elem.explanation}\n` +
                                                `> ${elem.command.replace(rawCmd.name, cmdID)} \n`).join('\n')

                infoEmbed.setTitle(`${cmd.icon} | ${cmd.value}`)
                    .setDescription(description)
                    .addFields(
                        { name: 'Usage', value: `\`\`\`/${cmd.value} ${usage}\`\`\`` },
                        { name: 'Example', value: `${examples}` },
                    )

                if (cmd.thumbnail !== '') {
                    infoEmbed.setThumbnail(cmd.thumbnail)
                }
                break
            }
        }

        if (!isCmd) {
            let description = ''
            description += `> A agent Discord bot\n`
            description += `- Please click select menu to see command information.\n`
            description += `- With others question, please ask to developer.\n\n`

            let botInfo = ''
            botInfo += `\`${_client.botInfo.serverCnt.toLocaleString()}\` servers(s)\n`
            botInfo += `\`${_client.botInfo.memberCnt.toLocaleString()}\` member(s)\n`

            infoEmbed.setDescription(description)
                .addFields(
                    { name: '📊 System Information', value: botInfo },
                    { name: `<:gear:1470402467219902574> Version`, value: `${version} (<t:${Math.floor(_client.startTimestamp / 1000)}>)` },
                )
        }

        // const row = new ActionRowBuilder()
        //     .addComponents( new ButtonBuilder()
        //         .setURL(this.homeURL)
        //         .setLabel('Information')
        //         .setStyle(ButtonStyle.Link)
        //         .setEmoji('<:splatoonbot:1042279520759185478>'),
        //     )

        const list = this.buildCmdSelect(_cmd)

        log.write('embedded:', infoEmbed)

        return { embeds: [infoEmbed], components: [list], ephemeral: isCmd }
    }
}

module.exports = CmdHelp

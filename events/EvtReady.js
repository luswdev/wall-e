'use strict'

const { Collection, ActivityType } = require('discord.js')
const EvtBase = require('events/EvtBase')

const { bot } = require('config.json')

const { log } = require('utils/UtlLog.js')
const ErrorHandler = require('utils/UtlErrHandler.js')
const Announcement = require('utils/UtlAnnouncement.js')
const BotInfo = require('utils/UtlBotInfo.js')

class EvtReady extends EvtBase {

    constructor () {
        super('ready')
    }

    async eventCallback (_client) {
        _client.user.setPresence({ activities: [{ name: 'Evaaaaa', type: ActivityType.Custom }], status: 'online' });

        _client.errHandler = new ErrorHandler(_client, bot.debug)

        _client.commands = new Collection()
        _client.commands = await _client.application.commands.fetch()

        _client.startTimestamp = Date.now()

        _client.announcement = new Announcement(bot.announcement, _client)
        _client.announcement.scheduler()

        _client.botInfo = new BotInfo(_client)
        _client.botInfo.update()
        _client.botInfo.schedule()

        log.write('bot ready')
    }
}

module.exports = EvtReady

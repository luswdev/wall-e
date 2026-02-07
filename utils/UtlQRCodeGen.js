'use strict'

const { mkdirSync, writeFileSync, createWriteStream } = require('fs')
const qrcode = require('qrcode')

const { log } = require('utils/UtlLog.js')

class QRCodeGen {

    constructor () {
        const { qrcode } = require('config.json')

        this.out_dir = qrcode.out_dir
        this.max_files = qrcode.max_temp_files
        this.current_file_count = 0

        mkdirSync(this.out_dir, { recursive: true })
    }

    genQRCode(_text2gen) {
        this.current_file_count += 1
        this.current_file_count %= this.max_files

        const filename = `${this.out_dir}discord-qrcode-gen-temp-${this.current_file_count}.png`

        return new Promise((resolve, reject) => {
            qrcode.toFile(filename,
                _text2gen,
                {
                    color: {
                        dark: '#2980B9',
                    },
                },
                function (error) {
                    if (error) {
                        log.write('error generating QR code:', error)
                        reject(error)
                    }

                    log.write('QR code generated at:', filename)
                    resolve(filename)
                }
            )
        })
    }
}

const qrcodeInst = new QRCodeGen()

module.exports.qrcodeGen = qrcodeInst

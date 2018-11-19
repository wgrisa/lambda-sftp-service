'use strict'

var Client = require('ssh2').Client

module.exports.uploadFtp = (event, context, callback) => {
  const host = process.env.FTP_HOST || 'localhost'
  const port = process.env.FTP_PORT || 22
  const username = process.env.FTP_USER || 'testuser'
  const password = process.env.FTP_PASS || 'testpass'
  const path = process.env.UPLOAD_PATH || '/upload'
  const fileName = Math.round(new Date().getTime() / 1000)
  const extension = process.env.FILE_EXTENSION || 'txt'
  const fullFilePath = `${path}/${fileName}.${extension}`
  const fileContent = event.Records ? event.Records[0].Sns.Message : event

  var conn = new Client()

  conn
    .on('ready', function() {
      console.log(`Connected to ${host}:${port}`)
      conn.sftp(function(err, sftp) {
        if (err) {
          console.log('Error creating SFTP', `\n${err}\n`)
          throw err
        }

        sftp.writeFile(`${fullFilePath}`, fileContent, (err) => {
          err ? console.log('Error writing file', `\n${err}\n`) : console.log('\nSuccess uploading file!\n')
        })

        sftp.readFile(`${fullFilePath}`, null, (err, contentBuffer) => {
          console.log(`Reading file ${fullFilePath}`)

          err
            ? console.log(`Error reading ${fullFilePath}`, `\n${err}\n`)
            : console.log(`File content:`, `\n\n${contentBuffer.toString()}\n`)

          console.log('Closing connection')
          conn.end()
        })
      })
    })
    .connect({
      host,
      port,
      username,
      password,
    })

  callback(null, {
    message: 'Your function executed successfully',
    event,
  })
}

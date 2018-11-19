# SFTP Lambda Service

Lambda service dedicated to upload events to a SFTP server.

This service uses the [SSH2](https://www.npmjs.com/package/ssh2) NPM package to handle SFTP.

## Environment Variables

- FTP_HOST `default: localhost`
- FTP_PORT `default: 22`
- FTP_USER `default: testuser`
- FTP_PASS `default: testpass`
- UPLOAD_PATH `default: /upload`
- FILE_EXTENSION `default: txt`

The file name is generated as:

- `Math.round(new Date().getTime() / 1000)`
- Full file name is: `${UPLOAD_PATH}/${fileName}.${FILE_EXTENSION}`

## Testing the function locally

In order to test the function locally follow these steps:

1.  Start a local FTP server
    - `docker run --name localsftpserver -p 22:22 -d atmoz/sftp testuser:testpass:::upload`
2.  Execute the function
    - `sls invoke local -f uploadFtp -d "HELLO SFTP WORLD"`

## Checking uploaded files

Execute the following commands:

1.  `docker exec -ti localsftpserver /bin/bash`
1.  `cd home/testuser/upload/`

## Deploy

`sls deploy`

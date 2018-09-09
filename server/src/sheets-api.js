const fs = require('fs')
const readline = require('readline')
const util = require('util')
const path = require('path')
const {google} = require('googleapis')

const credentialsFolder = path.join(__dirname, '..', '.credentials')

if (!process.env.SPREADSHEET_ID) {
  throw new Error('No SPREADSHEET_ID has been set in the .env file')
}

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets'
]

const TOKEN_PATH = path.join(credentialsFolder, 'token.json')
const CREDENTIALS_PATH = path.join(credentialsFolder, 'credentials.json')

const BASE_SHEET_OPTS = {
  spreadsheetId: process.env.SPREADSHEET_ID
}

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

let sheets

const initialize = async () => {
  const credentials = await readFile(CREDENTIALS_PATH)
  const auth = await authorize(JSON.parse(credentials))
  setGlobalAuthClient(auth)
}

const setGlobalAuthClient = async (auth) => {
  google.options({ auth })
  sheets = google.sheets({version: 'v4', auth})
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
const authorize = async (credentials) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])
  let token
  try {
    const tokenString = await readFile(TOKEN_PATH)
    token = JSON.parse(tokenString)
  } catch (err) {
    token = await getNewToken(oAuth2Client)
  }

  oAuth2Client.setCredentials(token)
  return oAuth2Client
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the token.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
const getNewToken = (oAuth2Client) => {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close()
      oAuth2Client.getToken(code, async (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        await storeToken(token)
        resolve(token)
      })
    })
  })
}

const storeToken = async (token) => {
  try {
    writeFile(TOKEN_PATH, JSON.stringify(token))
  } catch (err) {
    console.error(err)
  }

  console.log('Token stored to', TOKEN_PATH)
}

const getSheetValues = async (opts) => {
  if (!sheets) {
    await initialize()
  }

  return sheets.spreadsheets.values.get({...BASE_SHEET_OPTS, ...opts})
}

const appendSheetValues = async (opts) => {
  if (!sheets) {
    await initialize()
  }

  return sheets.spreadsheets.values.append({...BASE_SHEET_OPTS, ...opts})
}

const updateSheetValues = async (opts) => {
  if (!sheets) {
    await initialize()
  }

  return sheets.spreadsheets.values.update({...BASE_SHEET_OPTS, ...opts})
}


module.exports = {
  initialize, getSheetValues, appendSheetValues, updateSheetValues
}

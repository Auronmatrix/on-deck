# on-deck

## Getting started

- `git clone https://github.com/Auronmatrix/on-deck.git`
- `cd on-deck`

### Setup Server with Google Sheets

- `cd server`
- `cp .env.example .env` # Copy the example dotenv file to your own
- Add your Google Spreadsheet ID to the .env file
- `npm i`
- `mkdir .credentials`

On the first run, you will need to setup google sheets and the API. 

 1. Visit https://developers.google.com/sheets/api/quickstart/nodejs and click `ENABLE THE GOOGLE SHEETS API` button
    - Create your project and authorize
 2. Download your credentials.json file and copy it to the `on-dec/server/.credentials` folder
 3. `node index.js`
 4. Follow the instructions in the command prompt allowing authorization to your google sheet document

#### To Run 

- `node index.js`
- Requests served on localhost:8080

### Run front-end

- `cd on-deck/client`
- `npm i`
- `npm start`
- Requests served on localhost:3000
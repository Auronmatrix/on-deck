require('dotenv').config()
const restify = require('restify')

const server = restify.createServer()
const schoolService = require('./src/school-service')

server.get('/students/:class', async (req, res, next) => {
  console.log('[Get Students]')
  const className = 'G4'
  const students = await schoolService.getStudents({ className })
  res.json(students)
  next()
})

server.listen(8080, async () => {
  console.log('[Server] %s listening at %s', server.name, server.url)
  console.log('[Server] Setup for tracking to spreadsheet \n')
  console.log('[Server] https://docs.google.com/spreadsheets/d/' + process.env.SPREADSHEET_ID)
  const info = await schoolService.getInfo()
  console.log('[Server] Info')
  info.forEach(row => console.log('[INFO] ' + row.reduce((out, entry) => out + entry + '\t', '')))
})

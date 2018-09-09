require('dotenv').config()
const restify = require('restify')

const server = restify.createServer()
const schoolService = require('./src/school-service')

const restifyBodyParser = require('restify-plugins').bodyParser
server.use(restifyBodyParser())

server.get('/students/:class', async (req, res, next) => {
  const opts = {
    className: req.params.class
  }

  console.log('[Get Students] %s', JSON.stringify(opts))
  
  const students = await schoolService.getStudents(opts)
  res.json(students)
  next()
})

server.post('/attendance/:class/:date', async (req, res, next) => {
  try {
    let opts = {
      className: req.params.class
    }

    const date = req.params.date
    const data = JSON.parse(req.body)

    const students = await schoolService.getStudents(opts)

    const row = new Array(students.length)
    Object.keys(data.students).forEach(id => {
      const index = students.indexOf(data.students[id].name)
      row[index] = data.students[id].status
    })

    row[0] = date
    opts.values = row

    console.log('[Post Attendance] %s', JSON.stringify(opts))

    const update = await schoolService.upsertAttendance(opts)
    res.json(update)
  } catch (err) {
    console.error(err)
    res.json(500, { code: 500, error: err.message })
  }
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

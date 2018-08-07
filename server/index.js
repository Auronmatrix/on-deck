const restify = require('restify')
const fs = require('fs')

var server = restify.createServer()

server.get('/students/:class', async (req, res, next) => {
  const content = fs.readFileSync('./data/students.json')
  console.log(req.params)
  res.json(JSON.parse(content))
  next()
})

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
})

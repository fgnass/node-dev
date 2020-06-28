http = require 'http'
message = require './message'

server = http.createServer (req, res) ->
    res.writeHead 200,
        'Content-Type': 'text/plain'

    res.write message
    res.end '\n'

server.once 'listening', ->
  addr = this.address()
  console.log 'Server listening on %s:%s', addr.address, addr.port
  console.log message
.listen 0

process.once 'SIGTERM', -> server.close()
process.once 'exit', -> console.log 'exit'

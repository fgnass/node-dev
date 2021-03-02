import { createServer, Server } from 'http';
import * as message from '../message';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end('\n');
});

server
  .once('listening', function (this: Server) {
    const addressInfo = this.address();
    const address =
      typeof addressInfo === 'string' ? addressInfo : `${addressInfo.address}:${addressInfo.port}`;

    console.log(`Server listening on ${address}`);
    console.log(message);
  })
  .listen(0);

process.once('SIGTERM', () => {
  if (server.listening) {
    server.close();
  }
});

process.once('beforeExit', () => {
  console.log('exit');
});

export default server;

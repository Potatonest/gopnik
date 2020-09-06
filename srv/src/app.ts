import http from 'http';
import WebSocket from 'ws';
import { room } from './controllers/room';

const main = async () => {
    const server = http.createServer();

    const wss = new WebSocket.Server({ server, path: '/room' });
    wss.addListener('connection', room);

    server.listen(8888);

}

main();
const http = require('http');

const server = http.createServer((req, res) => {

    console.log(`URL accesat: ${req.url}`);
    if (req.url === '/luca-app/service1/hello') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from Service 1');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('merge');
    }
});

server.listen(3001, () => {
    console.log('Service 1 is running on http://localhost:3001');
});

const http = require('http');
const server = http.createServer((req,res) => {
    res.end('Fisrt node js comment')
});
server.listen(3000);
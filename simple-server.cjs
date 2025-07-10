const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  if (!fs.existsSync(filePath) && !req.url.includes('.')) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }
  
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  }[ext] || 'text/plain';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3001, '0.0.0.0', () => {
  console.log('🚀 Server running at:');
  console.log('📱 http://172.31.136.169:3001/');
  console.log('🌐 http://10.255.255.254:3001/');
  console.log('💻 http://localhost:3001/');
});
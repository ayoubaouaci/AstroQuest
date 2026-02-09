const https = require('https');

const data = "System: You are an oracle.\nUser: Hello!\nAI: Greetings.\nUser: Tell me a secret.";

const options = {
    hostname: 'text.pollinations.ai',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
        console.log("POST Status:", res.statusCode);
        console.log("Response:", responseData);
    });
});

req.on('error', error => {
    console.error("Error:", error);
});

req.write(data);
req.end();

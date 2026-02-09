const https = require('https');

const jsonData = JSON.stringify({
    messages: [
        { role: 'system', content: 'You are a helpful oracle.' },
        { role: 'user', content: 'Hello, are you there?' }
    ],
    model: 'openai'
});

const options = {
    hostname: 'text.pollinations.ai',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData)
    }
};

const req = https.request(options, res => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
        console.log("POST JSON Status:", res.statusCode);
        console.log("Response:", responseData);
    });
});

req.on('error', error => {
    console.error("Error:", error);
});

req.write(jsonData);
req.end();

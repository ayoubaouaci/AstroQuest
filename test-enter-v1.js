const https = require('https');

const API_KEY = "sk_32f2X93JnDIVWeC6b4a4kj0j2yR4850v";

const data = JSON.stringify({
    messages: [
        { role: 'system', content: 'You are a helpful oracle.' },
        { role: 'user', content: 'Hello, test message!' }
    ],
    model: 'openai'
});

const options = {
    hostname: 'enter.pollinations.ai',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log("Testing enter.pollinations.ai/v1/chat/completions...");

const req = https.request(options, (res) => {
    let responseData = '';
    console.log("Status:", res.statusCode);
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
        console.log("Response:", responseData);
    });
});

req.on('error', (error) => {
    console.error("Error:", error.message);
});

req.write(data);
req.end();

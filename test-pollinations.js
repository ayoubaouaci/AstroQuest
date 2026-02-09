const https = require('https');

const prompt = "You are a mystical oracle. Say hello.";
// Pollinations often takes the prompt in the URL path or as a simple GET
// Trying the direct URL method which is simplest
const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

console.log("Testing Pollinations.ai with URL:", url);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        console.log("Response:", data.substring(0, 200)); // Show beginning
    });
}).on('error', err => {
    console.error("Error:", err.message);
});

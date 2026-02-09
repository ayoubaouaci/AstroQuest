const https = require('https');

const KEY = "sk_32f2X93JnDIVWeC6b4a4kj0j2yR4850v";

const providers = [
    { name: "OpenAI", host: "api.openai.com", path: "/v1/chat/completions", model: "gpt-3.5-turbo" },
    { name: "DeepSeek", host: "api.deepseek.com", path: "/chat/completions", model: "deepseek-chat" },
    { name: "Mistral", host: "api.mistral.ai", path: "/v1/chat/completions", model: "mistral-tiny" },
    { name: "Groq", host: "api.groq.com", path: "/openai/v1/chat/completions", model: "mixtral-8x7b-32768" }
];

function testProvider(provider) {
    const data = JSON.stringify({
        model: provider.model,
        messages: [{ role: "user", content: "Hello" }]
    });

    const options = {
        hostname: provider.host,
        path: provider.path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${KEY}`
        }
    };

    const req = https.request(options, (res) => {
        console.log(`[${provider.name}] Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log(`!!! SUCCESS WITH ${provider.name} !!!`);
        }
    });

    req.on('error', (e) => {
        // quiet fail
    });

    req.write(data);
    req.end();
}

console.log("Probing providers with key...");
providers.forEach(testProvider);

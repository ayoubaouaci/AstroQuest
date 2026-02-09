const https = require('https');

const API_KEY = "AIzaSyBIcuwAZIShWdtsvvVZqALTJwATxq7ccPs";

function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    console.log(`Querying: ${url.replace(API_KEY, 'API_KEY')}`);

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.models) {
                    console.log("AVAILABLE MODELS:");
                    json.models.forEach(m => {
                        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                            console.log(`- ${m.name}`);
                        }
                    });
                } else {
                    console.log("No models found in response:", json);
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.log("Raw output:", data);
            }
        });

    }).on('error', (err) => {
        console.error("Error making request:", err);
    });
}

listModels();

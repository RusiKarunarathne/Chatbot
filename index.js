const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/getResponse', async (req, res) => {
    const message = req.query.message;
    const apiKey = 'AIzaSyAOeUI-LB8Hfe1gPsUh2XGzxSOPaWEDBZ0';
    const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
        "contents": [
            {
                "parts": [
                    {
                        "text": message
                    }
                ]
            }
        ]
    };

    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(modelUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log('API Response:', data); // Log the response data

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0 || !data.candidates[0].content.parts[0].text) {
            throw new Error('Unexpected response format');
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message }); // Send detailed error message in response
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(cors({ origin: true }));

app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'Brak URL' });

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const paragraphs = $('p').map((i, el) => $(el).text()).get();
    const rawText = paragraphs.join('\n').slice(0, 4000);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Jesteś pomocnym redaktorem." },
        {
          role: "user",
          content: `Przeredaguj i streść poniższy artykuł w ładnej, przejrzystej formie po polsku:\n\n${rawText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const result = completion.data.choices[0].message.content;
    res.json({ summary: result });

  } catch (err) {
    console.error("❌ Błąd podczas zapytania do OpenAI:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Dane błędu:", JSON.stringify(err.response.data, null, 2));
      res.status(500).json({ error: err.response.data.error.message });
    } else {
      console.error("Błąd:", err.message || err);
      res.status(500).json({ error: 'Błąd serwera lub połączenia' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`);
});

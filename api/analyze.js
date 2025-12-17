// Vercel Serverless Function for image analysis
import formidable from 'formidable';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse form data
        const form = formidable({});
        const [fields, files] = await form.parse(req);

        const imageFile = files.image?.[0];
        const apiKey = fields.apiKey?.[0];

        if (!imageFile) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Read file and convert to base64
        const fs = require('fs');
        const imageBuffer = fs.readFileSync(imageFile.filepath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = imageFile.mimetype || 'image/jpeg';
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        // Call OpenAI Vision API
        const analysisResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Analyze this product image in detail. Provide:
1. Product description (what is it?)
2. Key visual features (colors, shapes, materials, style)
3. Lighting and composition
4. Background and setting
5. Overall quality and mood

Then, create 3 different creative prompts for generating similar or improved product images. Each prompt should be detailed and suitable for AI image generation (DALL-E, Midjourney, Stable Diffusion, etc.).

Format your response as JSON:
{
  "analysis": {
    "description": "...",
    "features": "...",
    "lighting": "...",
    "background": "...",
    "mood": "..."
  },
  "prompts": [
    {
      "title": "Prompt 1 Title",
      "prompt": "Detailed prompt text..."
    },
    {
      "title": "Prompt 2 Title",
      "prompt": "Detailed prompt text..."
    },
    {
      "title": "Prompt 3 Title",
      "prompt": "Detailed prompt text..."
    }
  ]
}`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1500
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = analysisResponse.data.choices[0].message.content;

        // Parse JSON response
        let analysisData;
        try {
            const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
            const jsonString = jsonMatch ? jsonMatch[1] : content;
            analysisData = JSON.parse(jsonString);
        } catch (e) {
            analysisData = {
                analysis: { raw: content },
                prompts: []
            };
        }

        return res.status(200).json({
            success: true,
            imageUrl: imageUrl,
            analysis: analysisData.analysis,
            prompts: analysisData.prompts
        });

    } catch (error) {
        console.error('Analysis error:', error.response?.data || error.message);
        return res.status(500).json({
            error: 'Failed to analyze image',
            details: error.response?.data?.error?.message || error.message
        });
    }
}

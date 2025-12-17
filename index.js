const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to analyze image using OpenAI GPT-4 Vision
app.post('/api/analyze', async (req, res) => {
    try {
        const { imageData, apiKey } = req.body;

        if (!imageData) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Call OpenAI Vision API to analyze the image
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
                                    url: imageData
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
                },
                timeout: 60000
            }
        );

        const content = analysisResponse.data.choices[0].message.content;
        
        // Try to parse JSON from the response
        let analysisData;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
            const jsonString = jsonMatch ? jsonMatch[1] : content;
            analysisData = JSON.parse(jsonString);
        } catch (e) {
            // If parsing fails, return raw content
            analysisData = {
                analysis: { raw: content },
                prompts: []
            };
        }

        res.json({
            success: true,
            imageUrl: imageData,
            analysis: analysisData.analysis,
            prompts: analysisData.prompts
        });

    } catch (error) {
        console.error('Analysis error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to analyze image',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

// API endpoint to generate image using DALL-E
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, apiKey, size = '1024x1024', quality = 'standard', count = 1 } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Validate size
        const validSizes = ['1024x1024', '1024x1792', '1792x1024'];
        if (!validSizes.includes(size)) {
            return res.status(400).json({ error: 'Invalid size. Must be 1024x1024, 1024x1792, or 1792x1024' });
        }

        // Validate quality
        const validQualities = ['standard', 'hd'];
        if (!validQualities.includes(quality)) {
            return res.status(400).json({ error: 'Invalid quality. Must be standard or hd' });
        }

        const images = [];
        
        // Generate multiple images if requested
        for (let i = 0; i < Math.min(count, 4); i++) {
            try {
                // Call DALL-E API to generate image
                const response = await axios.post(
                    'https://api.openai.com/v1/images/generations',
                    {
                        model: 'dall-e-3',
                        prompt: prompt,
                        n: 1,
                        size: size,
                        quality: quality
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 60000
                    }
                );

                images.push({
                    imageUrl: response.data.data[0].url,
                    revisedPrompt: response.data.data[0].revised_prompt
                });

                // Add delay between requests to avoid rate limiting
                if (i < count - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error(`Error generating image ${i + 1}:`, error.message);
                // Continue with other images even if one fails
            }
        }

        if (images.length === 0) {
            throw new Error('Failed to generate any images');
        }

        res.json({
            success: true,
            images: images,
            count: images.length
        });

    } catch (error) {
        console.error('Generation error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to generate image',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'AI Product Image Analyzer is running!'
    });
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve v2 (Pro Edition)
app.get('/v2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

// Serve original v1
app.get('/v1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve access portal
app.get('/access', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'access.html'));
});

// Keepalive endpoint
app.get('/keepalive', (req, res) => {
    res.json({ 
        status: 'alive', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Access the application at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

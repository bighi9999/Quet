const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// API endpoint to analyze image using OpenAI GPT-4 Vision
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const apiKey = req.body.apiKey;
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Read the uploaded image and convert to base64
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

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
            imageUrl: `/uploads/${req.file.filename}`,
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
        const { prompt, apiKey } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Call DALL-E API to generate image
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard'
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const generatedImageUrl = response.data.data[0].url;
        const revisedPrompt = response.data.data[0].revised_prompt;

        res.json({
            success: true,
            imageUrl: generatedImageUrl,
            revisedPrompt: revisedPrompt
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
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});

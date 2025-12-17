/**
 * Gemini AI Image Analysis Endpoint
 * Using Google's Gemini Pro Vision API
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imageData, apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ 
                error: 'API key is required',
                details: 'Please provide a Google Gemini API key'
            });
        }

        if (!imageData) {
            return res.status(400).json({ 
                error: 'Image data is required',
                details: 'Please provide base64 encoded image data'
            });
        }

        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: `Analyze this product image in detail. Provide:
1. DESCRIPTION: Detailed description of the product
2. TARGET AUDIENCE: Who would be interested in this product
3. MARKETING ANGLE: Best way to market this product
4. VISUAL ELEMENTS: Key visual elements and composition
5. SELLING POINTS: Main selling points

Format your response as JSON with these keys.`
                            },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: base64Image
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 32,
                        topP: 1,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            throw new Error(errorData.error?.message || 'Gemini API error');
        }

        const geminiData = await geminiResponse.json();
        const analysisText = geminiData.candidates[0]?.content?.parts[0]?.text || '';

        // Parse JSON response or create structured data
        let analysis = {};
        try {
            // Try to parse as JSON
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                // Fallback: parse plain text
                analysis = parseTextToStructure(analysisText);
            }
        } catch (e) {
            analysis = parseTextToStructure(analysisText);
        }

        // Generate 3 AI prompts based on analysis
        const prompts = generatePromptsFromAnalysis(analysis);

        return res.status(200).json({
            success: true,
            provider: 'Gemini AI',
            model: 'gemini-1.5-flash',
            analysis,
            prompts,
            rawText: analysisText
        });

    } catch (error) {
        console.error('Gemini analysis error:', error);
        return res.status(500).json({
            error: 'Analysis failed',
            details: error.message,
            provider: 'Gemini AI'
        });
    }
}

function parseTextToStructure(text) {
    const structure = {
        DESCRIPTION: '',
        'TARGET AUDIENCE': '',
        'MARKETING ANGLE': '',
        'VISUAL ELEMENTS': '',
        'SELLING POINTS': ''
    };

    const lines = text.split('\n');
    let currentKey = null;

    for (const line of lines) {
        const trimmed = line.trim();
        
        // Check if line is a key
        for (const key of Object.keys(structure)) {
            if (trimmed.toUpperCase().includes(key)) {
                currentKey = key;
                // Extract value from same line if exists
                const colonIndex = trimmed.indexOf(':');
                if (colonIndex > -1) {
                    structure[key] = trimmed.substring(colonIndex + 1).trim();
                }
                break;
            }
        }
        
        // Append to current key if not a key line
        if (currentKey && !Object.keys(structure).some(k => trimmed.toUpperCase().includes(k))) {
            if (structure[currentKey]) {
                structure[currentKey] += ' ' + trimmed;
            } else {
                structure[currentKey] = trimmed;
            }
        }
    }

    return structure;
}

function generatePromptsFromAnalysis(analysis) {
    const description = analysis.DESCRIPTION || analysis.description || '';
    const visualElements = analysis['VISUAL ELEMENTS'] || analysis.visual_elements || '';
    
    return [
        {
            title: '🎨 Chất lượng cao, chuyên nghiệp',
            prompt: `Professional product photography of ${description}, studio lighting, high-end commercial style, 8K ultra detailed, premium quality, clean white background, professional marketing image`
        },
        {
            title: '✨ Phong cách sáng tạo',
            prompt: `Creative artistic render of ${description}, ${visualElements}, modern aesthetic, vibrant colors, eye-catching composition, commercial advertisement style, trending on behance`
        },
        {
            title: '🌟 Lifestyle & Context',
            prompt: `Lifestyle photography featuring ${description}, real-world usage scenario, natural lighting, authentic atmosphere, relatable context, emotional connection, professional marketing photography`
        }
    ];
}

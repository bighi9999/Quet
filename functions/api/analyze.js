// Cloudflare Pages Function for image analysis
export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const imageFile = formData.get('image');
        const apiKey = formData.get('apiKey');

        if (!imageFile) {
            return new Response(JSON.stringify({ error: 'No image file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Convert image to base64
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const imageUrl = `data:${imageFile.type};base64,${base64Image}`;

        // Store image temporarily (in this case, we'll just use the base64)
        const imageName = `product-${Date.now()}.${imageFile.type.split('/')[1]}`;

        // Call OpenAI Vision API to analyze the image
        const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
            })
        });

        if (!analysisResponse.ok) {
            const error = await analysisResponse.json();
            return new Response(JSON.stringify({
                error: 'Failed to analyze image',
                details: error.error?.message || 'Unknown error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const analysisData = await analysisResponse.json();
        const content = analysisData.choices[0].message.content;

        // Try to parse JSON from the response
        let parsedAnalysis;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
            const jsonString = jsonMatch ? jsonMatch[1] : content;
            parsedAnalysis = JSON.parse(jsonString);
        } catch (e) {
            // If parsing fails, return raw content
            parsedAnalysis = {
                analysis: { raw: content },
                prompts: []
            };
        }

        return new Response(JSON.stringify({
            success: true,
            imageUrl: imageUrl, // Return the base64 image for display
            imageName: imageName,
            analysis: parsedAnalysis.analysis,
            prompts: parsedAnalysis.prompts
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to analyze image',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Cloudflare Pages Function for image generation
export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { prompt, apiKey } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
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

        // Call DALL-E API to generate image
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return new Response(JSON.stringify({
                error: 'Failed to generate image',
                details: error.error?.message || 'Unknown error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const generatedImageUrl = data.data[0].url;
        const revisedPrompt = data.data[0].revised_prompt;

        return new Response(JSON.stringify({
            success: true,
            imageUrl: generatedImageUrl,
            revisedPrompt: revisedPrompt
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Generation error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate image',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

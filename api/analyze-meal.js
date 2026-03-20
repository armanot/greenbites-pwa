export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { imageBase64, mimeType } = req.body || {}

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing imageBase64 or mimeType' })
    }

    const dataUrl = `data:${mimeType};base64,${imageBase64}`

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text:
                  'Analyze this food photo for a meal tracking app. ' +
                  'Identify the most likely meal, estimate calories and cost in MYR, ' +
                  'list detected food items, provide confidence, one short health note, ' +
                  'and 3 practical suggestions. ' +
                  'Be cautious and estimate, do not claim precision.',
              },
              {
                type: 'input_image',
                image_url: dataUrl,
                detail: 'high',
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'meal_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                meal_name: { type: 'string' },
                confidence: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
                estimated_calories: { type: 'integer' },
                estimated_cost: { type: 'number' },
                health_notes: { type: 'string' },
                impact: { type: 'string' },
                detected_items: {
                  type: 'array',
                  items: { type: 'string' },
                },
                suggestions: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 3,
                },
              },
              required: [
                'meal_name',
                'confidence',
                'estimated_calories',
                'estimated_cost',
                'health_notes',
                'impact',
                'detected_items',
                'suggestions',
              ],
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI error:', data)
      return res.status(response.status).json({
        error: data?.error?.message || 'OpenAI request failed',
      })
    }

    const outputText =
      data.output_text ||
      data.output?.[0]?.content?.find((item) => item.type === 'output_text')?.text

    if (!outputText) {
      console.error('Unexpected OpenAI response:', data)
      return res.status(500).json({ error: 'No structured output returned' })
    }

    const parsed = JSON.parse(outputText)

    return res.status(200).json(parsed)
  } catch (error) {
    console.error('analyze-meal error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { animalName, competitionResults, animalType } = await req.json();

    console.log('Generating performance summary for:', animalName);

    const prompt = `You are an expert equestrian analyst specializing in sport horse and pony performance evaluation. 

Create a professional, data-driven performance summary for ${animalName}, a ${animalType}. Base your analysis strictly on the following competition results:

${competitionResults.map((result: any) => 
  `- ${result.competition_name} (${result.competition_date}): ${result.fence_height_cm}cm fences, ${result.faults} faults, placed ${result.placement}/${result.total_competitors}, rider: ${result.rider_name}, location: ${result.location}`
).join('\n')}

Your summary should:
1. Be 2-3 concise paragraphs
2. Highlight key strengths and performance patterns
3. Note progression or consistency trends
4. Mention notable achievements
5. Use professional equestrian terminology
6. Be factual and based only on the provided data
7. Not speculate about price or market value

Write in a confident, professional tone suitable for serious buyers and sellers in the international sport horse market.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert equestrian analyst who creates professional performance summaries for sport horses and ponies.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate summary');
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('Generated summary successfully');

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-performance-summary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
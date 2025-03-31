import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const COHERE_API_KEY = Deno.env.get("COHERE_API_KEY");

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
    const { message, history = [] } = await req.json();
    console.log("Received chat request:", { message, historyLength: history.length });

    // Format the messages for the Cohere API
    const chatHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
      message: msg.content
    }));

    console.log("Sending request to Cohere");
    const cohere_response = await fetch("https://api.cohere.ai/v1/chat", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chat_history: chatHistory,
        model: "command",
        preamble: "You are StudyBot, a friendly AI study assistant. Keep your responses short, clear, and to the point. When using bullet points, use a maximum of 3-4 points. Focus on practical, actionable advice. Be encouraging but brief.",
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!cohere_response.ok) {
      const errorText = await cohere_response.text();
      console.error("Cohere API error:", cohere_response.status, errorText);
      throw new Error(`Cohere API responded with status ${cohere_response.status}: ${errorText}`);
    }

    const data = await cohere_response.json();
    console.log("Received response from Cohere");

    return new Response(
      JSON.stringify({
        response: data.text,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in chat-bot function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request.",
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

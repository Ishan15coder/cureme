export async function askAI(prompt: string) {
  try {
    const res = await fetch("https://api.cohere.ai/v2/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer gX61g34DruTJnYFHDpUmmij89KU4Nfx9fhWDoJ9j",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log("Cohere response:", data);

    if (data.error) {
      return "Error: " + data.error.message;
    }

    return data?.message?.content?.[0]?.text || "No response";
  } catch (error) {
    console.error(error);
    return "Error fetching AI response";
  }
}
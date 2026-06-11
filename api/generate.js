export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert educational content designer. Return valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.4
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq API Error"
      });
    }

    res.status(200).json({
      content: data.choices?.[0]?.message?.content || ""
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

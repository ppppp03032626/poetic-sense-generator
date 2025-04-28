export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;
  const stabilityApiKey = process.env.VITE_STABILITY_API_KEY;

  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stabilityApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "stable-diffusion-xl-beta-v2-2-2",
        aspect_ratio: "1:1",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: error });
    }

    const data = await response.json();
    res.status(200).json({ image_url: data.image_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

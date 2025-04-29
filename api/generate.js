export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;
  const stabilityApiKey = process.env.VITE_STABILITY_API_KEY;

  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('model', 'stable-diffusion-v1-5'); // ⚡ 改成穩定出圖版v1-5
  formData.append('aspect_ratio', '1:1');

  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stabilityApiKey}`,
        "Accept": "application/json",
      },
      body: formData,
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


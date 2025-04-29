export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer hf_xxx`,  // 如果有 Hugging Face Token，可以換掉，沒有的話刪掉這行
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: error });
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    res.status(200).json({ image_url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

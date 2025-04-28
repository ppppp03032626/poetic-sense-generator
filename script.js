// 詩文資料庫（10首，附出處）
const poems = [
  { text: "月黑雁飛高，單于夜遁逃。", author: "王昌齡《出塞》", emotions: ["緊張", "廣闊", "寂靜", "希望"] },
  { text: "枯藤老樹昏鴉，小橋流水人家。", author: "馬致遠《天淨沙·秋思》", emotions: ["蒼涼", "溫柔", "孤獨", "安靜"] },
  { text: "大漠孤煙直，長河落日圓。", author: "王維《使至塞上》", emotions: ["壯闊", "落寞", "廣闊", "寧靜"] },
  { text: "山重水復疑無路，柳暗花明又一村。", author: "陸游《游山西村》", emotions: ["困頓", "驚喜", "重生", "釋懷"] },
  { text: "白日依山盡，黃河入海流。", author: "王之涣《登鸛雀樓》", emotions: ["遼遠", "希望", "超越", "悠遠"] },
  { text: "桃花潭水深千尺，不及汪倫送我情。", author: "李白《贈汪倫》", emotions: ["溫暖", "感激", "依戀", "惆悵"] },
  { text: "千山鳥飛絕，萬徑人蹤滅。", author: "柳宗元《江雪》", emotions: ["孤寂", "冷冽", "靜謐", "超脫"] },
  { text: "獨在異鄉為異客，每逢佳節倍思親。", author: "王維《九月九日憶山東兄弟》", emotions: ["思念", "孤獨", "柔軟", "感傷"] },
  { text: "碧玉妝成一樹高，萬條垂下綠絲絛。", author: "賀知章《詠柳》", emotions: ["清新", "生機", "輕盈", "歡欣"] },
  { text: "人閒桂花落，夜靜春山空。", author: "王維《鳥鳴澗》", emotions: ["寧靜", "空靈", "細膩", "悠遠"] },
];

// 畫面元素
const poemDiv = document.getElementById("poem");
const colorSelect = document.getElementById("color");
const customColorInput = document.getElementById("customColor");
const emotionSelect = document.getElementById("emotion");
const customEmotionInput = document.getElementById("customEmotion");
const descriptionInput = document.getElementById("description");
const generateBtn = document.getElementById("generateBtn");
const refreshBtn = document.getElementById("refreshBtn");
const loadingDiv = document.getElementById("loading");
const resultDiv = document.getElementById("result");

// 當前詩的索引
let currentPoemIndex = 0;

// 隨機選一首詩
function pickRandomPoem() {
  currentPoemIndex = Math.floor(Math.random() * poems.length);
  const selected = poems[currentPoemIndex];
  poemDiv.innerHTML = `<p>${selected.text}</p><small>${selected.author}</small>`;
  refreshEmotions();
}

// 根據詩切換建議情緒
function refreshEmotions() {
  emotionSelect.innerHTML = "";
  poems[currentPoemIndex].emotions.forEach(emotion => {
    const option = document.createElement("option");
    option.value = emotion;
    option.textContent = emotion;
    emotionSelect.appendChild(option);
  });
}

// 生成按鈕事件（這是重點）
generateBtn.addEventListener("click", async () => {
  const selectedColor = customColorInput.value || colorSelect.value;
  const selectedEmotion = customEmotionInput.value || emotionSelect.value;
  const description = descriptionInput.value.trim();

  if (!selectedColor || !selectedEmotion || !description) {
    alert("請填寫所有欄位！");
    return;
  }

  loadingDiv.style.display = "block";
  resultDiv.innerHTML = "";

  const prompt = `A scene inspired by the poem "${poems[currentPoemIndex].text}", feeling ${selectedEmotion}, under a ${selectedColor} tone. User's interpretation: "${description}". Create a poetic and cinematic visual.`;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.image_url) {
      resultDiv.innerHTML = `<img src="${data.image_url}" alt="生成結果">`;
    } else {
      resultDiv.innerHTML = "<p>生成失敗，請稍後再試。</p>";
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>生成時出現錯誤。</p>";
  } finally {
    loadingDiv.style.display = "none";
  }
});

// 換詩按鈕
refreshBtn.addEventListener("click", () => {
  pickRandomPoem();
});

// 初始化
pickRandomPoem();

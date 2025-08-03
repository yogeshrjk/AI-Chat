import axios from "axios";
export async function SpeakText(text) {
  try {
    const response = await axios.post(
      "/api/tts",
      { text },
      {
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const audioUrl = response.data.url;
    console.log(response.data.url);

    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error("TTS Error:", error);
  }
}

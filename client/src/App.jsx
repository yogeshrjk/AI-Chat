import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import { Signup } from "./components/pages/Signup";
import Chat from "./components/ui/Chat";
import { TextToSpeech } from "./components/pages/TextToSpeech";
import { VoiceChat } from "./components/pages/VoiceChat";
import { Settings } from "./components/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Dashboard />}>
          <Route path="/newchat" element={<Chat />} />
          <Route path="/tts" element={<TextToSpeech />} />
          <Route path="/voicechat" element={<VoiceChat />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

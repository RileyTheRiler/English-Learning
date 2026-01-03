import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainMenu from './components/MainMenu';
import WordRain from './games/WordRain';
import FlashCards from './games/FlashCards';
import SentenceScramble from './games/SentenceScramble';
import SpeechLab from './games/SpeechLab';
import DailyDrill from './games/DailyDrill';
import DialoguePractice from './games/DialoguePractice';
import Shop from './components/Shop';
import Progress from './components/Progress';
import Settings from './components/Settings';

function App() {
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/word-rain" element={<WordRain />} />
          <Route path="/flashcards" element={<FlashCards />} />
          <Route path="/sentence-scramble" element={<SentenceScramble />} />
          <Route path="/speech-lab" element={<SpeechLab />} />
          <Route path="/daily-drill" element={<DailyDrill />} />
          <Route path="/dialogue" element={<DialoguePractice />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

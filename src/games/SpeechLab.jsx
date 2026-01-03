import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getRandomWords } from '../data/vocabularyData';
import { ArrowLeft, Mic, MicOff, Volume2, Check, X, RotateCcw } from 'lucide-react';

const WORDS_PER_SESSION = 8;

function SpeechLab() {
    const { addXP, addCoins, learnWord, addCorrectAnswer, addIncorrectAnswer, updateStreak, settings } = useGame();

    const [gameState, setGameState] = useState('ready'); // ready, playing, listening, feedback, ended
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [results, setResults] = useState({ correct: 0, incorrect: 0 });
    const [speechSupported] = useState(() => {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    });

    const recognitionRef = useRef(null);

    const startGame = useCallback(() => {
        const difficulty = settings.difficulty === 'easy' ? 1 : settings.difficulty === 'hard' ? 3 : 2;
        const gameWords = getRandomWords(WORDS_PER_SESSION, difficulty);
        setWords(gameWords);
        setCurrentIndex(0);
        setResults({ correct: 0, incorrect: 0 });
        setTranscript('');
        setFeedback(null);
        setGameState('playing');
        updateStreak();
    }, [settings.difficulty, updateStreak]);

    const speakWord = (text) => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = settings.speechRate || 0.9;
            speechSynthesis.speak(utterance);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            setTranscript('');
            setGameState('listening');
        };

        recognitionRef.current.onresult = (event) => {
            const current = event.results[event.results.length - 1];
            setTranscript(current[0].transcript);
        };

        recognitionRef.current.onend = () => {
            checkPronunciation();
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setFeedback({ type: 'error', message: 'Could not hear you. Try again!' });
            setGameState('feedback');
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const checkPronunciation = () => {
        const currentWord = words[currentIndex];
        const spokenWord = transcript.toLowerCase().trim();
        const targetWord = currentWord.word.toLowerCase();

        // Simple comparison - could be enhanced with fuzzy matching
        const isCorrect = spokenWord === targetWord ||
            spokenWord.includes(targetWord) ||
            targetWord.includes(spokenWord);

        if (isCorrect) {
            setFeedback({ type: 'correct', message: 'Excellent pronunciation!' });
            addCorrectAnswer();
            learnWord(currentWord.word);
            setResults(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setFeedback({
                type: 'incorrect',
                message: `You said: "${transcript}"`,
                hint: `Try again! The word is "${currentWord.word}"`
            });
            addIncorrectAnswer();
            setResults(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        setGameState('feedback');
    };

    const nextWord = () => {
        if (currentIndex + 1 >= words.length) {
            endGame();
        } else {
            setCurrentIndex(prev => prev + 1);
            setTranscript('');
            setFeedback(null);
            setGameState('playing');
        }
    };

    const retryWord = () => {
        setTranscript('');
        setFeedback(null);
        setGameState('playing');
    };

    const endGame = () => {
        const xpEarned = results.correct * 15;
        const coinsEarned = results.correct * 3;
        addXP(xpEarned);
        addCoins(coinsEarned);
        setGameState('ended');
    };

    const currentWord = words[currentIndex];

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Speech Lab
                </h1>
                <div className="w-20" />
            </header>

            {/* Not Supported */}
            {!speechSupported && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="glass-card p-8 text-center max-w-md">
                        <MicOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
                        <h2 className="text-2xl font-bold mb-4">Speech Recognition Not Supported</h2>
                        <p className="text-dark-400 mb-6">
                            Your browser doesn't support speech recognition. Please try Chrome or Edge for the best experience.
                        </p>
                        <Link to="/" className="btn-primary">
                            Back to Menu
                        </Link>
                    </div>
                </div>
            )}

            {/* Ready Screen */}
            {speechSupported && gameState === 'ready' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center"
                >
                    <div className="glass-card p-8 text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Mic className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Speech Lab</h2>
                        <p className="text-dark-400 mb-6">
                            Listen to the word, then speak it aloud. Practice your English pronunciation!
                        </p>
                        <button onClick={startGame} className="btn-primary w-full text-lg">
                            Start Practice
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Playing / Listening / Feedback */}
            {speechSupported && (gameState === 'playing' || gameState === 'listening' || gameState === 'feedback') && currentWord && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                    {/* Progress */}
                    <div className="w-full mb-8">
                        <div className="flex justify-between text-sm text-dark-400 mb-2">
                            <span>Word {currentIndex + 1} of {words.length}</span>
                            <span>{results.correct} correct</span>
                        </div>
                        <div className="xp-bar">
                            <motion.div
                                className="xp-fill"
                                animate={{ width: `${((currentIndex) / words.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Word Card */}
                    <div className="glass-card p-8 w-full text-center mb-6">
                        <div className="text-sm text-dark-400 mb-2">Pronounce this word:</div>
                        <div className="text-5xl font-display font-bold mb-4">{currentWord.word}</div>
                        <div className="text-dark-400 mb-4">{currentWord.definition}</div>

                        <button
                            onClick={() => speakWord(currentWord.word)}
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <Volume2 className="w-5 h-5" />
                            Listen
                        </button>
                    </div>

                    {/* Microphone */}
                    <div className="mb-6">
                        {gameState === 'playing' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startListening}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                            >
                                <Mic className="w-10 h-10 text-white" />
                            </motion.button>
                        )}

                        {gameState === 'listening' && (
                            <motion.button
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                onClick={stopListening}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                            >
                                <MicOff className="w-10 h-10 text-white" />
                            </motion.button>
                        )}
                    </div>

                    {/* Live Transcript */}
                    {gameState === 'listening' && transcript && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl text-primary-400 mb-4"
                        >
                            "{transcript}"
                        </motion.div>
                    )}

                    {/* Feedback */}
                    {gameState === 'feedback' && feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <div className={`glass-card p-6 text-center mb-4 ${feedback.type === 'correct' ? 'border-emerald-500' :
                                feedback.type === 'incorrect' ? 'border-amber-500' : 'border-red-500'
                                } border`}>
                                <div className={`text-xl font-bold mb-2 ${feedback.type === 'correct' ? 'text-emerald-400' :
                                    feedback.type === 'incorrect' ? 'text-amber-400' : 'text-red-400'
                                    }`}>
                                    {feedback.type === 'correct' ? <Check className="w-8 h-8 mx-auto mb-2" /> : null}
                                    {feedback.message}
                                </div>
                                {feedback.hint && <p className="text-dark-400">{feedback.hint}</p>}
                            </div>

                            <div className="flex gap-3">
                                {feedback.type !== 'correct' && (
                                    <button onClick={retryWord} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                                        <RotateCcw className="w-4 h-4" />
                                        Try Again
                                    </button>
                                )}
                                <button onClick={nextWord} className="btn-primary flex-1">
                                    {currentIndex + 1 >= words.length ? 'See Results' : 'Next Word'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Instructions */}
                    {gameState === 'playing' && (
                        <p className="text-dark-400 text-center">
                            Tap the microphone and say the word clearly
                        </p>
                    )}
                </div>
            )}

            {/* End Screen */}
            {speechSupported && gameState === 'ended' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center"
                >
                    <div className="glass-card p-8 text-center max-w-md">
                        <Mic className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                        <h2 className="text-3xl font-display font-bold mb-4">Practice Complete!</h2>

                        <div className="flex justify-center gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-400">{results.correct}</div>
                                <div className="text-sm text-dark-400">Perfect</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-amber-400">{results.incorrect}</div>
                                <div className="text-sm text-dark-400">Needs Practice</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={startGame} className="btn-primary flex-1">
                                Practice Again
                            </button>
                            <Link to="/" className="btn-secondary flex-1">
                                Menu
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default SpeechLab;

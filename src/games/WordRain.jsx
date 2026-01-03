import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getRandomWords } from '../data/vocabularyData';
import { ArrowLeft, Heart, Zap, Trophy } from 'lucide-react';

const GAME_DURATION = 60; // seconds
const WORD_FALL_DURATION = 6000; // ms

function WordRain() {
    const { addXP, addCoins, learnWord, addCorrectAnswer, addIncorrectAnswer, updateStreak, incrementGamesPlayed, settings } = useGame();

    const [gameState, setGameState] = useState('ready'); // ready, playing, ended
    const [words, setWords] = useState([]);
    const [fallingWords, setFallingWords] = useState([]);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [feedback, setFeedback] = useState(null);

    const inputRef = useRef(null);
    const gameAreaRef = useRef(null);
    const wordIdCounter = useRef(0);

    // Initialize words when game starts
    const startGame = useCallback(() => {
        const difficulty = settings.difficulty === 'easy' ? 1 : settings.difficulty === 'hard' ? 3 : 2;
        const gameWords = getRandomWords(30, difficulty);
        setWords(gameWords);
        setFallingWords([]);
        setScore(0);
        setLives(3);
        setCombo(0);
        setTimeLeft(GAME_DURATION);
        setGameState('playing');
        updateStreak();
        inputRef.current?.focus();
    }, [settings.difficulty, updateStreak]);

    // Spawn new words periodically
    useEffect(() => {
        if (gameState !== 'playing' || words.length === 0) return;

        const spawnInterval = setInterval(() => {
            if (words.length > 0 && fallingWords.length < 5) {
                const word = words[0];
                const newWord = {
                    ...word,
                    id: wordIdCounter.current++,
                    x: Math.random() * 70 + 15, // 15-85% from left
                    startTime: Date.now(),
                };
                setFallingWords(prev => [...prev, newWord]);
                setWords(prev => prev.slice(1));
            }
        }, 2000);

        return () => clearInterval(spawnInterval);
    }, [gameState, words, fallingWords.length]);

    // Timer countdown
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, endGame]);

    // Check for words that hit the ground
    useEffect(() => {
        if (gameState !== 'playing') return;

        const checkInterval = setInterval(() => {
            const now = Date.now();
            setFallingWords(prev => {
                const stillFalling = [];
                let lostLife = false;

                prev.forEach(word => {
                    if (now - word.startTime >= WORD_FALL_DURATION) {
                        lostLife = true;
                        addIncorrectAnswer();
                    } else {
                        stillFalling.push(word);
                    }
                });

                if (lostLife) {
                    setLives(l => {
                        const newLives = l - 1;
                        if (newLives <= 0) {
                            setTimeout(() => endGame(), 100);
                        }
                        return newLives;
                    });
                    setCombo(0);
                    setFeedback({ type: 'miss', text: 'Missed!' });
                    setTimeout(() => setFeedback(null), 500);
                }

                return stillFalling;
            });
        }, 100);

        return () => clearInterval(checkInterval);
    }, [gameState, addIncorrectAnswer, endGame]);

    const endGame = useCallback(() => {
        setGameState('ended');
        incrementGamesPlayed();

        // Calculate rewards
        const xpEarned = score * 2;
        const coinsEarned = Math.floor(score / 2);

        addXP(xpEarned);
        addCoins(coinsEarned);
    }, [score, addXP, addCoins, incrementGamesPlayed]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const inputLower = input.toLowerCase().trim();

        // Check if input matches any falling word's definition (first word match)
        const matchIndex = fallingWords.findIndex(word =>
            word.word.toLowerCase() === inputLower
        );

        if (matchIndex !== -1) {
            const matchedWord = fallingWords[matchIndex];

            // Remove the word
            setFallingWords(prev => prev.filter((_, i) => i !== matchIndex));

            // Update score with combo bonus
            const comboBonus = Math.min(combo, 5);
            const points = 10 + comboBonus * 2;
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);

            // Learn the word
            learnWord(matchedWord.word);
            addCorrectAnswer();

            // Show feedback
            setFeedback({ type: 'correct', text: `+${points}`, word: matchedWord.word });
            setTimeout(() => setFeedback(null), 500);
        } else {
            // Wrong answer
            setCombo(0);
            setFeedback({ type: 'wrong', text: 'Try again!' });
            setTimeout(() => setFeedback(null), 500);
        }

        setInput('');
    };

    const speakWord = (text) => {
        if ('speechSynthesis' in window && settings.soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = settings.speechRate || 1;
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-4">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Word Rain
                </h1>
                <div className="w-20" />
            </header>

            {/* Ready Screen */}
            {gameState === 'ready' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center"
                >
                    <div className="glass-card p-8 text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Zap className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Word Rain</h2>
                        <p className="text-dark-400 mb-6">
                            Words will fall from the sky! Type the word before it hits the ground.
                            Build combos for bonus points!
                        </p>
                        <button onClick={startGame} className="btn-primary w-full text-lg">
                            Start Game
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Game Screen */}
            {gameState === 'playing' && (
                <>
                    {/* Stats Bar */}
                    <div className="flex justify-between items-center mb-4 glass-card p-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <Heart
                                        key={i}
                                        className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-dark-600'}`}
                                    />
                                ))}
                            </div>
                            <div className="text-lg font-bold">Score: {score}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            {combo > 1 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-amber-400 font-bold"
                                >
                                    🔥 x{combo}
                                </motion.div>
                            )}
                            <div className={`text-lg font-mono ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    {/* Game Area */}
                    <div
                        ref={gameAreaRef}
                        className="flex-1 relative glass-card overflow-hidden mb-4"
                        style={{ minHeight: '400px' }}
                    >
                        {/* Ground line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/50" />

                        {/* Falling Words */}
                        <AnimatePresence>
                            {fallingWords.map(word => (
                                <motion.div
                                    key={word.id}
                                    initial={{ y: -80, opacity: 0 }}
                                    animate={{
                                        y: 'calc(100% + 40px)',
                                        opacity: 1,
                                    }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    transition={{
                                        y: { duration: WORD_FALL_DURATION / 1000, ease: 'linear' },
                                        opacity: { duration: 0.3 },
                                    }}
                                    className="absolute floating-word cursor-pointer"
                                    style={{ left: `${word.x}%`, transform: 'translateX(-50%)' }}
                                    onClick={() => speakWord(word.word)}
                                >
                                    <div className="text-sm text-dark-400 mb-1">{word.definition}</div>
                                    <div className="text-xs text-primary-400">Type the word!</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Feedback */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ scale: 0, y: 0 }}
                                    animate={{ scale: 1, y: -20 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold ${feedback.type === 'correct' ? 'text-emerald-400' :
                                        feedback.type === 'wrong' ? 'text-amber-400' : 'text-red-400'
                                        }`}
                                >
                                    {feedback.text}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="glass-card p-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type the word here..."
                            className="input-field text-xl text-center"
                            autoComplete="off"
                            autoFocus
                        />
                    </form>
                </>
            )}

            {/* End Screen */}
            {gameState === 'ended' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center"
                >
                    <div className="glass-card p-8 text-center max-w-md">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                        <h2 className="text-3xl font-display font-bold mb-2">Game Over!</h2>
                        <div className="text-5xl font-bold text-primary-400 mb-4">{score}</div>
                        <p className="text-dark-400 mb-2">points earned</p>

                        <div className="flex justify-center gap-4 mb-6">
                            <div className="stat-badge">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span>+{score * 2} XP</span>
                            </div>
                            <div className="stat-badge">
                                <span className="text-yellow-500">🪙</span>
                                <span>+{Math.floor(score / 2)} coins</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={startGame} className="btn-primary flex-1">
                                Play Again
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

export default WordRain;

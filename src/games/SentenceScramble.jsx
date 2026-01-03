import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getRandomSentences } from '../data/sentenceData';
import { ArrowLeft, Shuffle, Check, RotateCcw, Trophy, Lightbulb } from 'lucide-react';

const SENTENCES_PER_GAME = 5;

function SentenceScramble() {
    const { addXP, addCoins, addCorrectAnswer, addIncorrectAnswer, updateStreak, useHint: consumeHint, inventory, settings } = useGame();

    const [gameState, setGameState] = useState('ready'); // ready, playing, result, ended
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambledWords, setScrambledWords] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);

    const startGame = useCallback(() => {
        const difficulty = settings.difficulty === 'easy' ? 1 : settings.difficulty === 'hard' ? 3 : 2;
        const gameSentences = getRandomSentences(SENTENCES_PER_GAME, difficulty);
        setSentences(gameSentences);
        setCurrentIndex(0);
        setScore(0);
        setHintsUsed(0);
        scrambleCurrentSentence(gameSentences[0]);
        setGameState('playing');
        updateStreak();
    }, [settings.difficulty, updateStreak]);

    const scrambleCurrentSentence = (sentence) => {
        const words = sentence.words.map((word, index) => ({
            id: `${index}-${word}`,
            text: word,
        }));
        // Shuffle until different from original
        let shuffled;
        do {
            shuffled = [...words].sort(() => Math.random() - 0.5);
        } while (shuffled.map(w => w.text).join(' ') === sentence.sentence);

        setScrambledWords(shuffled);
        setFeedback(null);
    };

    const checkAnswer = () => {
        const currentSentence = sentences[currentIndex];
        const userAnswer = scrambledWords.map(w => w.text).join(' ');
        const isCorrect = userAnswer === currentSentence.sentence;

        if (isCorrect) {
            setFeedback({ type: 'correct', message: 'Perfect!' });
            addCorrectAnswer();
            setScore(prev => prev + (10 - hintsUsed * 2));
        } else {
            setFeedback({ type: 'incorrect', message: 'Not quite right. Try again!' });
            addIncorrectAnswer();
        }

        setGameState('result');
    };

    const nextSentence = () => {
        if (currentIndex + 1 >= sentences.length) {
            endGame();
        } else {
            setCurrentIndex(prev => prev + 1);
            scrambleCurrentSentence(sentences[currentIndex + 1]);
            setHintsUsed(0);
            setGameState('playing');
        }
    };

    const showHint = () => {
        if (inventory.hints <= 0) return;

        const used = consumeHint();
        if (!used) return;

        setHintsUsed(prev => prev + 1);

        // Find first incorrectly placed word and move it to correct position
        const currentSentence = sentences[currentIndex];
        const correctWords = currentSentence.words;

        for (let i = 0; i < scrambledWords.length; i++) {
            if (scrambledWords[i].text !== correctWords[i]) {
                // Find where this correct word is in scrambled
                const correctWordIndex = scrambledWords.findIndex(w => w.text === correctWords[i]);
                if (correctWordIndex !== -1) {
                    const newOrder = [...scrambledWords];
                    const [moved] = newOrder.splice(correctWordIndex, 1);
                    newOrder.splice(i, 0, moved);
                    setScrambledWords(newOrder);
                    break;
                }
            }
        }
    };

    const endGame = () => {
        const xpEarned = score * 3;
        const coinsEarned = Math.floor(score / 2);
        addXP(xpEarned);
        addCoins(coinsEarned);
        setGameState('ended');
    };

    const speakSentence = (text) => {
        if ('speechSynthesis' in window && settings.soundEnabled) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = settings.speechRate || 1;
            speechSynthesis.speak(utterance);
        }
    };

    const currentSentence = sentences[currentIndex];

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Sentence Scramble
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
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <Shuffle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Sentence Scramble</h2>
                        <p className="text-dark-400 mb-6">
                            Drag and drop words to form correct English sentences.
                            Use hints if you get stuck!
                        </p>
                        <button onClick={startGame} className="btn-primary w-full text-lg">
                            Start Game
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Playing / Result */}
            {(gameState === 'playing' || gameState === 'result') && currentSentence && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-dark-400 mb-2">
                            <span>Sentence {currentIndex + 1} of {sentences.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <div className="xp-bar">
                            <motion.div
                                className="xp-fill"
                                animate={{ width: `${((currentIndex) / sentences.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Topic */}
                    <div className="text-center mb-4">
                        <span className="stat-badge">
                            📝 {currentSentence.topic}
                        </span>
                    </div>

                    {/* Word Tiles */}
                    <div className="glass-card p-6 mb-4 flex-1">
                        <p className="text-dark-400 text-center mb-6">Arrange the words to form a correct sentence:</p>

                        <Reorder.Group
                            axis="x"
                            values={scrambledWords}
                            onReorder={setScrambledWords}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            {scrambledWords.map((word) => (
                                <Reorder.Item
                                    key={word.id}
                                    value={word}
                                    className={`px-4 py-3 rounded-xl font-medium text-lg cursor-grab active:cursor-grabbing select-none
                    ${gameState === 'result' && feedback?.type === 'correct'
                                            ? 'bg-emerald-500/20 border-emerald-500 border'
                                            : 'bg-dark-700 border border-white/10 hover:border-primary-500/50'
                                        }
                  `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    drag={gameState === 'playing'}
                                >
                                    {word.text}
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {/* Feedback */}
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-center mt-6 text-xl font-bold ${feedback.type === 'correct' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}
                            >
                                {feedback.message}
                            </motion.div>
                        )}

                        {/* Correct Answer (on incorrect) */}
                        {feedback?.type === 'incorrect' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center mt-4"
                            >
                                <p className="text-dark-400 text-sm">Correct answer:</p>
                                <p className="text-primary-400 italic">"{currentSentence.sentence}"</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {gameState === 'playing' ? (
                            <>
                                <button
                                    onClick={showHint}
                                    className="btn-secondary flex items-center gap-2"
                                    disabled={inventory.hints <= 0}
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Hint ({inventory.hints})
                                </button>
                                <button
                                    onClick={() => speakSentence(currentSentence.sentence)}
                                    className="btn-secondary"
                                >
                                    🔊 Listen
                                </button>
                                <button onClick={checkAnswer} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                    Check Answer
                                </button>
                            </>
                        ) : (
                            <button onClick={nextSentence} className="btn-primary flex-1">
                                {currentIndex + 1 >= sentences.length ? 'See Results' : 'Next Sentence'}
                            </button>
                        )}
                    </div>
                </div>
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
                        <h2 className="text-3xl font-display font-bold mb-2">Complete!</h2>
                        <div className="text-5xl font-bold text-primary-400 mb-4">{score}</div>
                        <p className="text-dark-400 mb-6">points earned</p>

                        <div className="flex gap-3">
                            <button onClick={startGame} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
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

export default SentenceScramble;

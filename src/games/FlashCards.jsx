import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { getRandomWords, vocabularyData } from '../data/vocabularyData';
import { ArrowLeft, RotateCcw, Volume2, Check, X, Layers } from 'lucide-react';

const CARDS_PER_SESSION = 10;

function FlashCards() {
    const { addXP, addCoins, learnWord, masterWord, addCorrectAnswer, addIncorrectAnswer, updateStreak, settings } = useGame();

    const [gameState, setGameState] = useState('select'); // select, studying, results
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [results, setResults] = useState({ correct: 0, incorrect: 0, cards: [] });
    const [showHint, setShowHint] = useState(false);

    const topics = Object.keys(vocabularyData);

    const startSession = useCallback((topic) => {
        setSelectedTopic(topic);
        const topicWords = topic === 'all'
            ? getRandomWords(CARDS_PER_SESSION)
            : vocabularyData[topic].slice().sort(() => Math.random() - 0.5).slice(0, CARDS_PER_SESSION);

        setCards(topicWords);
        setCurrentIndex(0);
        setIsFlipped(false);
        setResults({ correct: 0, incorrect: 0, cards: [] });
        setGameState('studying');
        updateStreak();
    }, [updateStreak]);

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const speakWord = (text) => {
        if ('speechSynthesis' in window && settings.soundEnabled) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = settings.speechRate || 1;
            speechSynthesis.speak(utterance);
        }
    };

    const handleResponse = (knew) => {
        const currentCard = cards[currentIndex];

        if (knew) {
            addCorrectAnswer();
            learnWord(currentCard.word);
            if (results.cards.filter(c => c.word === currentCard.word && c.knew).length >= 2) {
                masterWord(currentCard.word);
            }
        } else {
            addIncorrectAnswer();
        }

        setResults(prev => ({
            correct: prev.correct + (knew ? 1 : 0),
            incorrect: prev.incorrect + (knew ? 0 : 1),
            cards: [...prev.cards, { ...currentCard, knew }],
        }));

        // Move to next card or end session
        if (currentIndex + 1 >= cards.length) {
            endSession(knew);
        } else {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    };

    const endSession = (lastKnew) => {
        const finalCorrect = results.correct + (lastKnew ? 1 : 0);
        const xpEarned = finalCorrect * 10;
        const coinsEarned = Math.floor(finalCorrect * 2);

        addXP(xpEarned);
        addCoins(coinsEarned);
        setGameState('results');
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Flash Cards
                </h1>
                <div className="w-20" />
            </header>

            {/* Topic Selection */}
            {gameState === 'select' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 max-w-2xl mx-auto w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Choose a Topic</h2>
                        <p className="text-dark-400">Select a category to study</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startSession('all')}
                            className="game-card text-center"
                        >
                            <div className="text-3xl mb-2">🎲</div>
                            <div className="font-semibold">All Topics</div>
                            <div className="text-sm text-dark-400">Random mix</div>
                        </motion.button>

                        {topics.map(topic => (
                            <motion.button
                                key={topic}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => startSession(topic)}
                                className="game-card text-center"
                            >
                                <div className="text-3xl mb-2">
                                    {topic === 'everyday' ? '🏠' :
                                        topic === 'business' ? '💼' :
                                            topic === 'travel' ? '✈️' :
                                                topic === 'technology' ? '💻' :
                                                    topic === 'health' ? '🏥' :
                                                        topic === 'emotions' ? '💭' : '📚'}
                                </div>
                                <div className="font-semibold capitalize">{topic}</div>
                                <div className="text-sm text-dark-400">{vocabularyData[topic].length} words</div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Study Mode */}
            {gameState === 'studying' && currentCard && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                    {/* Progress */}
                    <div className="w-full mb-6">
                        <div className="flex justify-between text-sm text-dark-400 mb-2">
                            <span>Card {currentIndex + 1} of {cards.length}</span>
                            <span>{results.correct} correct</span>
                        </div>
                        <div className="xp-bar">
                            <motion.div
                                className="xp-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Flashcard */}
                    <div className="w-full perspective-1000 mb-6" style={{ perspective: '1000px' }}>
                        <motion.div
                            className="relative w-full h-64 cursor-pointer"
                            onClick={flipCard}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <div
                                className="absolute inset-0 glass-card flex flex-col items-center justify-center p-6 backface-hidden"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="text-4xl font-display font-bold mb-4">{currentCard.word}</div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); speakWord(currentCard.word); }}
                                    className="btn-ghost p-2 rounded-full"
                                >
                                    <Volume2 className="w-6 h-6 text-primary-400" />
                                </button>
                                <p className="text-dark-400 text-sm mt-4">Tap to flip</p>
                            </div>

                            {/* Back */}
                            <div
                                className="absolute inset-0 glass-card flex flex-col items-center justify-center p-6 backface-hidden"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <div className="text-xl text-center mb-4">{currentCard.definition}</div>
                                <div className="text-sm text-dark-400 italic text-center">"{currentCard.example}"</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hint */}
                    {!isFlipped && (
                        <button
                            onClick={() => setShowHint(true)}
                            className="text-sm text-dark-400 hover:text-primary-400 mb-4"
                        >
                            {showHint ? `Hint: ${currentCard.definition.slice(0, 20)}...` : 'Show hint'}
                        </button>
                    )}

                    {/* Response Buttons */}
                    {isFlipped && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 w-full"
                        >
                            <button
                                onClick={() => handleResponse(false)}
                                className="flex-1 btn-secondary bg-red-500/20 border-red-500/50 hover:bg-red-500/30 flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Still Learning
                            </button>
                            <button
                                onClick={() => handleResponse(true)}
                                className="flex-1 btn-primary bg-emerald-500 flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Got It!
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Results */}
            {gameState === 'results' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full"
                >
                    <div className="glass-card p-8 text-center w-full">
                        <h2 className="text-2xl font-display font-bold mb-4">Session Complete!</h2>

                        <div className="flex justify-center gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-400">{results.correct}</div>
                                <div className="text-sm text-dark-400">Correct</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-red-400">{results.incorrect}</div>
                                <div className="text-sm text-dark-400">Learning</div>
                            </div>
                        </div>

                        <div className="text-lg mb-6">
                            Accuracy: {Math.round((results.correct / cards.length) * 100)}%
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => startSession(selectedTopic)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Study Again
                            </button>
                            <button onClick={() => setGameState('select')} className="btn-secondary flex-1">
                                New Topic
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default FlashCards;

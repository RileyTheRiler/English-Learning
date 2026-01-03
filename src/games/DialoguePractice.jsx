import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { dialogueScenarios } from '../data/dialogueData';
import { ArrowLeft, MessageCircle, User, Bot, Check, X, Trophy } from 'lucide-react';

function DialoguePractice() {
    const { addXP, addCoins, addCorrectAnswer, addIncorrectAnswer, updateStreak, settings } = useGame();

    const [gameState, setGameState] = useState('select'); // select, playing, ended
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [messages, setMessages] = useState([]);
    const [results, setResults] = useState({ correct: 0, total: 0 });
    const [lastFeedback, setLastFeedback] = useState(null);

    const startScenario = useCallback((scenario) => {
        setSelectedScenario(scenario);
        setDialogueIndex(0);
        setMessages([]);
        setResults({ correct: 0, total: 0 });
        setLastFeedback(null);
        setGameState('playing');
        updateStreak();

        // Add first NPC message
        if (scenario.dialogue[0].speaker !== 'player') {
            setMessages([{
                speaker: scenario.dialogue[0].speaker,
                text: scenario.dialogue[0].text,
                isNPC: true,
            }]);
            setDialogueIndex(1);
        }
    }, [updateStreak]);

    const speakText = (text) => {
        if ('speechSynthesis' in window && settings.soundEnabled) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = settings.speechRate || 0.9;
            speechSynthesis.speak(utterance);
        }
    };

    const handleChoice = (option) => {
        // Add player message
        setMessages(prev => [...prev, {
            speaker: 'player',
            text: option.text,
            isNPC: false,
            correct: option.correct,
        }]);

        // Track result
        if (option.correct) {
            addCorrectAnswer();
            setResults(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
        } else {
            addIncorrectAnswer();
            setResults(prev => ({ ...prev, total: prev.total + 1 }));
        }

        setLastFeedback(option.correct ? 'correct' : 'incorrect');

        // Add NPC response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                speaker: selectedScenario.dialogue[dialogueIndex].speaker === 'player' ? 'npc' : selectedScenario.dialogue[dialogueIndex].speaker,
                text: option.response,
                isNPC: true,
            }]);

            // Move to next dialogue
            const nextIndex = dialogueIndex + 1;
            if (nextIndex >= selectedScenario.dialogue.length) {
                // End of dialogue
                setTimeout(() => endScenario(), 1000);
            } else {
                setDialogueIndex(nextIndex);

                // If next is NPC, add their message too
                const nextItem = selectedScenario.dialogue[nextIndex];
                if (nextItem.speaker !== 'player') {
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            speaker: nextItem.speaker,
                            text: nextItem.text,
                            isNPC: true,
                        }]);
                        setDialogueIndex(nextIndex + 1);
                        setLastFeedback(null);
                    }, 1500);
                } else {
                    setLastFeedback(null);
                }
            }
        }, 500);
    };

    const endScenario = () => {
        const xpEarned = results.correct * 20;
        const coinsEarned = results.correct * 5;
        addXP(xpEarned);
        addCoins(coinsEarned);
        setGameState('ended');
    };

    const currentDialogue = selectedScenario?.dialogue[dialogueIndex];
    const isPlayerTurn = currentDialogue?.speaker === 'player';

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Dialogue Practice
                </h1>
                <div className="w-20" />
            </header>

            {/* Scenario Selection */}
            {gameState === 'select' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 max-w-2xl mx-auto w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Choose a Scenario</h2>
                        <p className="text-dark-400">Practice real-world conversations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dialogueScenarios.map(scenario => (
                            <motion.button
                                key={scenario.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => startScenario(scenario)}
                                className="game-card text-left"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{scenario.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{scenario.title}</h3>
                                        <p className="text-dark-400 text-sm">{scenario.description}</p>
                                        <div className="mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${scenario.difficulty === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                                                scenario.difficulty === 2 ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {scenario.difficulty === 1 ? 'Beginner' : scenario.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Dialogue View */}
            {gameState === 'playing' && selectedScenario && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                    {/* Scenario Header */}
                    <div className="glass-card p-4 mb-4 flex items-center gap-3">
                        <span className="text-2xl">{selectedScenario.icon}</span>
                        <div>
                            <h3 className="font-semibold">{selectedScenario.title}</h3>
                            <p className="text-dark-400 text-sm">{selectedScenario.description}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 glass-card p-4 overflow-y-auto mb-4 space-y-4" style={{ maxHeight: '400px' }}>
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.isNPC ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.isNPC ? '' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.isNPC ? 'bg-indigo-500' : msg.correct !== undefined ? (msg.correct ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-primary-500'
                                            }`}>
                                            {msg.isNPC ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl ${msg.isNPC
                                                ? 'bg-dark-700 rounded-tl-none'
                                                : msg.correct
                                                    ? 'bg-emerald-500/20 border border-emerald-500/50 rounded-tr-none'
                                                    : msg.correct === false
                                                        ? 'bg-amber-500/20 border border-amber-500/50 rounded-tr-none'
                                                        : 'bg-primary-500/20 rounded-tr-none'
                                                }`}
                                            onClick={() => speakText(msg.text)}
                                        >
                                            {msg.text}
                                            {msg.correct !== undefined && (
                                                <div className="mt-1">
                                                    {msg.correct ? (
                                                        <Check className="w-4 h-4 text-emerald-400 inline" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-amber-400 inline" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Response Options */}
                    {isPlayerTurn && currentDialogue?.options && !lastFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <p className="text-dark-400 text-sm text-center mb-2">Choose your response:</p>
                            {currentDialogue.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleChoice(option)}
                                    className="w-full glass-card p-4 text-left hover:border-primary-500/50 transition-all"
                                >
                                    {option.text}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Feedback indicator */}
                    {lastFeedback && (
                        <div className={`text-center py-3 ${lastFeedback === 'correct' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {lastFeedback === 'correct' ? '✓ Good choice!' : '⚠ Not the best option, but okay!'}
                        </div>
                    )}
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
                        <h2 className="text-3xl font-display font-bold mb-4">Conversation Complete!</h2>

                        <div className="text-lg mb-4">
                            Best responses: <span className="text-emerald-400 font-bold">{results.correct}</span> / {results.total}
                        </div>

                        <p className="text-dark-400 mb-6">
                            {results.correct === results.total
                                ? 'Perfect! You made all the best choices!'
                                : 'Good job! Keep practicing to improve your conversational skills.'}
                        </p>

                        <div className="flex gap-3">
                            <button onClick={() => startScenario(selectedScenario)} className="btn-primary flex-1">
                                Try Again
                            </button>
                            <button onClick={() => setGameState('select')} className="btn-secondary flex-1">
                                New Scenario
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default DialoguePractice;

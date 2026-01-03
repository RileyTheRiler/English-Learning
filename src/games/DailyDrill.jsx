import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useGame } from '../context/GameContext';
import { getRandomWords } from '../data/vocabularyData';
import { getRandomSentences } from '../data/sentenceData';
import { getRandomIdioms } from '../data/idiomsData';
import { ArrowLeft, Zap, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const ROUNDS = 10;

function DailyDrill() {
    const { addXP, addCoins, learnWord, addCorrectAnswer, addIncorrectAnswer, updateStreak, incrementGamesPlayed, settings } = useGame();

    const [gameState, setGameState] = useState('ready'); // ready, playing, ended
    const [challenges, setChallenges] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [showAnswer, setShowAnswer] = useState(false);

    const generateChallenges = useCallback(() => {
        const difficulty = settings.difficulty === 'easy' ? 1 : settings.difficulty === 'hard' ? 3 : 2;
        const challengeList = [];

        // Mix of different challenge types
        const vocabWords = getRandomWords(4, difficulty);
        const sentences = getRandomSentences(3, difficulty);
        const idioms = getRandomIdioms(3);

        // Vocabulary challenges (definition matching)
        vocabWords.forEach(word => {
            const wrongAnswers = getRandomWords(3).filter(w => w.word !== word.word).map(w => w.definition);
            const options = [word.definition, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);
            challengeList.push({
                type: 'vocabulary',
                question: `What does "${word.word}" mean?`,
                answer: word.definition,
                options,
                word: word.word,
            });
        });

        // Sentence completion challenges
        sentences.forEach(s => {
            const words = s.words;
            const removeIndex = Math.floor(Math.random() * (words.length - 1)) + 1;
            const removed = words[removeIndex];
            const blanked = words.map((w, i) => i === removeIndex ? '______' : w).join(' ');

            const wrongWords = ['always', 'never', 'quickly', 'very', 'just', 'really'].filter(w => w !== removed);
            const options = [removed, ...wrongWords.slice(0, 3)].sort(() => Math.random() - 0.5);

            challengeList.push({
                type: 'fillBlank',
                question: `Complete: "${blanked}"`,
                answer: removed,
                options,
            });
        });

        // Idiom meaning challenges
        idioms.forEach(idiom => {
            const wrongMeanings = [
                'To be very happy',
                'To work very hard',
                'To be confused',
                'To give up easily',
                'To start something new'
            ].filter(m => m !== idiom.meaning);

            const options = [idiom.meaning, ...wrongMeanings.slice(0, 3)].sort(() => Math.random() - 0.5);

            challengeList.push({
                type: 'idiom',
                question: `What does "${idiom.idiom}" mean?`,
                answer: idiom.meaning,
                options,
                extra: idiom.example,
            });
        });

        return challengeList.sort(() => Math.random() - 0.5).slice(0, ROUNDS);
    }, [settings.difficulty]);

    const startGame = useCallback(() => {
        const newChallenges = generateChallenges();
        setChallenges(newChallenges);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setGameState('playing');
        updateStreak();
    }, [generateChallenges, updateStreak]);

    // Timer
    useEffect(() => {
        if (gameState !== 'playing' || showAnswer) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, showAnswer, currentIndex, handleTimeout]);

    const handleTimeout = useCallback(() => {
        setSelectedAnswer('timeout');
        setShowAnswer(true);
        addIncorrectAnswer();
        setStreak(0);
    }, [addIncorrectAnswer]);

    const handleAnswer = (answer) => {
        if (showAnswer) return;

        setSelectedAnswer(answer);
        setShowAnswer(true);

        const isCorrect = answer === challenges[currentIndex].answer;

        if (isCorrect) {
            addCorrectAnswer();
            const timeBonus = Math.floor(timeLeft / 3);
            const streakBonus = Math.min(streak, 5);
            const points = 10 + timeBonus + streakBonus;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);

            if (challenges[currentIndex].word) {
                learnWord(challenges[currentIndex].word);
            }
        } else {
            addIncorrectAnswer();
            setStreak(0);
        }
    };

    const nextChallenge = () => {
        if (currentIndex + 1 >= challenges.length) {
            endGame();
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
            setTimeLeft(15);
        }
    };

    const endGame = () => {
        incrementGamesPlayed();
        const xpEarned = score * 2;
        const coinsEarned = Math.floor(score / 3);
        addXP(xpEarned);
        addCoins(coinsEarned);
        setGameState('ended');
    };

    const currentChallenge = challenges[currentIndex];

    return (
        <div className="min-h-screen p-4 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                    Daily Drill
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
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                            <Zap className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Daily Drill</h2>
                        <p className="text-dark-400 mb-6">
                            A mixed challenge of vocabulary, sentences, and idioms.
                            Answer quickly for bonus points!
                        </p>
                        <button onClick={startGame} className="btn-primary w-full text-lg">
                            Start Drill
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Playing */}
            {gameState === 'playing' && currentChallenge && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                    {/* Stats Bar */}
                    <div className="flex justify-between items-center mb-4 glass-card p-3">
                        <div className="flex items-center gap-4">
                            <span className="font-bold">Score: {score}</span>
                            {streak > 1 && (
                                <span className="text-amber-400">🔥 x{streak}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400' : 'text-dark-400'}`} />
                            <span className={`font-mono text-lg ${timeLeft <= 5 ? 'text-red-400' : ''}`}>
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-dark-400 mb-2">
                            <span>Question {currentIndex + 1} of {challenges.length}</span>
                            <span className="capitalize">{currentChallenge.type === 'fillBlank' ? 'fill blank' : currentChallenge.type}</span>
                        </div>
                        <div className="xp-bar">
                            <motion.div
                                className="xp-fill"
                                animate={{ width: `${((currentIndex) / challenges.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-xl font-semibold text-center mb-2">{currentChallenge.question}</h3>
                        {currentChallenge.extra && (
                            <p className="text-sm text-dark-400 text-center italic">Example: "{currentChallenge.extra}"</p>
                        )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {currentChallenge.options.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === currentChallenge.answer;

                            let buttonClass = 'glass-card p-4 text-left transition-all';
                            if (showAnswer) {
                                if (isCorrect) {
                                    buttonClass += ' border-emerald-500 bg-emerald-500/20';
                                } else if (isSelected && !isCorrect) {
                                    buttonClass += ' border-red-500 bg-red-500/20';
                                }
                            } else {
                                buttonClass += ' hover:border-primary-500/50 cursor-pointer';
                            }

                            return (
                                <motion.button
                                    key={index}
                                    whileHover={!showAnswer ? { scale: 1.01 } : {}}
                                    whileTap={!showAnswer ? { scale: 0.99 } : {}}
                                    onClick={() => handleAnswer(option)}
                                    disabled={showAnswer}
                                    className={buttonClass}
                                >
                                    <div className="flex items-center gap-3">
                                        {showAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                                        {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                        <span>{option}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Timeout indicator */}
                    {selectedAnswer === 'timeout' && (
                        <div className="text-center text-red-400 mb-4">
                            Time's up!
                        </div>
                    )}

                    {/* Next Button */}
                    {showAnswer && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={nextChallenge}
                            className="btn-primary"
                        >
                            {currentIndex + 1 >= challenges.length ? 'See Results' : 'Next Question'}
                        </motion.button>
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
                        <h2 className="text-3xl font-display font-bold mb-2">Drill Complete!</h2>
                        <div className="text-5xl font-bold text-primary-400 mb-4">{score}</div>
                        <p className="text-dark-400 mb-6">points earned</p>

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

export default DailyDrill;

import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

const INITIAL_STATE = {
    xp: 0,
    level: 1,
    coins: 100,
    streak: 0,
    lastPlayedDate: null,
    gamesPlayed: 0,
    wordsLearned: [],
    masteredWords: [],
    achievements: [],
    settings: {
        soundEnabled: true,
        speechRate: 1,
        difficulty: 'medium',
    },
    inventory: {
        streakFreeze: 1,
        xpBoost: 0,
        hints: 3,
    },
    stats: {
        totalCorrect: 0,
        totalIncorrect: 0,
        bestStreak: 0,
        timeSpent: 0,
    },
};

const ACHIEVEMENTS = [
    { id: 'first_word', name: 'First Steps', description: 'Learn your first word', icon: '🌱', xpReward: 50 },
    { id: 'ten_words', name: 'Word Collector', description: 'Learn 10 words', icon: '📚', xpReward: 100 },
    { id: 'fifty_words', name: 'Vocabulary Builder', description: 'Learn 50 words', icon: '🏆', xpReward: 250 },
    { id: 'hundred_words', name: 'Word Master', description: 'Learn 100 words', icon: '👑', xpReward: 500 },
    { id: 'streak_3', name: 'On Fire', description: '3 day streak', icon: '🔥', xpReward: 75 },
    { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '⚡', xpReward: 200 },
    { id: 'streak_30', name: 'Dedicated Learner', description: '30 day streak', icon: '💎', xpReward: 1000 },
    { id: 'perfect_game', name: 'Perfectionist', description: 'Complete a game with no mistakes', icon: '✨', xpReward: 150 },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Answer 10 questions in under 30 seconds', icon: '⚡', xpReward: 100 },
];

const XP_PER_LEVEL = 100;

export function GameProvider({ children }) {
    const [gameState, setGameState] = useState(() => {
        let initialState = INITIAL_STATE;
        const saved = localStorage.getItem('englishquest_state');
        if (saved) {
            try {
                initialState = { ...INITIAL_STATE, ...JSON.parse(saved) };
            } catch {
                // formatting error, ignore
            }
        }

        // Check streak on load
        const today = new Date().toDateString();
        const lastPlayed = initialState.lastPlayedDate;

        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

            if (daysDiff > 1) {
                // Streak broken
                if (initialState.inventory.streakFreeze > 0 && daysDiff === 2) {
                    // Use streak freeze
                    initialState = {
                        ...initialState,
                        inventory: { ...initialState.inventory, streakFreeze: initialState.inventory.streakFreeze - 1 }
                    };
                } else {
                    initialState = { ...initialState, streak: 0 };
                }
            }
        }

        return initialState;
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('englishquest_state', JSON.stringify(gameState));
    }, [gameState]);



    const addXP = (amount) => {
        setGameState(prev => {
            const boostMultiplier = prev.inventory.xpBoost > 0 ? 1.5 : 1;
            const newXP = prev.xp + Math.floor(amount * boostMultiplier);
            const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                inventory: {
                    ...prev.inventory,
                    xpBoost: prev.inventory.xpBoost > 0 ? prev.inventory.xpBoost - 1 : 0,
                }
            };
        });
    };

    const addCoins = (amount) => {
        setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
    };

    const spendCoins = (amount) => {
        if (gameState.coins >= amount) {
            setGameState(prev => ({ ...prev, coins: prev.coins - amount }));
            return true;
        }
        return false;
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        if (gameState.lastPlayedDate !== today) {
            setGameState(prev => {
                const newStreak = prev.streak + 1;
                return {
                    ...prev,
                    streak: newStreak,
                    lastPlayedDate: today,
                    stats: {
                        ...prev.stats,
                        bestStreak: Math.max(prev.stats.bestStreak, newStreak),
                    }
                };
            });
        }
    };

    const learnWord = (word) => {
        if (!gameState.wordsLearned.includes(word)) {
            setGameState(prev => ({
                ...prev,
                wordsLearned: [...prev.wordsLearned, word],
            }));
            checkAchievements();
        }
    };

    const masterWord = (word) => {
        if (!gameState.masteredWords.includes(word)) {
            setGameState(prev => ({
                ...prev,
                masteredWords: [...prev.masteredWords, word],
            }));
        }
    };

    const addCorrectAnswer = () => {
        setGameState(prev => ({
            ...prev,
            stats: { ...prev.stats, totalCorrect: prev.stats.totalCorrect + 1 }
        }));
    };

    const addIncorrectAnswer = () => {
        setGameState(prev => ({
            ...prev,
            stats: { ...prev.stats, totalIncorrect: prev.stats.totalIncorrect + 1 }
        }));
    };

    const incrementGamesPlayed = () => {
        setGameState(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
    };

    const checkAchievements = () => {
        const checks = [
            { id: 'first_word', condition: gameState.wordsLearned.length >= 1 },
            { id: 'ten_words', condition: gameState.wordsLearned.length >= 10 },
            { id: 'fifty_words', condition: gameState.wordsLearned.length >= 50 },
            { id: 'hundred_words', condition: gameState.wordsLearned.length >= 100 },
            { id: 'streak_3', condition: gameState.streak >= 3 },
            { id: 'streak_7', condition: gameState.streak >= 7 },
            { id: 'streak_30', condition: gameState.streak >= 30 },
        ];

        checks.forEach(({ id, condition }) => {
            if (condition && !gameState.achievements.includes(id)) {
                unlockAchievement(id);
            }
        });
    };

    const unlockAchievement = (achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement && !gameState.achievements.includes(achievementId)) {
            setGameState(prev => ({
                ...prev,
                achievements: [...prev.achievements, achievementId],
                xp: prev.xp + achievement.xpReward,
            }));
            return achievement;
        }
        return null;
    };

    const purchaseItem = (item, price) => {
        if (spendCoins(price)) {
            setGameState(prev => ({
                ...prev,
                inventory: {
                    ...prev.inventory,
                    [item]: prev.inventory[item] + 1,
                }
            }));
            return true;
        }
        return false;
    };

    const useHint = () => {
        if (gameState.inventory.hints > 0) {
            setGameState(prev => ({
                ...prev,
                inventory: { ...prev.inventory, hints: prev.inventory.hints - 1 }
            }));
            return true;
        }
        return false;
    };

    const updateSettings = (newSettings) => {
        setGameState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));
    };

    const resetProgress = () => {
        setGameState(INITIAL_STATE);
        localStorage.removeItem('englishquest_state');
    };

    const value = {
        ...gameState,
        ACHIEVEMENTS,
        addXP,
        addCoins,
        spendCoins,
        updateStreak,
        learnWord,
        masterWord,
        addCorrectAnswer,
        addIncorrectAnswer,
        incrementGamesPlayed,
        checkAchievements,
        unlockAchievement,
        purchaseItem,
        useHint,
        updateSettings,
        resetProgress,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}



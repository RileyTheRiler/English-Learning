import { Link } from 'react-router-dom';

import { useGame } from '../context/GameContext';
import {
    CloudRain,
    Layers,
    Shuffle,
    Mic,
    Zap,
    MessageCircle,
    ShoppingBag,
    BarChart3,
    Settings,
    Flame,
    Trophy,
    Coins
} from 'lucide-react';

const games = [
    {
        id: 'word-rain',
        name: 'Word Rain',
        description: 'Type word meanings before they fall!',
        icon: CloudRain,
        color: 'from-blue-500 to-cyan-500',
        path: '/word-rain',
    },
    {
        id: 'flashcards',
        name: 'Flash Cards',
        description: 'Spaced repetition vocabulary study',
        icon: Layers,
        color: 'from-purple-500 to-pink-500',
        path: '/flashcards',
    },
    {
        id: 'sentence-scramble',
        name: 'Sentence Scramble',
        description: 'Arrange words in correct order',
        icon: Shuffle,
        color: 'from-amber-500 to-orange-500',
        path: '/sentence-scramble',
    },
    {
        id: 'speech-lab',
        name: 'Speech Lab',
        description: 'Practice pronunciation with voice',
        icon: Mic,
        color: 'from-emerald-500 to-teal-500',
        path: '/speech-lab',
    },
    {
        id: 'daily-drill',
        name: 'Daily Drill',
        description: 'Mixed practice for better retention',
        icon: Zap,
        color: 'from-red-500 to-rose-500',
        path: '/daily-drill',
    },
    {
        id: 'dialogue',
        name: 'Dialogue Practice',
        description: 'Real-world conversation scenarios',
        icon: MessageCircle,
        color: 'from-indigo-500 to-violet-500',
        path: '/dialogue',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 },
    },
};

function MainMenu() {
    const { level, xp, coins, streak, wordsLearned } = useGame();
    const xpForNextLevel = 100;
    const currentLevelXP = xp % xpForNextLevel;
    const progress = (currentLevelXP / xpForNextLevel) * 100;

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-6xl mx-auto mb-8"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Logo & Title */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                            EnglishQuest
                        </h1>
                        <p className="text-dark-400 mt-1">Master English Through Play</p>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="stat-badge">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-400">{streak} day streak</span>
                        </div>
                        <div className="stat-badge">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-400">{coins}</span>
                        </div>
                        <div className="stat-badge">
                            <Trophy className="w-4 h-4 text-purple-500" />
                            <span className="text-purple-400">{wordsLearned.length} words</span>
                        </div>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="mt-6 glass-card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Level {level}</span>
                        <span className="text-dark-400 text-sm">{currentLevelXP}/{xpForNextLevel} XP</span>
                    </div>
                    <div className="xp-bar">
                        <motion.div
                            className="xp-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </motion.header>

            {/* Game Grid */}
            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto"
            >
                <h2 className="text-xl font-semibold text-dark-300 mb-4">Choose Your Challenge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {games.map((game) => {
                        const Icon = game.icon;
                        return (
                            <motion.div key={game.id} variants={itemVariants}>
                                <Link to={game.path}>
                                    <div className="game-card group h-full">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                                            {game.name}
                                        </h3>
                                        <p className="text-dark-400 text-sm">{game.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/shop">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Shop
                        </motion.button>
                    </Link>
                    <Link to="/progress">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <BarChart3 className="w-5 h-5" />
                            Progress
                        </motion.button>
                    </Link>
                    <Link to="/settings">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </motion.button>
                    </Link>
                </div>
            </motion.main>
        </div>
    );
}

export default MainMenu;

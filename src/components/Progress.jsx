import { Link } from 'react-router-dom';

import { useGame } from '../context/GameContext';
import {
    ArrowLeft,
    BarChart3,
    Trophy,
    Flame,
    Target,
    BookOpen,
    Star,
    Calendar,
    TrendingUp
} from 'lucide-react';

function Progress() {
    const {
        level,
        xp,
        streak,
        gamesPlayed,
        wordsLearned,
        masteredWords,
        achievements,
        stats,
        ACHIEVEMENTS
    } = useGame();

    const xpForNextLevel = 100;
    const currentLevelXP = xp % xpForNextLevel;
    const progress = (currentLevelXP / xpForNextLevel) * 100;
    const accuracy = stats.totalCorrect + stats.totalIncorrect > 0
        ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100)
        : 0;

    return (
        <div className="min-h-screen p-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Progress
                </h1>
                <div className="w-20" />
            </header>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Level Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-2xl font-bold">{level}</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-dark-400">Current Level</div>
                            <div className="text-2xl font-bold">Level {level}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-primary-400">{xp}</div>
                            <div className="text-sm text-dark-400">Total XP</div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress to Level {level + 1}</span>
                            <span>{currentLevelXP}/{xpForNextLevel} XP</span>
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
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="glass-card p-4 text-center">
                        <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold">{streak}</div>
                        <div className="text-xs text-dark-400">Day Streak</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{wordsLearned.length}</div>
                        <div className="text-xs text-dark-400">Words Learned</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{masteredWords.length}</div>
                        <div className="text-xs text-dark-400">Mastered</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Target className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                        <div className="text-2xl font-bold">{accuracy}%</div>
                        <div className="text-xs text-dark-400">Accuracy</div>
                    </div>
                </motion.div>

                {/* More Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-400" />
                        Statistics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-dark-400">Games Played</span>
                            <span className="font-bold">{gamesPlayed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-dark-400">Correct Answers</span>
                            <span className="font-bold text-emerald-400">{stats.totalCorrect}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-dark-400">Incorrect Answers</span>
                            <span className="font-bold text-red-400">{stats.totalIncorrect}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-dark-400">Best Streak</span>
                            <span className="font-bold text-orange-400">{stats.bestStreak} days</span>
                        </div>
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Achievements ({achievements.length}/{ACHIEVEMENTS.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ACHIEVEMENTS.map(achievement => {
                            const isUnlocked = achievements.includes(achievement.id);
                            return (
                                <div
                                    key={achievement.id}
                                    className={`p-3 rounded-xl text-center transition-all ${isUnlocked
                                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30'
                                        : 'bg-dark-800/50 opacity-50'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{achievement.icon}</div>
                                    <div className="text-sm font-medium">{achievement.name}</div>
                                    <div className="text-xs text-dark-400">{achievement.description}</div>
                                    {isUnlocked && (
                                        <div className="text-xs text-yellow-400 mt-1">+{achievement.xpReward} XP</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Progress;

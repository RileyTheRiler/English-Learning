import { Link } from 'react-router-dom';

import { useGame } from '../context/GameContext';
import { ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, Gauge, RotateCcw, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

function Settings() {
    const { settings, updateSettings, resetProgress } = useGame();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSoundToggle = () => {
        updateSettings({ soundEnabled: !settings.soundEnabled });
    };

    const handleDifficultyChange = (difficulty) => {
        updateSettings({ difficulty });
    };

    const handleSpeechRateChange = (e) => {
        updateSettings({ speechRate: parseFloat(e.target.value) });
    };

    const handleReset = () => {
        resetProgress();
        setShowResetConfirm(false);
    };

    return (
        <div className="min-h-screen p-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold">Settings</h1>
                <div className="w-20" />
            </header>

            <div className="max-w-lg mx-auto space-y-6">
                {/* Sound */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        Sound
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                        <span>Sound Effects & Speech</span>
                        <button
                            onClick={handleSoundToggle}
                            className={`relative w-14 h-7 rounded-full transition-colors ${settings.soundEnabled ? 'bg-primary-500' : 'bg-dark-600'
                                }`}
                        >
                            <motion.div
                                className="absolute top-1 w-5 h-5 bg-white rounded-full"
                                animate={{ left: settings.soundEnabled ? '32px' : '4px' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        </button>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-dark-400">Speech Rate</span>
                            <span className="text-sm">{settings.speechRate}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.1"
                            value={settings.speechRate}
                            onChange={handleSpeechRateChange}
                            disabled={!settings.soundEnabled}
                            className="w-full accent-primary-500"
                        />
                    </div>
                </motion.div>

                {/* Difficulty */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Gauge className="w-5 h-5" />
                        Difficulty
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                        {['easy', 'medium', 'hard'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => handleDifficultyChange(diff)}
                                className={`p-3 rounded-xl text-center transition-all ${settings.difficulty === diff
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-700 hover:bg-dark-600'
                                    }`}
                            >
                                <div className="text-2xl mb-1">
                                    {diff === 'easy' ? '😊' : diff === 'medium' ? '🎯' : '🔥'}
                                </div>
                                <div className="capitalize font-medium">{diff}</div>
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-dark-400 mt-4">
                        {settings.difficulty === 'easy' && 'Basic vocabulary and simple sentences'}
                        {settings.difficulty === 'medium' && 'Intermediate vocabulary and more complex sentences'}
                        {settings.difficulty === 'hard' && 'Advanced vocabulary and challenging sentence structures'}
                    </p>
                </motion.div>

                {/* Reset */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
                        <RotateCcw className="w-5 h-5" />
                        Reset Progress
                    </h3>

                    {!showResetConfirm ? (
                        <>
                            <p className="text-dark-400 mb-4">
                                This will erase all your progress, including XP, coins, achievements, and learned words.
                            </p>
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10 w-full"
                            >
                                Reset All Progress
                            </button>
                        </>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                <p className="text-sm">
                                    Are you sure? This action cannot be undone. All your progress will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                                >
                                    Yes, Reset
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* About */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-dark-400 text-sm"
                >
                    <p>EnglishQuest v1.0</p>
                    <p>Made with ❤️ for English learners</p>
                </motion.div>
            </div>
        </div>
    );
}

export default Settings;

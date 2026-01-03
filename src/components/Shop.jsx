import { Link } from 'react-router-dom';

import { useGame } from '../context/GameContext';
import { ArrowLeft, Coins, ShoppingBag, Zap, Shield, Lightbulb, Sparkles } from 'lucide-react';

const shopItems = [
    {
        id: 'streakFreeze',
        name: 'Streak Freeze',
        description: 'Protects your streak for one missed day',
        price: 50,
        icon: Shield,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'xpBoost',
        name: 'XP Boost',
        description: '1.5x XP for your next game',
        price: 30,
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
    },
    {
        id: 'hints',
        name: 'Hint Pack',
        description: '3 extra hints for stuck moments',
        price: 25,
        icon: Lightbulb,
        color: 'from-amber-500 to-orange-500',
    },
];

function Shop() {
    const { coins, inventory, purchaseItem } = useGame();

    const handlePurchase = (item) => {
        const success = purchaseItem(item.id, item.price);
        if (success) {
            // Could add a success animation here
        }
    };

    return (
        <div className="min-h-screen p-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <Link to="/" className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    Shop
                </h1>
                <div className="stat-badge">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-400 font-bold">{coins}</span>
                </div>
            </header>

            <div className="max-w-2xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 mb-8 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Power Up Your Learning</h2>
                    <p className="text-dark-400">Spend coins to unlock helpful boosts</p>
                </motion.div>

                {/* Inventory */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        Your Inventory
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-card p-4 text-center">
                            <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                            <div className="text-2xl font-bold">{inventory.streakFreeze}</div>
                            <div className="text-xs text-dark-400">Streak Freeze</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                            <div className="text-2xl font-bold">{inventory.xpBoost}</div>
                            <div className="text-xs text-dark-400">XP Boost</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                            <div className="text-2xl font-bold">{inventory.hints}</div>
                            <div className="text-xs text-dark-400">Hints</div>
                        </div>
                    </div>
                </div>

                {/* Shop Items */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Items</h3>
                    {shopItems.map((item) => {
                        const Icon = item.icon;
                        const canAfford = coins >= item.price;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-dark-400">{item.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handlePurchase(item)}
                                        disabled={!canAfford}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${canAfford
                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-dark-900 hover:scale-105'
                                            : 'bg-dark-700 text-dark-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Coins className="w-4 h-4" />
                                        {item.price}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Earn More */}
                <div className="mt-8 text-center text-dark-400">
                    <p>Earn coins by completing games and challenges!</p>
                </div>
            </div>
        </div>
    );
}

export default Shop;

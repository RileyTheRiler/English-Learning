// Sentence data for Sentence Scramble game
// Each sentence includes the correct word order and difficulty

export const sentenceData = [
    // Beginner sentences (difficulty 1)
    {
        sentence: 'I go to school every day',
        words: ['I', 'go', 'to', 'school', 'every', 'day'],
        difficulty: 1,
        topic: 'daily life',
    },
    {
        sentence: 'She likes to read books',
        words: ['She', 'likes', 'to', 'read', 'books'],
        difficulty: 1,
        topic: 'hobbies',
    },
    {
        sentence: 'The weather is nice today',
        words: ['The', 'weather', 'is', 'nice', 'today'],
        difficulty: 1,
        topic: 'weather',
    },
    {
        sentence: 'Can I have a glass of water',
        words: ['Can', 'I', 'have', 'a', 'glass', 'of', 'water'],
        difficulty: 1,
        topic: 'requests',
    },
    {
        sentence: 'My name is John and I am a teacher',
        words: ['My', 'name', 'is', 'John', 'and', 'I', 'am', 'a', 'teacher'],
        difficulty: 1,
        topic: 'introductions',
    },
    // Intermediate sentences (difficulty 2)
    {
        sentence: 'I have been waiting for an hour',
        words: ['I', 'have', 'been', 'waiting', 'for', 'an', 'hour'],
        difficulty: 2,
        topic: 'time',
    },
    {
        sentence: 'Would you mind if I opened the window',
        words: ['Would', 'you', 'mind', 'if', 'I', 'opened', 'the', 'window'],
        difficulty: 2,
        topic: 'polite requests',
    },
    {
        sentence: 'If I had known I would have come earlier',
        words: ['If', 'I', 'had', 'known', 'I', 'would', 'have', 'come', 'earlier'],
        difficulty: 2,
        topic: 'conditionals',
    },
    {
        sentence: 'The meeting has been postponed until next week',
        words: ['The', 'meeting', 'has', 'been', 'postponed', 'until', 'next', 'week'],
        difficulty: 2,
        topic: 'business',
    },
    {
        sentence: 'She suggested that we should leave early',
        words: ['She', 'suggested', 'that', 'we', 'should', 'leave', 'early'],
        difficulty: 2,
        topic: 'suggestions',
    },
    // Advanced sentences (difficulty 3)
    {
        sentence: 'Despite the rain we decided to go hiking',
        words: ['Despite', 'the', 'rain', 'we', 'decided', 'to', 'go', 'hiking'],
        difficulty: 3,
        topic: 'complex',
    },
    {
        sentence: 'Not only did he finish the project but he also won an award',
        words: ['Not', 'only', 'did', 'he', 'finish', 'the', 'project', 'but', 'he', 'also', 'won', 'an', 'award'],
        difficulty: 3,
        topic: 'emphasis',
    },
    {
        sentence: 'The more you practice the better you become',
        words: ['The', 'more', 'you', 'practice', 'the', 'better', 'you', 'become'],
        difficulty: 3,
        topic: 'comparatives',
    },
    {
        sentence: 'Had I known about the traffic I would have taken the train',
        words: ['Had', 'I', 'known', 'about', 'the', 'traffic', 'I', 'would', 'have', 'taken', 'the', 'train'],
        difficulty: 3,
        topic: 'conditionals',
    },
    {
        sentence: 'Neither the manager nor the employees were aware of the problem',
        words: ['Neither', 'the', 'manager', 'nor', 'the', 'employees', 'were', 'aware', 'of', 'the', 'problem'],
        difficulty: 3,
        topic: 'correlative conjunctions',
    },
];

// Get sentences by difficulty
export const getSentencesByDifficulty = (difficulty) => {
    return sentenceData.filter(s => s.difficulty === difficulty);
};

// Get random sentences
export const getRandomSentences = (count, difficulty = null) => {
    let sentences = difficulty ? getSentencesByDifficulty(difficulty) : sentenceData;
    const shuffled = [...sentences].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export default sentenceData;

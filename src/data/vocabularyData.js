// English vocabulary organized by topic with difficulty levels
// Difficulty: 1 = beginner, 2 = intermediate, 3 = advanced

export const vocabularyData = {
    everyday: [
        { word: 'breakfast', definition: 'The first meal of the day', example: 'I had eggs for breakfast.', difficulty: 1 },
        { word: 'schedule', definition: 'A plan for activities and times', example: 'My schedule is very busy today.', difficulty: 1 },
        { word: 'appointment', definition: 'A planned meeting at a specific time', example: 'I have a doctor appointment at 3pm.', difficulty: 1 },
        { word: 'grocery', definition: 'Food and supplies bought at a store', example: 'I need to buy groceries for dinner.', difficulty: 1 },
        { word: 'commute', definition: 'Regular travel to and from work', example: 'My commute takes 30 minutes.', difficulty: 2 },
        { word: 'errand', definition: 'A short trip to do a task', example: 'I have some errands to run after work.', difficulty: 2 },
        { word: 'routine', definition: 'A regular sequence of actions', example: 'Exercise is part of my morning routine.', difficulty: 1 },
        { word: 'leisure', definition: 'Free time for enjoyment', example: 'I read books during my leisure time.', difficulty: 2 },
        { word: 'chore', definition: 'A regular household task', example: 'Washing dishes is my least favorite chore.', difficulty: 1 },
        { word: 'convenience', definition: 'Something that makes life easier', example: 'Online shopping is a great convenience.', difficulty: 2 },
    ],
    business: [
        { word: 'deadline', definition: 'The latest time to finish something', example: 'The project deadline is Friday.', difficulty: 1 },
        { word: 'colleague', definition: 'A person you work with', example: 'My colleague helped me with the report.', difficulty: 1 },
        { word: 'negotiate', definition: 'To discuss to reach an agreement', example: 'We need to negotiate the contract terms.', difficulty: 2 },
        { word: 'proposal', definition: 'A formal plan or suggestion', example: 'I submitted a proposal for the new project.', difficulty: 2 },
        { word: 'revenue', definition: 'Income earned by a business', example: 'The company revenue increased by 20%.', difficulty: 2 },
        { word: 'stakeholder', definition: 'Person with interest in a business', example: 'We presented the plan to all stakeholders.', difficulty: 3 },
        { word: 'implement', definition: 'To put a plan into action', example: 'We will implement the changes next month.', difficulty: 2 },
        { word: 'delegate', definition: 'To assign tasks to others', example: 'Good managers know how to delegate.', difficulty: 2 },
        { word: 'collaborate', definition: 'To work together on a project', example: 'Our teams will collaborate on this.', difficulty: 2 },
        { word: 'acquisition', definition: 'Buying another company', example: 'The acquisition was worth $2 billion.', difficulty: 3 },
    ],
    travel: [
        { word: 'destination', definition: 'The place you are going to', example: 'Paris is my dream destination.', difficulty: 1 },
        { word: 'itinerary', definition: 'A detailed travel plan', example: 'Our itinerary includes three cities.', difficulty: 2 },
        { word: 'reservation', definition: 'An arrangement to have something held', example: 'I made a hotel reservation online.', difficulty: 1 },
        { word: 'luggage', definition: 'Bags and suitcases for travel', example: 'My luggage weighs 20 kilograms.', difficulty: 1 },
        { word: 'departure', definition: 'The act of leaving', example: 'Departure is scheduled for 8am.', difficulty: 1 },
        { word: 'layover', definition: 'A stop between flights', example: 'We have a 3-hour layover in Dubai.', difficulty: 2 },
        { word: 'accommodation', definition: 'A place to stay', example: 'The accommodation was very comfortable.', difficulty: 2 },
        { word: 'passport', definition: 'Document for international travel', example: 'Make sure your passport is valid.', difficulty: 1 },
        { word: 'customs', definition: 'Border check for goods', example: 'We went through customs quickly.', difficulty: 2 },
        { word: 'excursion', definition: 'A short trip or outing', example: 'The boat excursion was amazing.', difficulty: 2 },
    ],
    technology: [
        { word: 'software', definition: 'Programs that run on computers', example: 'This software is easy to use.', difficulty: 1 },
        { word: 'download', definition: 'To copy data from the internet', example: 'I need to download the file.', difficulty: 1 },
        { word: 'algorithm', definition: 'A set of rules for solving problems', example: 'The algorithm finds the best route.', difficulty: 2 },
        { word: 'interface', definition: 'The way users interact with a system', example: 'The user interface is very intuitive.', difficulty: 2 },
        { word: 'database', definition: 'An organized collection of data', example: 'All customer info is in the database.', difficulty: 2 },
        { word: 'encryption', definition: 'Converting data into secret code', example: 'Encryption protects your password.', difficulty: 3 },
        { word: 'bandwidth', definition: 'Data transfer capacity', example: 'We need more bandwidth for streaming.', difficulty: 2 },
        { word: 'compatible', definition: 'Able to work together', example: 'This device is compatible with iOS.', difficulty: 2 },
        { word: 'glitch', definition: 'A small technical problem', example: 'There was a glitch in the system.', difficulty: 1 },
        { word: 'synchronize', definition: 'To make things happen together', example: 'The devices will synchronize automatically.', difficulty: 2 },
    ],
    health: [
        { word: 'symptom', definition: 'A sign of illness', example: 'Fever is a common symptom of flu.', difficulty: 1 },
        { word: 'prescription', definition: 'Doctor\'s order for medicine', example: 'I need to pick up my prescription.', difficulty: 2 },
        { word: 'diagnosis', definition: 'Identification of an illness', example: 'The diagnosis was a mild cold.', difficulty: 2 },
        { word: 'nutrition', definition: 'The study of food and health', example: 'Good nutrition is essential for health.', difficulty: 2 },
        { word: 'allergic', definition: 'Having a bad reaction to something', example: 'I am allergic to peanuts.', difficulty: 1 },
        { word: 'immunity', definition: 'Protection against disease', example: 'Vaccines help build immunity.', difficulty: 2 },
        { word: 'therapy', definition: 'Treatment for illness or problems', example: 'Physical therapy helped my back.', difficulty: 2 },
        { word: 'contagious', definition: 'Able to spread to others', example: 'The flu is highly contagious.', difficulty: 2 },
        { word: 'chronic', definition: 'Lasting a long time', example: 'She has chronic back pain.', difficulty: 2 },
        { word: 'rehabilitation', definition: 'Restoring health after illness', example: 'Rehabilitation took several months.', difficulty: 3 },
    ],
    emotions: [
        { word: 'anxious', definition: 'Feeling worried or nervous', example: 'I feel anxious before exams.', difficulty: 1 },
        { word: 'frustrated', definition: 'Feeling upset when things go wrong', example: 'I was frustrated by the delay.', difficulty: 1 },
        { word: 'overwhelmed', definition: 'Feeling like too much is happening', example: 'I felt overwhelmed by the workload.', difficulty: 2 },
        { word: 'content', definition: 'Feeling satisfied and happy', example: 'I feel content with my life.', difficulty: 1 },
        { word: 'enthusiastic', definition: 'Very excited and interested', example: 'She is enthusiastic about the project.', difficulty: 2 },
        { word: 'nostalgic', definition: 'Missing the past', example: 'The old song made me feel nostalgic.', difficulty: 2 },
        { word: 'resilient', definition: 'Able to recover from difficulties', example: 'She is very resilient after setbacks.', difficulty: 3 },
        { word: 'compassionate', definition: 'Showing care for others', example: 'He is a compassionate doctor.', difficulty: 2 },
        { word: 'indifferent', definition: 'Not caring about something', example: 'He seemed indifferent to the news.', difficulty: 2 },
        { word: 'euphoric', definition: 'Feeling extremely happy', example: 'I was euphoric after winning.', difficulty: 3 },
    ],
};

// Helper to get all words as a flat array
export const getAllWords = () => {
    return Object.values(vocabularyData).flat();
};

// Helper to get words by difficulty
export const getWordsByDifficulty = (difficulty) => {
    return getAllWords().filter(word => word.difficulty === difficulty);
};

// Helper to get words by topic
export const getWordsByTopic = (topic) => {
    return vocabularyData[topic] || [];
};

// Get random words
export const getRandomWords = (count, difficulty = null) => {
    let words = difficulty ? getWordsByDifficulty(difficulty) : getAllWords();
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export default vocabularyData;

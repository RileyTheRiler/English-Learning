// Dialogue scenarios for conversation practice

export const dialogueScenarios = [
    {
        id: 'restaurant',
        title: 'At a Restaurant',
        description: 'Practice ordering food and making requests',
        difficulty: 1,
        icon: '🍽️',
        dialogue: [
            { speaker: 'waiter', text: 'Good evening! Welcome to The Garden. Do you have a reservation?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Yes, I have a reservation for two under the name Smith.', correct: true, response: 'Excellent! Right this way, please.' },
                    { text: 'Give me a table now please.', correct: false, response: 'I see... Let me check if we have availability.' },
                    { text: 'What is a reservation?', correct: false, response: 'A reservation is when you book a table in advance.' },
                ]
            },
            { speaker: 'waiter', text: 'Here are your menus. Can I get you something to drink while you decide?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Could I have a glass of water, please?', correct: true, response: 'Of course! Still or sparkling?' },
                    { text: 'Water.', correct: false, response: 'Certainly. Just water?' },
                    { text: 'I want the most expensive wine you have.', correct: false, response: 'Our finest is the 2015 Château... Would you like to see the wine list?' },
                ]
            },
            { speaker: 'waiter', text: 'Are you ready to order, or do you need a few more minutes?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Could you recommend something? I am not sure what to have.', correct: true, response: 'Our chef special today is grilled salmon. It is very popular.' },
                    { text: 'I will have the steak, medium rare, please.', correct: true, response: 'Excellent choice! Would you like any sides with that?' },
                    { text: 'Just give me food.', correct: false, response: 'Could you be more specific about what you would like?' },
                ]
            },
        ]
    },
    {
        id: 'hotel',
        title: 'Hotel Check-in',
        description: 'Practice checking into a hotel',
        difficulty: 1,
        icon: '🏨',
        dialogue: [
            { speaker: 'receptionist', text: 'Good afternoon! Welcome to Grand Hotel. How may I assist you today?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Hello! I would like to check in. I have a reservation.', correct: true, response: 'Of course! May I have your name, please?' },
                    { text: 'Room. Now.', correct: false, response: 'I understand. Do you have a reservation with us?' },
                    { text: 'How much is a room?', correct: false, response: 'Our standard rooms start at $150 per night. Would you like to make a reservation?' },
                ]
            },
            { speaker: 'receptionist', text: 'Thank you, Mr. Johnson. I found your reservation. For three nights, correct?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Yes, that is correct. From today until Thursday.', correct: true, response: 'Perfect. I have you in a deluxe room with a city view.' },
                    { text: 'Maybe. I do not remember.', correct: false, response: 'No problem, let me confirm the dates for you.' },
                ]
            },
            { speaker: 'receptionist', text: 'Your room is on the 8th floor. Would you like help with your luggage?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Yes, please. That would be very helpful.', correct: true, response: 'I will call a bellhop right away. Is there anything else you need?' },
                    { text: 'No, thank you. I can manage.', correct: true, response: 'Very well. Here is your key card. The elevator is on your right.' },
                ]
            },
        ]
    },
    {
        id: 'job-interview',
        title: 'Job Interview',
        description: 'Practice professional interview skills',
        difficulty: 2,
        icon: '💼',
        dialogue: [
            { speaker: 'interviewer', text: 'Thank you for coming in today. Please, have a seat. Could you start by telling me a little about yourself?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Certainly. I am a software developer with five years of experience, and I have a passion for creating user-friendly applications.', correct: true, response: 'That sounds impressive. What attracted you to this position?' },
                    { text: 'I am great. You should hire me.', correct: false, response: 'I see. Could you tell me more about your specific experience?' },
                    { text: 'What do you want to know?', correct: false, response: 'Well, tell me about your professional background and relevant experience.' },
                ]
            },
            { speaker: 'interviewer', text: 'What would you say is your greatest strength?' },
            {
                speaker: 'player',
                options: [
                    { text: 'I am good at problem-solving and can stay calm under pressure. For example, I once fixed a critical bug just hours before a major launch.', correct: true, response: 'That is a valuable skill. And what about areas where you could improve?' },
                    { text: 'I have no weaknesses.', correct: false, response: 'Everyone has areas for improvement. What might yours be?' },
                ]
            },
            { speaker: 'interviewer', text: 'Do you have any questions for me about the role or the company?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Yes, could you tell me more about the team I would be working with?', correct: true, response: 'Great question! You would be joining a team of six developers...' },
                    { text: 'What is the salary?', correct: false, response: 'We can discuss compensation details later in the process.' },
                    { text: 'No, I think you covered everything.', correct: true, response: 'Alright. Thank you for your time today. We will be in touch.' },
                ]
            },
        ]
    },
    {
        id: 'doctor',
        title: 'At the Doctor',
        description: 'Practice describing symptoms and understanding medical advice',
        difficulty: 2,
        icon: '🏥',
        dialogue: [
            { speaker: 'doctor', text: 'Hello, I am Dr. Smith. What brings you in today?' },
            {
                speaker: 'player',
                options: [
                    { text: 'I have been feeling unwell for the past few days. I have a headache and a sore throat.', correct: true, response: 'I see. When did the symptoms start?' },
                    { text: 'I am sick.', correct: false, response: 'Can you describe your symptoms more specifically?' },
                ]
            },
            { speaker: 'doctor', text: 'Are you experiencing any other symptoms, such as fever or fatigue?' },
            {
                speaker: 'player',
                options: [
                    { text: 'Yes, I have had a slight fever and I have been feeling very tired.', correct: true, response: 'Thank you. Let me take your temperature and have a look at your throat.' },
                    { text: 'I do not know.', correct: false, response: 'Have you been checking your temperature at all?' },
                ]
            },
            { speaker: 'doctor', text: 'It looks like you have a viral infection. I am going to prescribe some medication. Do you have any allergies?' },
            {
                speaker: 'player',
                options: [
                    { text: 'No, I do not have any allergies that I know of.', correct: true, response: 'Good. Take this medication twice a day for five days.' },
                    { text: 'Yes, I am allergic to penicillin.', correct: true, response: 'Thank you for telling me. I will prescribe an alternative.' },
                ]
            },
        ]
    },
];

export const getScenarioById = (id) => {
    return dialogueScenarios.find(s => s.id === id);
};

export const getScenariosByDifficulty = (difficulty) => {
    return dialogueScenarios.filter(s => s.difficulty === difficulty);
};

export default dialogueScenarios;

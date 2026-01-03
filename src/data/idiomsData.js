// Common English idioms and expressions

export const idiomsData = [
    {
        idiom: 'break the ice',
        meaning: 'To start a conversation in a social situation',
        example: 'He told a joke to break the ice at the meeting.',
        origin: 'From ships breaking ice to create a path',
    },
    {
        idiom: 'a piece of cake',
        meaning: 'Something very easy to do',
        example: 'The test was a piece of cake!',
        origin: 'Cakes were given as prizes for winning simple competitions',
    },
    {
        idiom: 'hit the nail on the head',
        meaning: 'To be exactly right about something',
        example: 'You hit the nail on the head with that analysis.',
        origin: 'From carpentry - hitting the nail perfectly',
    },
    {
        idiom: 'once in a blue moon',
        meaning: 'Very rarely',
        example: 'He only visits once in a blue moon.',
        origin: 'A blue moon is a rare second full moon in a month',
    },
    {
        idiom: 'under the weather',
        meaning: 'Feeling sick or unwell',
        example: 'I am feeling under the weather today.',
        origin: 'From sailing - sick sailors went below deck, under the weather',
    },
    {
        idiom: 'bite the bullet',
        meaning: 'To face a difficult situation bravely',
        example: 'I had to bite the bullet and tell him the truth.',
        origin: 'Soldiers would bite bullets during surgery without anesthesia',
    },
    {
        idiom: 'cost an arm and a leg',
        meaning: 'To be very expensive',
        example: 'That car cost an arm and a leg!',
        origin: 'Possibly from portrait painting where limbs cost extra',
    },
    {
        idiom: 'let the cat out of the bag',
        meaning: 'To reveal a secret accidentally',
        example: 'She let the cat out of the bag about the surprise party.',
        origin: 'From market days when cats were sold as pigs in bags',
    },
    {
        idiom: 'the ball is in your court',
        meaning: 'It is your turn to take action',
        example: 'I have made my offer. The ball is in your court now.',
        origin: 'From tennis - waiting for opponent to hit the ball back',
    },
    {
        idiom: 'burning the midnight oil',
        meaning: 'Working late into the night',
        example: 'I was burning the midnight oil to finish the report.',
        origin: 'Before electricity, people used oil lamps to work at night',
    },
    {
        idiom: 'beat around the bush',
        meaning: 'To avoid talking about something directly',
        example: 'Stop beating around the bush and tell me what happened.',
        origin: 'From hunting - beating bushes to flush out game',
    },
    {
        idiom: 'get out of hand',
        meaning: 'To become uncontrollable',
        example: 'The party got out of hand when more people arrived.',
        origin: 'From horse riding - losing grip on the reins',
    },
    {
        idiom: 'in hot water',
        meaning: 'In trouble or difficulty',
        example: 'He is in hot water with his boss for being late.',
        origin: 'From medieval punishment of boiling criminals',
    },
    {
        idiom: 'kill two birds with one stone',
        meaning: 'To accomplish two things with one action',
        example: 'By cycling to work, I kill two birds with one stone - exercise and commuting.',
        origin: 'Ancient hunting technique',
    },
    {
        idiom: 'on the same page',
        meaning: 'In agreement or understanding',
        example: 'Let us make sure we are on the same page before the meeting.',
        origin: 'From reading the same page of a book together',
    },
];

export const getRandomIdioms = (count) => {
    const shuffled = [...idiomsData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export default idiomsData;

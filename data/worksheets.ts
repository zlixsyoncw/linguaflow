import { ExerciseContent, Question } from '../types';

// Helper to create questions easily
const createMC = (id: number, text: string, options: string[], correctAnswer: string): Question => ({
  id, text, type: 'multiple-choice', options, correctAnswer
});

const createShort = (id: number, text: string): Question => ({
  id, text, type: 'short-answer', options: []
});

// --- GRAMMAR WORKSHEETS ---

const GRAMMAR_Q_BASE: Question[] = [
  createMC(101, "Which sentence is written correctly?", ["He don’t like pizza.", "He doesn’t likes pizza.", "He doesn’t like pizza.", "He not like pizza."], "He doesn’t like pizza."),
  createMC(102, "Choose the correct past tense form: (run)", ["runned", "ran", "running", "run"], "ran"),
  createMC(103, "Which of these is a compound sentence?", ["I like apples.", "I like apples and I eat them often.", "Because I like apples.", "Although I like apples."], "I like apples and I eat them often."),
  createMC(104, "Identify the adverb:", ["quick", "quickly", "quicker", "quickest"], "quickly"),
  createMC(105, "Which sentence uses correct punctuation?", ["Let’s eat, Grandma!", "Lets eat Grandma!", "Lets eat, Grandma!", "Let’s eat Grandma"], "Let’s eat, Grandma!"),
  createShort(106, "Write a sentence using a conjunction."),
  createShort(107, "What is the difference between a noun and a pronoun?"),
  createShort(108, "Give two examples of irregular verbs."),
  createShort(109, "Write one sentence in the present continuous tense."),
  createShort(110, "Correct this sentence: “She don’t has no pencil.”")
];

const GRAMMAR_2: Question[] = [
  createMC(201, "Choose the correct past form of 'teach'.", ["teached", "taught", "thought", "teach"], "taught"),
  createMC(202, "Which sentence is in the Past Continuous?", ["I played.", "I was playing.", "I had played.", "I play."], "I was playing."),
  createMC(203, "Yesterday, I ___ to the park.", ["go", "gone", "went", "going"], "went"),
  createMC(204, "Which verb is irregular?", ["walk", "play", "speak", "jump"], "speak"),
  createMC(205, "She ___ finished her homework.", ["has", "have", "having", "haves"], "has"),
  createShort(206, "Write a sentence using the verb 'bought'."),
  createShort(207, "Change to past tense: 'I eat an apple.'"),
  createShort(208, "List three irregular verbs."),
  createShort(209, "Write a sentence using 'had finished'."),
  createShort(210, "Correct this: 'I goed to the store yesterday.'")
];

const GRAMMAR_3: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 100}));
const GRAMMAR_4: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 200}));
const GRAMMAR_5: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 300}));
const GRAMMAR_7: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 400}));
const GRAMMAR_8: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 500}));
const GRAMMAR_9: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 600}));
const GRAMMAR_10: Question[] = [ ...GRAMMAR_2 ].map(q => ({...q, id: q.id + 700}));

// --- READING WORKSHEETS (From Screenshots) ---

export const PRESET_WORKSHEETS: ExerciseContent[] = [
    // Grammar
    { title: "Grade 8 English Worksheet 1", content: "General Grammar Review", questions: GRAMMAR_Q_BASE },
    { title: "Grade 8 English Worksheet 2", content: "Verbs and Tenses", questions: GRAMMAR_2 },
    { title: "Grade 8 English Worksheet 3", content: "Sentence Structure", questions: GRAMMAR_3 },
    { title: "Grade 8 English Worksheet 4", content: "Adjectives and Adverbs", questions: GRAMMAR_4 },
    { title: "Grade 8 English Worksheet 5", content: "Prepositions", questions: GRAMMAR_5 },
    { title: "Grade 8 English Worksheet 7", content: "Direct & Indirect Speech", questions: GRAMMAR_7 },
    { title: "Grade 8 English Worksheet 8", content: "Active & Passive Voice", questions: GRAMMAR_8 },
    { title: "Grade 8 English Worksheet 9", content: "Modal Verbs", questions: GRAMMAR_9 },
    { title: "Grade 8 English Worksheet 10", content: "Conditionals", questions: GRAMMAR_10 },
    
    // Reading Worksheet 1
    {
        title: "Reading Worksheet 1 – Everyday Life",
        content: `Text 1: Morning Routines\nEvery morning, Alex follows the same routine. He wakes up early, prepares breakfast, and plans his day before leaving the house.\n\nText 2: A Missed Bus\nLena missed her bus one rainy day. Instead of panicking, she walked and discovered a new café along the way.\n\nText 3: After-School Practice\nThe gym was loud during basketball practice, but teamwork helped the players improve.\n\nText 4: Helping a Neighbor\nSam noticed his elderly neighbor struggling with groceries and offered help.\n\nText 5: Cooking Together\nCooking dinner as a family allowed everyone to share stories and responsibilities.\n\nText 6: Evening Walk\nA short walk at sunset helped Mia relax after a long day.`,
        questions: [
            createShort(1001, "What is the first thing Alex does in the morning?"),
            createShort(1002, "Why might planning his day be helpful?"),
            createShort(1003, "Describe one detail from the routine."),
            createShort(1004, "What problem does Lena face?"),
            createShort(1005, "How does she respond?"),
            createShort(1006, "What unexpected result occurs?"),
            createShort(1007, "Where does the practice take place?"),
            createShort(1008, "What helps the players improve?"),
            createShort(1009, "What word describes the gym's atmosphere?"),
            createShort(1010, "Who needed help?"),
            createShort(1011, "What action did Sam take?"),
            createShort(1012, "What does this show about Sam's character?"),
            createShort(1013, "Who cooks together?"),
            createShort(1014, "What do they share besides food?"),
            createShort(1015, "Why is this activity meaningful?"),
            createShort(1016, "When does Mia take the walk?"),
            createShort(1017, "How does she feel afterward?"),
            createShort(1018, "Why might walking help her relax?")
        ]
    },
    // Reading Worksheet 2
    {
        title: "Reading Worksheet 2 – Nature & Environment",
        content: `Text 1: Forest Sounds\nThe forest was full of sounds: birds chirping, leaves rustling, and wind whispering.\n\nText 2: River Cleanup\nVolunteers gathered to clean trash from the river, protecting wildlife.\n\nText 3: Changing Seasons\nAs autumn arrived, the air grew cooler and leaves changed color.\n\nText 4: A Garden Grows\nWith patience and care, the small garden produced fresh vegetables.\n\nText 5: Mountain Hike\nThe hike was challenging, but the view from the top was rewarding.\n\nText 6: Rainy Afternoon\nRain tapped on the windows while plants soaked up the water.`,
        questions: [
            createShort(2001, "List two sounds mentioned."),
            createShort(2002, "What creates the rustling sound?"),
            createShort(2003, "How does the forest feel based on the description?"),
            createShort(2004, "Who gathered at the river?"),
            createShort(2005, "Why was the cleanup important?"),
            createShort(2006, "Who benefits from their work?"),
            createShort(2007, "Which season is described?"),
            createShort(2008, "What changes occur?"),
            createShort(2009, "How does the air feel?"),
            createShort(2010, "What helped the garden grow?"),
            createShort(2011, "What was produced?"),
            createShort(2012, "What lesson does this text suggest?"),
            createShort(2013, "What activity is described?"),
            createShort(2014, "What made it difficult?"),
            createShort(2015, "Why was it worth it?"),
            createShort(2016, "What weather is described?"),
            createShort(2017, "Who benefits from the rain?"),
            createShort(2018, "What sound does the rain make?")
        ]
    },
    // Reading Worksheet 3
    {
        title: "Reading Worksheet 3 – Problem Solving",
        content: `Text 1: Lost Keys\nWhen Jordan lost his keys, he retraced his steps and found them.\n\nText 2: Group Project\nThe group disagreed at first, but discussion helped them agree on a plan.\n\nText 3: Broken Toy\nInstead of throwing it away, Ana fixed her toy with glue.\n\nText 4: Time Management\nBy making a schedule, Leo finished his homework on time.\n\nText 5: Practice Makes Progress\nRepeated practice helped Nina improve her piano skills.\n\nText 6: Asking for Help\nWhen confused, Max asked questions and understood better.`,
        questions: [
            createShort(3001, "What did Jordan lose?"),
            createShort(3002, "How did he solve the problem?"),
            createShort(3003, "What can we learn from this?"),
            createShort(3004, "What was the initial problem?"),
            createShort(3005, "What helped solve it?"),
            createShort(3006, "What skill is important here?"),
            createShort(3007, "What was broken?"),
            createShort(3008, "What choice did Ana make?"),
            createShort(3009, "Why was this a good solution?"),
            createShort(3010, "What tool did Leo use?"),
            createShort(3011, "What was the result?"),
            createShort(3012, "Why is scheduling useful?"),
            createShort(3013, "What activity is practiced?"),
            createShort(3014, "What causes improvement?"),
            createShort(3015, "What idea does this text emphasize?"),
            createShort(3016, "What problem did Max have?"),
            createShort(3017, "How did he solve it?"),
            createShort(3018, "Why is asking questions helpful?")
        ]
    },
    // Reading Worksheet 4
    {
        title: "Reading Worksheet 4 – Emotions & Relationships",
        content: `Text 1: New School\nStarting a new school made Jamie nervous but also excited.\n\nText 2: Team Support\nEncouragement from teammates boosted confidence.\n\nText 3: A Thank-You Note\nWriting a thank-you note showed appreciation.\n\nText 4: Resolving Conflict\nCalm conversation helped two friends resolve a disagreement.\n\nText 5: Shared Laughter\nLaughing together strengthened friendships.\n\nText 6: Listening Carefully\nListening made others feel understood.`,
        questions: [
            createShort(4001, "How does Jamie feel?"),
            createShort(4002, "Why might these feelings occur?"),
            createShort(4003, "Name one emotion mentioned."),
            createShort(4004, "Who gives encouragement?"),
            createShort(4005, "What effect does it have?"),
            createShort(4006, "Why is support important?"),
            createShort(4007, "What was written?"),
            createShort(4008, "What feeling does it show?"),
            createShort(4009, "Why is gratitude important?"),
            createShort(4010, "What problem existed?"),
            createShort(4011, "How was it resolved?"),
            createShort(4012, "What approach worked best?"),
            createShort(4013, "What activity strengthens friendships?"),
            createShort(4014, "How does it help?"),
            createShort(4015, "What mood is created?"),
            createShort(4016, "What action is described?"),
            createShort(4017, "How do others feel?"),
            createShort(4018, "Why is listening important?")
        ]
    },
    // Reading Worksheet 5
    {
        title: "Reading Worksheet 5 – Imagination & Creativity",
        content: `Text 1: Drawing Ideas\nA blank page inspired many creative drawings.\n\nText 2: Story Seeds\nA single idea grew into a full story.\n\nText 3: Building with Blocks\nBlocks became towers, bridges, and cities.\n\nText 4: Music Mood\nDifferent songs created different moods.\n\nText 5: Inventing a Game\nRules were tested and changed to make the game fun.\n\nText 6: Creative Writing\nWriting freely helped ideas flow.`,
        questions: [
            createShort(5001, "What inspired creativity?"),
            createShort(5002, "What was created?"),
            createShort(5003, "Why can a blank page be powerful?"),
            createShort(5004, "What starts the story?"),
            createShort(5005, "What does it become?"),
            createShort(5006, "What does this show about ideas?"),
            createShort(5007, "What materials are used?"),
            createShort(5008, "What are they turned into?"),
            createShort(5009, "What skill is shown?"),
            createShort(5010, "What changes the mood?"),
            createShort(5011, "What effect does music have?"),
            createShort(5012, "Give one example from the text."),
            createShort(5013, "What was invented?"),
            createShort(5014, "Why were rules changed?"),
            createShort(5015, "What was the goal?"),
            createShort(5016, "What activity helps ideas flow?"),
            createShort(5017, "How does it help?"),
            createShort(5018, "Why is freedom important in creativity?")
        ]
    },
    // Reading Worksheet 6
    {
        title: "Reading Worksheet 6 – History & Society",
        content: `Text 1: Community Traditions\nTraditions connect people across generations.\n\nText 2: Local History\nLearning local history helped students understand their town.\n\nText 3: Shared Rules\nRules allow communities to function smoothly.\n\nText 4: Public Libraries\nLibraries provide free access to knowledge.\n\nText 5: Volunteering\nHelping others strengthens society.\n\nText 6: Celebrations\nPublic celebrations bring people together.`,
        questions: [
            createShort(6001, "What do traditions connect?"),
            createShort(6002, "Across how many generations?"),
            createShort(6003, "Why are traditions important?"),
            createShort(6004, "What did students learn?"),
            createShort(6005, "What did it help them understand?"),
            createShort(6006, "Why is local history useful?"),
            createShort(6007, "What do rules help with?"),
            createShort(6008, "Who follows the rules?"),
            createShort(6009, "Why are rules necessary?"),
            createShort(6010, "What do libraries provide?"),
            createShort(6011, "Is there a cost?"),
            createShort(6012, "Why are libraries valuable?"),
            createShort(6013, "What action is described?"),
            createShort(6014, "What does it strengthen?"),
            createShort(6015, "Why does helping matter?"),
            createShort(6016, "What brings people together?"),
            createShort(6017, "Who participates?"),
            createShort(6018, "What is the main purpose?")
        ]
    },
    // Reading Worksheet 7
    {
        title: "Reading Worksheet 7 – Science & Curiosity",
        content: `Text 1: Asking Why\nCuriosity begins by asking questions about the world.\n\nText 2: Simple Experiments\nSmall experiments helped students test ideas.\n\nText 3: Observation Skills\nCareful observation led to better understanding.\n\nText 4: Cause and Effect\nChanging one variable affected the result.\n\nText 5: Learning from Mistakes\nMistakes provided useful information.\n\nText 6: Scientific Tools\nTools help scientists measure accurately.`,
        questions: [
            createShort(7001, "What begins curiosity?"),
            createShort(7002, "What are questions about?"),
            createShort(7003, "Why is curiosity important?"),
            createShort(7004, "What did students do?"),
            createShort(7005, "What did experiments help with?"),
            createShort(7006, "Why test ideas?"),
            createShort(7007, "What skill is used?"),
            createShort(7008, "What does it lead to?"),
            createShort(7009, "Why is observation important?"),
            createShort(7010, "What was changed?"),
            createShort(7011, "What happened to the result?"),
            createShort(7012, "What concept is shown?"),
            createShort(7013, "What provided information?"),
            createShort(7014, "Was it useful?"),
            createShort(7015, "Why are mistakes valuable?"),
            createShort(7016, "Who uses tools?"),
            createShort(7017, "What do tools help with?"),
            createShort(7018, "Why is accuracy important?")
        ]
    },
    // Reading Worksheet 8
    {
        title: "Reading Worksheet 8 – Travel & Discovery",
        content: `Text 1: First Flight\nEmma felt nervous but excited during her first airplane flight.\n\nText 2: City Visit\nWalking through the city, Marco discovered new foods and music.\n\nText 3: Camping Trip\nAt night, the campers watched stars far from city lights.\n\nText 4: Train Journey\nThe train ride allowed passengers to enjoy changing landscapes.\n\nText 5: Beach Day\nFriends built sandcastles and swam in warm water.\n\nText 6: Road Trip\nMusic and conversation made the long drive feel shorter.`,
        questions: [
            createShort(8001, "How does Emma feel?"),
            createShort(8002, "What experience is described?"),
            createShort(8003, "Why might she feel both emotions?"),
            createShort(8004, "Where is Marco walking?"),
            createShort(8005, "What does he discover?"),
            createShort(8006, "Why is this exciting?"),
            createShort(8007, "Where are the campers?"),
            createShort(8008, "What do they watch?"),
            createShort(8009, "Why are the stars clearer there?"),
            createShort(8010, "What transportation is used?"),
            createShort(8011, "What do passengers see?"),
            createShort(8012, "Why is the view changing?"),
            createShort(8013, "Where are the friends?"),
            createShort(8014, "What activities do they do?"),
            createShort(8015, "What makes the day enjoyable?"),
            createShort(8016, "What made the drive enjoyable?"),
            createShort(8017, "Why did time feel shorter?"),
            createShort(8018, "Who might be traveling together?")
        ]
    },
    // Reading Worksheet 9
    {
        title: "Reading Worksheet 9 – Technology & Learning",
        content: `Text 1: Online Class\nStudents joined an online class from home.\n\nText 2: New App\nA new app helped users organize their tasks.\n\nText 3: Robot Project\nStudents built a small robot that followed simple commands.\n\nText 4: Digital Research\nCareful online research helped Mia finish her report.\n\nText 5: Learning to Code\nPractice helped Ben understand coding basics.\n\nText 6: Virtual Museum\nA virtual tour allowed visitors to explore history from home.`,
        questions: [
            createShort(9001, "Where do students learn?"),
            createShort(9002, "How do they join class?"),
            createShort(9003, "Why might online learning be useful?"),
            createShort(9004, "What does the app help with?"),
            createShort(9005, "Who benefits from it?"),
            createShort(9006, "Why is organization important?"),
            createShort(9007, "What did students build?"),
            createShort(9008, "What could it do?"),
            createShort(9009, "Why is this project educational?"),
            createShort(9010, "What helped Mia finish?"),
            createShort(9011, "What tool did she use?"),
            createShort(9012, "Why is research important?"),
            createShort(9013, "What skill is Ben learning?"),
            createShort(9014, "What helps him improve?"),
            createShort(9015, "Why is practice important?"),
            createShort(9016, "What did visitors explore?"),
            createShort(9017, "How do they explore it?"),
            createShort(9018, "Why is virtual access helpful?")
        ]
    },
    // Reading Worksheet 10
    {
        title: "Reading Worksheet 10 – Health & Activities",
        content: `Text 1: Morning Run\nRunning each morning helped Olivia feel energetic.\n\nText 2: Healthy Lunch\nA balanced lunch gave students energy for the afternoon.\n\nText 3: Team Sport\nPlaying soccer taught teamwork and cooperation.\n\nText 4: Rest and Sleep\nA good night's sleep improved concentration.\n\nText 5: Bike Ride\nA weekend bike ride allowed the family to stay active together.\n\nText 6: Stretching Exercise\nStretching before activity helped prevent injuries.`,
        questions: [
            createShort(10001, "What activity does Olivia do?"),
            createShort(10002, "How does she feel after?"),
            createShort(10003, "Why might exercise help?"),
            createShort(10004, "What meal is described?"),
            createShort(10005, "What does it provide?"),
            createShort(10006, "Why is balance important?"),
            createShort(10007, "What sport is played?"),
            createShort(10008, "What skills are learned?"),
            createShort(10009, "Why are these skills useful?"),
            createShort(10010, "What improves concentration?"),
            createShort(10011, "When does this happen?"),
            createShort(10012, "Why is sleep important?"),
            createShort(10013, "What activity is done?"),
            createShort(10014, "Who participates?"),
            createShort(10015, "Why is it beneficial?"),
            createShort(10016, "When do people stretch?"),
            createShort(10017, "What does stretching help prevent?"),
            createShort(10018, "Why is prevention important?")
        ]
    }
];

export const getWorksheetById = (id: number) => {
    return PRESET_WORKSHEETS.find(w => w.title.includes(`Worksheet ${id}`));
};

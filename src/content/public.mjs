// PUBLIC CONTENT ONLY. Never add private notes, manuscripts, credentials, or drafts.
// Reading-practice material below is original guidance, not an excerpt from Dylan's books.
export const content = {
  site: { title: 'Rhyme Study Guide', author: 'Dylan', base: '/RhymeStudyGuide/', origin: 'https://luminarylabs-dev.github.io' },
  books: [],
  chapters: [],
  author: { name: 'Dylan', biography: null },
  themes: [
    { slug: 'belonging', title: 'Belonging', eyebrow: 'People & places', description: 'Look for the moments when a character feels at home—and the moments when they don’t.', question: 'Is belonging something we find, something we create, or both?', approach: 'Notice who is welcomed, who is left out, and what changes when someone is understood. Find a small detail that reveals a larger connection.', prompt: 'Choose a place in your reading. How does it change the way a character behaves?', terms: ['setting', 'imagery'], mark: '01' },
    { slug: 'change', title: 'Change', eyebrow: 'Becoming & growing', description: 'Follow the quiet shifts that make the ending different from the beginning.', question: 'Can a small choice change the shape of a whole story?', approach: 'Compare an early choice with a later one. Look beyond events: a changed word, habit, or relationship can reveal growth.', prompt: 'What does a character understand now that they did not understand before?', terms: ['character', 'theme'], mark: '02' },
    { slug: 'perspective', title: 'Perspective', eyebrow: 'Seeing & understanding', description: 'Step outside a first impression. Ask whose eyes you are seeing through.', question: 'What might this story look like from someone else’s point of view?', approach: 'Separate what the narrator tells you from what you can infer. Notice what remains unsaid and whose experience is missing.', prompt: 'Retell a moment from a different point of view. What changes, and what stays the same?', terms: ['narrator', 'inference'], mark: '03' }
  ],
  vocabulary: [
    { slug: 'character', title: 'Character', definition: 'A person, animal, or other being who takes part in a story.', context: 'Watch what a character does, says, and chooses. Those details can tell you more than a description alone.', example: 'A person returns a lost letter instead of keeping it. What might that choice reveal?', themes: ['change'] },
    { slug: 'imagery', title: 'Imagery', definition: 'Descriptive language that evokes a sensory experience, such as a sight, sound, or texture.', context: 'Notice language that helps you imagine an experience rather than simply naming it.', example: '“Rain tapped the tin roof.” Which sense does this original example appeal to?', themes: ['belonging'] },
    { slug: 'inference', title: 'Inference', definition: 'An interpretation drawn from evidence and reasoning rather than a direct statement.', context: 'Pair your interpretation with a detail from the text. More than one inference may be possible.', example: 'Someone pauses at a doorway and folds a letter twice. What could you infer—and what would you still need to know?', themes: ['perspective'] },
    { slug: 'narrator', title: 'Narrator', definition: 'The voice that tells a story. The narrator is not necessarily the author.', context: 'Ask what the narrator knows, notices, and chooses to tell you.', example: 'How would a scene change if the person watching it became the person telling it?', themes: ['perspective'] },
    { slug: 'rhyme', title: 'Rhyme', definition: 'A repetition of similar sounds, often at the ends of words or lines.', context: 'Read aloud and listen for echoes. A repeated sound may connect words, create expectation, or emphasize an idea.', example: 'Read “light” and “night” aloud. What sound do they share?', themes: [] },
    { slug: 'rhythm', title: 'Rhythm', definition: 'The pattern of stressed and unstressed sounds, pauses, and movement in language.', context: 'Read a sentence aloud twice. Notice where your voice slows, speeds up, or rests.', example: 'Compare a short sentence with a long one. How does the pace change?', themes: [] },
    { slug: 'setting', title: 'Setting', definition: 'The place, time, and surrounding conditions in which a story happens.', context: 'Ask how the surroundings shape what characters can do and how they feel.', example: 'Would a conversation feel different in a crowded room and an empty street? Why?', themes: ['belonging'] },
    { slug: 'theme', title: 'Theme', definition: 'An idea or question developed through a work’s events, language, and relationships.', context: 'A topic is a starting point. Ask what the work suggests about that topic, and support your interpretation with evidence.', example: 'If a story returns to friendship, what does it suggest about being a friend?', themes: ['change'] }
  ],
  lessons: [
    { slug: 'notice', title: 'Notice the small things', subtitle: 'Slow down. Let a detail catch your attention.', time: '5–10 minutes', step: '01', theme: 'belonging', terms: ['imagery', 'setting'], introduction: 'Choose a short passage from a book you have with you. Read it once for meaning, then again for the details you nearly missed.', stages: [
      { title: 'Read with curiosity', text: 'Read your passage at a comfortable pace. What stays with you after the last sentence?' },
      { title: 'Choose one detail', text: 'Find a word, sound, gesture, or description that draws your attention. Write it down with its page number.' },
      { title: 'Look a little closer', text: 'Ask what that detail adds. Does it shape the mood, reveal a character, or change how you picture a place?' }
    ], questions: [
      { title: 'What did you notice on a second reading?', hint: 'Look for a detail you skipped the first time. Describe how it changes your understanding.' },
      { title: 'Which word does the most work?', hint: 'Try replacing it with another word. What feeling or meaning would be lost?' },
      { title: 'What are you still wondering?', hint: 'An unanswered question is a useful place to begin your next reading.' }
    ] },
    { slug: 'connect', title: 'Follow an idea', subtitle: 'Find the thread between one moment and another.', time: '10–15 minutes', step: '02', theme: 'change', terms: ['theme', 'character'], introduction: 'Choose two moments from your reading that seem connected. They might share an image, a choice, a question, or a feeling.', stages: [
      { title: 'Find the first thread', text: 'Describe the first moment in your own words. Note a page number so you can find it again.' },
      { title: 'Look for an echo', text: 'Find a later moment that repeats, challenges, or changes the first. Similarities and differences both matter.' },
      { title: 'Make a connection', text: 'Explain what the two moments suggest together. Use a detail from each to support your thinking.' }
    ], questions: [
      { title: 'What changes between these moments?', hint: 'Compare the character’s choices, the language, or the mood—not just what happens.' },
      { title: 'What idea holds them together?', hint: 'Start with a topic, then turn it into a question the story seems to explore.' },
      { title: 'Could someone read the connection differently?', hint: 'Imagine another interpretation. What evidence would support it?' }
    ] },
    { slug: 'reflect', title: 'Make room for another view', subtitle: 'Bring your reading into conversation.', time: '10–15 minutes', step: '03', theme: 'perspective', terms: ['narrator', 'inference'], introduction: 'Choose a moment that could be understood in more than one way. Think about it on your own, then invite another perspective.', stages: [
      { title: 'Name your first impression', text: 'Write what you think is happening and why. Separate what the text says from what you infer.' },
      { title: 'Try another viewpoint', text: 'Imagine how another character or reader might understand the same moment. What would they notice?' },
      { title: 'Return to the text', text: 'Compare interpretations using specific details. You can revise your thinking without needing a single final answer.' }
    ], questions: [
      { title: 'Whose perspective shapes this moment?', hint: 'Consider who speaks, who observes, and whose thoughts you cannot hear.' },
      { title: 'What would change your mind?', hint: 'Identify the kind of evidence that would challenge your first impression.' },
      { title: 'What will you take into your next reading?', hint: 'Choose a question, an idea, or a habit of attention to return to.' }
    ] }
  ],
  prompts: [
    { category: 'Notice', text: 'Which small detail would you ask another reader to look at again?', followup: 'Return to the passage together. What do you each see?', lesson: 'notice' },
    { category: 'Interpret', text: 'When did your understanding of a character change?', followup: 'Find the moment that shifted your thinking. Compare your interpretations.', lesson: 'connect' },
    { category: 'Connect', text: 'What connects the beginning of your reading to the end?', followup: 'Look for a repeated image, question, or choice.', lesson: 'connect' },
    { category: 'Reflect', text: 'What question would you carry into the next chapter?', followup: 'Explain why it matters to you. Listen for a question you had not considered.', lesson: 'reflect' },
    { category: 'Imagine', text: 'How would this scene change if someone else told it?', followup: 'Retell a few sentences from another point of view.', lesson: 'reflect' }
  ]
};

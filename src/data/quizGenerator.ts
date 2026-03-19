import type { Flashcard, QuizQuestion } from '../types/brain.types';

/**
 * Fisher-Yates shuffle (in-place, returns the same array).
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate multiple-choice quiz questions from a set of flashcards.
 *
 * Each question uses a card's term as the prompt and offers four definition
 * options (one correct + three distractors drawn from other cards).
 *
 * @param cards  – pool of flashcards to draw from (must have >= 4 cards)
 * @param count  – desired number of questions (clamped to available cards)
 * @returns        array of QuizQuestion objects
 */
export function generateQuizQuestions(
  cards: Flashcard[],
  count: number
): QuizQuestion[] {
  if (cards.length < 4) return [];

  const clamped = Math.min(count, cards.length);
  const picked = shuffle([...cards]).slice(0, clamped);

  return picked.map((card, index) => {
    // Gather 3 unique distractors
    const distractors = shuffle(
      cards.filter((c) => c.id !== card.id)
    ).slice(0, 3);

    // Build options array and shuffle
    const options = shuffle([
      card.definition,
      ...distractors.map((d) => d.definition),
    ]);

    const correctIndex = options.indexOf(card.definition);

    return {
      id: `gen_${index}_${card.id}`,
      type: 'multiple_choice' as const,
      question: `What is the definition of "${card.term}"?`,
      options,
      correctIndex,
      explanation: card.definition,
      chapter: card.chapter,
      difficulty: 'basic' as const,
    };
  });
}

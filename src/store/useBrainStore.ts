import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ViewMode, LesionState, CognitiveDomain, BrainRegion,
  HoverInfo, ChapterData, QuizSession, FlashcardSession, Flashcard, Hemisphere
} from '../types/brain.types';
import { chapters } from '../data/flashcardData';
import { brainRegions } from '../data/brainRegions';
import { cognitiveDomains } from '../data/cognitiveDomains';
import { hemisphereRegionIds } from '../data/autismData';

/**
 * Age-dependent brain plasticity (Kennard principle): younger brains recover a
 * larger fraction of a lesion-induced deficit than older ones. Returns the
 * fraction of the deficit that is recovered, in the range 0–1.
 */
export function plasticityRecovery(age: number): number {
  const MAX_RECOVERY = 0.7; // recovery ceiling for a newborn
  const TAU = 22; // years — controls how fast plasticity declines with age
  const FLOOR = 0.03; // minimal residual plasticity in late adulthood
  const recovery = MAX_RECOVERY * Math.exp(-age / TAU);
  return Math.max(FLOOR, recovery);
}

/** Compute per-domain deficits for a lesion, attenuated by age-based plasticity. */
function computeLesionEffects(
  region: BrainRegion,
  severity: number,
  age: number,
): Record<string, number> {
  const recovery = plasticityRecovery(age);
  const effects: Record<string, number> = {};
  for (const [domain, maxDeficit] of Object.entries(region.lesionEffects)) {
    effects[domain] = Math.round((severity / 100) * maxDeficit * (1 - recovery));
  }
  return effects;
}

interface BrainStoreState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedRegionId: string | null;
  hoveredRegionId: string | null;
  hoverInfo: HoverInfo | null;
  selectRegion: (id: string | null) => void;
  setHoveredRegion: (id: string | null, info?: HoverInfo) => void;

  // Hemisphere / autism lens
  selectedHemisphere: Hemisphere | null;
  selectHemisphere: (h: Hemisphere | null) => void;
  highlightedRegionIds: string[];
  setHighlightedRegions: (ids: string[]) => void;

  // Lesion-mode "predict the deficit" guess flow
  guessDomains: string[];
  guessRevealed: boolean;
  toggleGuessDomain: (domainId: string) => void;
  revealGuess: () => void;
  resetGuess: () => void;

  activeLesions: LesionState[];
  addLesion: (regionId: string, severity?: number) => void;
  removeLesion: (regionId: string) => void;
  updateLesionSeverity: (regionId: string, severity: number) => void;
  clearAllLesions: () => void;

  patientAge: number;
  setPatientAge: (age: number) => void;

  domains: CognitiveDomain[];
  recalculateDomains: () => void;

  selectedChapter: number | null;
  setSelectedChapter: (ch: number | null) => void;
  chapters: ChapterData[];

  quizSession: QuizSession | null;
  startQuiz: (chapter?: number) => void;
  answerQuiz: (answerIndex: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;

  flashcardSession: FlashcardSession | null;
  startFlashcards: (chapter?: number) => void;
  flipCard: () => void;
  nextCard: () => void;
  prevCard: () => void;
  markCardKnown: (cardId: string) => void;
  endFlashcards: () => void;

  isAutoRotating: boolean;
  toggleAutoRotate: () => void;
  brainOpacity: number;
  setBrainOpacity: (val: number) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: Flashcard[];
}

export const useBrainStore = create<BrainStoreState>()(
  devtools(
    (set, get) => ({
      viewMode: 'explore',
      setViewMode: (mode) => set({
        viewMode: mode,
        guessDomains: [],
        guessRevealed: false,
        selectedHemisphere: null,
        highlightedRegionIds: [],
      }),

      selectedRegionId: null,
      hoveredRegionId: null,
      hoverInfo: null,
      // Reset the guess flow whenever a different region is selected.
      selectRegion: (id) => set({ selectedRegionId: id, guessDomains: [], guessRevealed: false }),
      setHoveredRegion: (id, info) => set({
        hoveredRegionId: id,
        hoverInfo: info ?? null,
      }),

      selectedHemisphere: null,
      // Selecting a hemisphere pulses all of its autism-relevant regions at once.
      selectHemisphere: (h) => set({
        selectedHemisphere: h,
        highlightedRegionIds: h ? hemisphereRegionIds(h) : [],
      }),
      highlightedRegionIds: [],
      setHighlightedRegions: (ids) => set({ highlightedRegionIds: ids }),

      guessDomains: [],
      guessRevealed: false,
      toggleGuessDomain: (domainId) => {
        const { guessDomains, guessRevealed } = get();
        if (guessRevealed) return; // locked once revealed
        set({
          guessDomains: guessDomains.includes(domainId)
            ? guessDomains.filter((d) => d !== domainId)
            : [...guessDomains, domainId],
        });
      },
      revealGuess: () => set({ guessRevealed: true }),
      resetGuess: () => set({ guessDomains: [], guessRevealed: false }),

      activeLesions: [],
      addLesion: (regionId, severity = 50) => {
        const { activeLesions, patientAge } = get();
        if (activeLesions.find((l) => l.regionId === regionId)) return;
        const region = brainRegions.find((r) => r.id === regionId);
        if (!region) return;
        const effects = computeLesionEffects(region, severity, patientAge);
        set({
          activeLesions: [...activeLesions, { regionId, severity, effects }],
        });
        get().recalculateDomains();
      },

      removeLesion: (regionId) => {
        set({
          activeLesions: get().activeLesions.filter((l) => l.regionId !== regionId),
        });
        get().recalculateDomains();
      },

      updateLesionSeverity: (regionId, severity) => {
        const region = brainRegions.find((r) => r.id === regionId);
        if (!region) return;
        const effects = computeLesionEffects(region, severity, get().patientAge);
        set({
          activeLesions: get().activeLesions.map((l) =>
            l.regionId === regionId ? { ...l, severity, effects } : l
          ),
        });
        get().recalculateDomains();
      },

      clearAllLesions: () => {
        set({ activeLesions: [] });
        get().recalculateDomains();
      },

      patientAge: 30,
      setPatientAge: (age) => {
        const updated = get().activeLesions.map((l) => {
          const region = brainRegions.find((r) => r.id === l.regionId);
          if (!region) return l;
          return { ...l, effects: computeLesionEffects(region, l.severity, age) };
        });
        set({ patientAge: age, activeLesions: updated });
        get().recalculateDomains();
      },

      domains: cognitiveDomains.map((d) => ({ ...d })),
      recalculateDomains: () => {
        const { activeLesions } = get();
        const updatedDomains = cognitiveDomains.map((baseDomain) => {
          let worstDeficit = 0;
          for (const lesion of activeLesions) {
            const deficit = lesion.effects[baseDomain.id] ?? 0;
            worstDeficit = Math.max(worstDeficit, deficit);
          }
          return {
            ...baseDomain,
            currentScore: Math.max(0, baseDomain.baselineScore - worstDeficit),
          };
        });
        set({ domains: updatedDomains });
      },

      selectedChapter: null,
      setSelectedChapter: (ch) => set({ selectedChapter: ch }),
      chapters: chapters,

      quizSession: null,
      startQuiz: (chapter) => {
        const sourceCards = chapter
          ? chapters.find((c) => c.chapter === chapter)?.cards ?? []
          : chapters.flatMap((c) => c.cards);

        if (sourceCards.length < 4) return;

        const shuffled = [...sourceCards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(20, shuffled.length));

        // Question type generators
        const questionTypes = [
          // Type 1: Term -> pick correct Definition
          (card: typeof sourceCards[0], wrongs: typeof sourceCards) => ({
            question: `What is "${card.term}"?`,
            options: [card.definition, ...wrongs.map((c) => c.definition)].sort(() => Math.random() - 0.5),
            findCorrect: (opts: string[]) => opts.indexOf(card.definition),
            explanation: `${card.term}: ${card.definition}`,
          }),
          // Type 2: Definition -> pick correct Term
          (card: typeof sourceCards[0], wrongs: typeof sourceCards) => ({
            question: `Which term matches this definition?\n"${card.definition}"`,
            options: [card.term, ...wrongs.map((c) => c.term)].sort(() => Math.random() - 0.5),
            findCorrect: (opts: string[]) => opts.indexOf(card.term),
            explanation: `The answer is: ${card.term}`,
          }),
          // Type 3: True/False style - is this definition correct for this term?
          (card: typeof sourceCards[0], wrongs: typeof sourceCards) => {
            const isTrue = Math.random() > 0.5;
            const shownDef = isTrue ? card.definition : wrongs[0].definition;
            return {
              question: `True or False: "${card.term}" is defined as:\n"${shownDef}"`,
              options: ['True', 'False'],
              findCorrect: (opts: string[]) => opts.indexOf(isTrue ? 'True' : 'False'),
              explanation: isTrue
                ? `Correct! ${card.term}: ${card.definition}`
                : `False. The correct definition of "${card.term}" is: ${card.definition}`,
            };
          },
          // Type 4: Fill the blank - which term completes the sentence?
          (card: typeof sourceCards[0], wrongs: typeof sourceCards) => ({
            question: `Complete: "______" refers to ${card.definition}`,
            options: [card.term, ...wrongs.map((c) => c.term)].sort(() => Math.random() - 0.5),
            findCorrect: (opts: string[]) => opts.indexOf(card.term),
            explanation: `${card.term}: ${card.definition}`,
          }),
        ];

        const questions = selected.map((card, i) => {
          const wrongCards = sourceCards
            .filter((c) => c.id !== card.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const typeIndex = i % questionTypes.length;
          const generator = questionTypes[typeIndex];
          const generated = generator(card, wrongCards);
          const correctIndex = generated.findCorrect(generated.options);

          return {
            id: `q_${i}`,
            type: 'multiple_choice' as const,
            question: generated.question,
            options: generated.options,
            correctIndex,
            explanation: generated.explanation,
            chapter: card.chapter,
            difficulty: (['basic', 'intermediate', 'advanced'] as const)[Math.min(typeIndex, 2)],
          };
        });

        set({
          quizSession: {
            questions,
            currentIndex: 0,
            answers: new Array(questions.length).fill(null),
            score: 0,
            startedAt: Date.now(),
            chapter,
          },
          viewMode: 'quiz',
        });
      },

      answerQuiz: (answerIndex) => {
        const session = get().quizSession;
        if (!session) return;
        const newAnswers = [...session.answers];
        newAnswers[session.currentIndex] = answerIndex;
        const isCorrect =
          answerIndex === session.questions[session.currentIndex]?.correctIndex;
        set({
          quizSession: {
            ...session,
            answers: newAnswers,
            score: session.score + (isCorrect ? 1 : 0),
          },
        });
      },

      nextQuestion: () => {
        const session = get().quizSession;
        if (!session) return;
        if (session.currentIndex < session.questions.length - 1) {
          set({
            quizSession: { ...session, currentIndex: session.currentIndex + 1 },
          });
        }
      },

      endQuiz: () => {
        const session = get().quizSession;
        if (session) {
          set({
            quizSession: { ...session, completedAt: Date.now() },
            viewMode: 'explore',
          });
        }
      },

      flashcardSession: null,
      startFlashcards: (chapter) => {
        const allCards = chapter
          ? chapters.find((c) => c.chapter === chapter)?.cards ?? []
          : chapters.flatMap((c) => c.cards);

        const shuffled = [...allCards];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        set({
          flashcardSession: {
            cards: shuffled,
            currentIndex: 0,
            isFlipped: false,
            knownIds: new Set(),
            chapter,
          },
          viewMode: 'flashcards',
        });
      },

      flipCard: () => {
        const session = get().flashcardSession;
        if (session) {
          set({
            flashcardSession: { ...session, isFlipped: !session.isFlipped },
          });
        }
      },

      nextCard: () => {
        const session = get().flashcardSession;
        if (session && session.currentIndex < session.cards.length - 1) {
          set({
            flashcardSession: {
              ...session,
              currentIndex: session.currentIndex + 1,
              isFlipped: false,
            },
          });
        }
      },

      prevCard: () => {
        const session = get().flashcardSession;
        if (session && session.currentIndex > 0) {
          set({
            flashcardSession: {
              ...session,
              currentIndex: session.currentIndex - 1,
              isFlipped: false,
            },
          });
        }
      },

      markCardKnown: (cardId) => {
        const session = get().flashcardSession;
        if (session) {
          const newKnown = new Set(session.knownIds);
          if (newKnown.has(cardId)) {
            newKnown.delete(cardId);
          } else {
            newKnown.add(cardId);
          }
          set({
            flashcardSession: { ...session, knownIds: newKnown },
          });
        }
      },

      endFlashcards: () => {
        set({ flashcardSession: null, viewMode: 'explore' });
      },

      isAutoRotating: true,
      toggleAutoRotate: () => set({ isAutoRotating: !get().isAutoRotating }),
      brainOpacity: 0.85,
      setBrainOpacity: (val) => set({ brainOpacity: val }),

      searchQuery: '',
      setSearchQuery: (q) => {
        const lower = q.toLowerCase();
        const results = q.length < 2
          ? []
          : chapters
              .flatMap((c) => c.cards)
              .filter(
                (card) =>
                  card.term.toLowerCase().includes(lower) ||
                  card.definition.toLowerCase().includes(lower)
              )
              .slice(0, 20);
        set({ searchQuery: q, searchResults: results });
      },
      searchResults: [],
    }),
    { name: 'BrainStore' }
  )
);

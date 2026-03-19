import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ViewMode, LesionState, CognitiveDomain,
  HoverInfo, ChapterData, QuizSession, FlashcardSession, Flashcard
} from '../types/brain.types';
import { chapters } from '../data/flashcardData';
import { brainRegions } from '../data/brainRegions';
import { cognitiveDomains } from '../data/cognitiveDomains';

interface BrainStoreState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedRegionId: string | null;
  hoveredRegionId: string | null;
  hoverInfo: HoverInfo | null;
  selectRegion: (id: string | null) => void;
  setHoveredRegion: (id: string | null, info?: HoverInfo) => void;

  activeLesions: LesionState[];
  addLesion: (regionId: string, severity?: number) => void;
  removeLesion: (regionId: string) => void;
  updateLesionSeverity: (regionId: string, severity: number) => void;
  clearAllLesions: () => void;

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
      setViewMode: (mode) => set({ viewMode: mode }),

      selectedRegionId: null,
      hoveredRegionId: null,
      hoverInfo: null,
      selectRegion: (id) => set({ selectedRegionId: id }),
      setHoveredRegion: (id, info) => set({
        hoveredRegionId: id,
        hoverInfo: info ?? null,
      }),

      activeLesions: [],
      addLesion: (regionId, severity = 50) => {
        const { activeLesions } = get();
        if (activeLesions.find((l) => l.regionId === regionId)) return;
        const region = brainRegions.find((r) => r.id === regionId);
        if (!region) return;
        const effects: Record<string, number> = {};
        for (const [domain, maxDeficit] of Object.entries(region.lesionEffects)) {
          effects[domain] = Math.round((severity / 100) * maxDeficit);
        }
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
        const effects: Record<string, number> = {};
        for (const [domain, maxDeficit] of Object.entries(region.lesionEffects)) {
          effects[domain] = Math.round((severity / 100) * maxDeficit);
        }
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

        const questions = selected.map((card, i) => {
          const wrongCards = sourceCards
            .filter((c) => c.id !== card.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const options = [card.definition, ...wrongCards.map((c) => c.definition)]
            .sort(() => Math.random() - 0.5);

          const correctIndex = options.indexOf(card.definition);

          return {
            id: `q_${i}`,
            type: 'multiple_choice' as const,
            question: `What is the definition of "${card.term}"?`,
            options,
            correctIndex,
            explanation: card.definition,
            chapter: card.chapter,
            difficulty: 'basic' as const,
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

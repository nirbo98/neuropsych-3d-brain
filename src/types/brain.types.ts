// ── Core Data Types ─────────────────────────────────────────

/** A single flashcard from the Banich & Compton textbook */
export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  chapter: number;
  topic: string;
}

/** Complete data for one chapter of the textbook */
export interface ChapterData {
  chapter: number;
  topic: string;
  description: string;
  cards: Flashcard[];
  brainRegions: string[];
  color: string;
  icon: string;
}

/** A 3D brain region that can be selected and lesioned */
export interface BrainRegion {
  id: string;
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  chapters: number[];
  functions: string[];
  lesionEffects: Record<string, number>;
  clinicalNotes: string;
  color: string;
  brodmannAreas?: number[];
}

/** Tracks active lesion state on a brain region */
export interface LesionState {
  regionId: string;
  severity: number;
  effects: Record<string, number>;
}

/** Cognitive domains measured in the outcome dashboard */
export interface CognitiveDomain {
  id: string;
  name: string;
  icon: string;
  baselineScore: number;
  currentScore: number;
  description: string;
}

// ── UI State Types ──────────────────────────────────────────

export type ViewMode = 'explore' | 'lesion' | 'quiz' | 'flashcards';

export type PanelPosition = 'left' | 'right' | 'bottom' | 'hidden';

/** Quiz question generated from flashcard data */
export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'match_region';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapter: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  relatedRegion?: string;
}

/** Saved result of a completed quiz */
export interface QuizResult {
  chapter?: number;
  score: number;
  total: number;
  completedAt: number;
}

/** User's quiz session state */
export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  score: number;
  startedAt: number;
  completedAt?: number;
  chapter?: number;
}

/** Flashcard study session state */
export interface FlashcardSession {
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  knownIds: Set<string>;
  chapter?: number;
}

// ── Camera & 3D Types ───────────────────────────────────────

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface HoverInfo {
  regionId: string;
  regionName: string;
  screenPosition: { x: number; y: number };
}

import { useBrainStore } from '../../store/useBrainStore';

export default function FlashcardPanel() {
  const session = useBrainStore((s) => s.flashcardSession);
  const flipCard = useBrainStore((s) => s.flipCard);
  const nextCard = useBrainStore((s) => s.nextCard);
  const prevCard = useBrainStore((s) => s.prevCard);
  const markCardKnown = useBrainStore((s) => s.markCardKnown);
  const endFlashcards = useBrainStore((s) => s.endFlashcards);

  if (!session) return null;

  const { cards, currentIndex, isFlipped, knownIds } = session;
  const card = cards[currentIndex];
  const isKnown = knownIds.has(card.id);
  const knownCount = knownIds.size;
  const total = cards.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl mx-4 text-white animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-medium">
              Card {currentIndex + 1} of {total}
            </span>
            <span className="text-sm text-emerald-400 font-medium">
              Known: {knownCount}
            </span>
          </div>
          <button
            onClick={endFlashcards}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
            aria-label="End flashcards"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* Flashcard with 3D flip */}
        <div
          className="relative w-full cursor-pointer mb-6"
          style={{ perspective: '1200px' }}
          onClick={flipCard}
        >
          <div
            className="relative w-full transition-transform duration-500 ease-in-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '260px',
            }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-xs uppercase tracking-wider text-indigo-400 mb-3 font-medium">
                Term
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-center leading-snug">
                {card.term}
              </h2>
              <span className="text-xs text-gray-500 mt-4">
                Ch. {card.chapter} &middot; {card.topic}
              </span>
              <span className="text-xs text-gray-600 mt-3">Click to flip</span>
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <span className="text-xs uppercase tracking-wider text-emerald-400 mb-3 font-medium">
                Definition
              </span>
              <p className="text-base sm:text-lg text-gray-200 text-center leading-relaxed max-h-40 overflow-y-auto">
                {card.definition}
              </p>
              <span className="text-xs text-gray-500 mt-4">
                Ch. {card.chapter} &middot; {card.topic}
              </span>
              <span className="text-xs text-gray-600 mt-3">Click to flip back</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prevCard}
            disabled={isFirst}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              isFirst
                ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Prev
          </button>

          <button
            onClick={() => markCardKnown(card.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              isKnown
                ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {isKnown ? 'Known' : 'Mark Known'}
          </button>

          <button
            onClick={nextCard}
            disabled={isLast}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              isLast
                ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

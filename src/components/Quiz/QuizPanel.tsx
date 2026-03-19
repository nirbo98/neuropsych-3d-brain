import { useBrainStore } from '../../store/useBrainStore';

export default function QuizPanel() {
  const session = useBrainStore((s) => s.quizSession);
  const answerQuiz = useBrainStore((s) => s.answerQuiz);
  const nextQuestion = useBrainStore((s) => s.nextQuestion);
  const endQuiz = useBrainStore((s) => s.endQuiz);
  const startQuiz = useBrainStore((s) => s.startQuiz);

  if (!session) return null;

  const { questions, currentIndex, answers, score } = session;
  const total = questions.length;
  const currentAnswer = answers[currentIndex];
  const hasAnswered = currentAnswer !== null;
  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === total - 1;
  const allAnswered = answers.every((a) => a !== null);
  const progressPct = ((currentIndex + 1) / total) * 100;
  const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;

  // Summary screen
  if (allAnswered && hasAnswered && isLastQuestion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8 text-white animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete</h2>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={scorePct >= 70 ? '#34d399' : scorePct >= 40 ? '#fbbf24' : '#f87171'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(scorePct / 100) * 327} 327`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{scorePct}%</span>
              </div>
            </div>
            <p className="text-gray-300 text-lg">
              {score} / {total} correct
            </p>
            <p className="text-sm text-gray-400">
              {scorePct >= 90
                ? 'Outstanding! You really know this material.'
                : scorePct >= 70
                  ? 'Great job! Keep reviewing to reach mastery.'
                  : scorePct >= 40
                    ? 'Good effort. Review the missed topics and try again.'
                    : 'Keep studying — you\'ll get there!'}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(session.chapter)}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition-colors"
            >
              Retry
            </button>
            <button
              onClick={endQuiz}
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 font-medium transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-white animate-fade-in">
        {/* Header: progress + close */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-gray-400 font-medium">
            Question {currentIndex + 1} of {total}
          </span>
          <button
            onClick={endQuiz}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
            aria-label="End quiz"
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
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question */}
        <h3 className="text-lg sm:text-xl font-semibold mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isSelected = currentAnswer === idx;

            let btnClass =
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ';

            if (!hasAnswered) {
              btnClass +=
                'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer';
            } else if (isCorrect) {
              btnClass += 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300';
            } else if (isSelected && !isCorrect) {
              btnClass += 'border-red-500/50 bg-red-500/15 text-red-300';
            } else {
              btnClass += 'border-white/5 bg-white/[0.02] text-gray-500';
            }

            return (
              <button
                key={idx}
                onClick={() => !hasAnswered && answerQuiz(idx)}
                disabled={hasAnswered}
                className={btnClass}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        {hasAnswered && (
          <div className="animate-fade-in">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="font-semibold text-indigo-400">Explanation: </span>
                {currentQ.explanation}
              </p>
            </div>

            {!isLastQuestion ? (
              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={() => {
                  /* Stay on this screen; the allAnswered check above will show summary */
                  /* Force re-render by calling nextQuestion (won't advance past last) */
                  nextQuestion();
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium transition-colors"
              >
                View Results
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

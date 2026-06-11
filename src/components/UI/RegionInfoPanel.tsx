import { useBrainStore } from '../../store/useBrainStore';
import { getRegionById } from '../../data/brainRegions';
import { slidesByRegion } from '../../data/lectures';

export default function RegionInfoPanel() {
  const {
    selectedRegionId,
    selectRegion,
    viewMode,
    activeLesions,
    addLesion,
    removeLesion,
    updateLesionSeverity,
    setSelectedChapter,
    chapters,
    domains,
    guessDomains,
    guessRevealed,
    toggleGuessDomain,
    revealGuess,
    resetGuess,
  } = useBrainStore();

  if (!selectedRegionId) return null;

  const region = getRegionById(selectedRegionId);
  if (!region) return null;

  const lesion = activeLesions.find((l) => l.regionId === selectedRegionId);
  const isLesioned = !!lesion;
  const revealed = isLesioned || guessRevealed;

  const domainName = (id: string) => domains.find((d) => d.id === id)?.name ?? id;
  // The region's largest baseline deficits = the "real" answer to the guess.
  const topActualDomains = Object.entries(region.lesionEffects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);
  const feedbackSlides = slidesByRegion(selectedRegionId);

  const startGuessed = () => {
    addLesion(selectedRegionId);
    revealGuess();
  };
  const clearLesion = () => {
    removeLesion(selectedRegionId);
    resetGuess();
  };

  return (
    <div
      className="fixed right-3 top-[68px] bottom-3 z-40 flex flex-col glass-panel overflow-hidden animate-slide-up"
      style={{ width: 320 }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: region.color, boxShadow: `0 0 8px ${region.color}60` }}
          />
          <h2 className="text-base font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            {region.name}
          </h2>
        </div>
        <button
          onClick={() => selectRegion(null)}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Functions */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Functions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {region.functions.map((fn) => (
              <span
                key={fn}
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  background: `${region.color}18`,
                  color: region.color,
                  border: `1px solid ${region.color}30`,
                }}
              >
                {fn}
              </span>
            ))}
          </div>
        </section>

        {/* Clinical Notes */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Clinical Notes
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {region.clinicalNotes}
          </p>
        </section>

        {/* Associated Chapters */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Chapters
          </h3>
          <div className="flex flex-col gap-1">
            {region.chapters.map((chNum) => {
              const ch = chapters.find((c) => c.chapter === chNum);
              if (!ch) return null;
              return (
                <button
                  key={chNum}
                  onClick={() => setSelectedChapter(chNum)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span className="text-sm">{ch.icon}</span>
                  <span className="text-sm">
                    <span className="font-semibold" style={{ color: ch.color }}>Ch. {chNum}</span>
                    {' '}&mdash; {ch.topic}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Brodmann areas */}
        {region.brodmannAreas && region.brodmannAreas.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Brodmann Areas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {region.brodmannAreas.map((ba) => (
                <span
                  key={ba}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}
                >
                  BA {ba}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Lesion controls (only in lesion mode) */}
        {viewMode === 'lesion' && (
          <section
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Lesion Simulation
            </h3>

            {!revealed ? (
              /* Phase A — predict the deficit before revealing */
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Which domains do you expect this lesion to impair? Pick, then reveal.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {domains.map((d) => {
                    const picked = guessDomains.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        onClick={() => toggleGuessDomain(d.id)}
                        className="px-2 py-1 rounded-md text-xs font-medium transition-colors"
                        style={{
                          background: picked ? `${region.color}22` : 'rgba(255,255,255,0.04)',
                          color: picked ? region.color : 'var(--color-text-secondary)',
                          border: picked ? `1px solid ${region.color}55` : '1px solid var(--glass-border)',
                        }}
                      >
                        {d.icon} {d.name}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={startGuessed}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    color: 'var(--color-danger)',
                    border: '1px solid rgba(239,68,68,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)';
                  }}
                >
                  {guessDomains.length > 0 ? 'Reveal deficit' : 'Add lesion'}
                </button>
                {guessDomains.length === 0 && (
                  <p className="text-[10px] text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Skip the guess and add the lesion directly.
                  </p>
                )}
              </div>
            ) : (
              /* Phase B — revealed: severity + feedback */
              <div className="flex flex-col gap-3">
                {lesion && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          Severity
                        </span>
                        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-danger)' }}>
                          {lesion.severity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={lesion.severity}
                        onChange={(e) => updateLesionSeverity(selectedRegionId, parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--color-danger) ${lesion.severity}%, rgba(255,255,255,0.1) ${lesion.severity}%)`,
                        }}
                      />
                    </div>
                    <button
                      onClick={clearLesion}
                      className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        color: 'var(--color-danger)',
                        border: '1px solid rgba(239,68,68,0.25)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)';
                      }}
                    >
                      Remove Lesion
                    </button>
                  </>
                )}

                {/* Prediction vs. actual top deficits */}
                {guessDomains.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      Your prediction
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {guessDomains.map((id) => {
                        const hit = topActualDomains.includes(id);
                        return (
                          <span
                            key={id}
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: hit ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
                              color: hit ? 'var(--color-success)' : 'var(--color-danger)',
                              border: `1px solid ${hit ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.3)'}`,
                            }}
                          >
                            {hit ? '✓' : '✗'} {domainName(id)}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      Most affected (actual)
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {topActualDomains.map(domainName).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Lecturer feedback — original slide wording + figure, after reveal */}
        {viewMode === 'lesion' && revealed && feedbackSlides.length > 0 && (
          <section
            className="rounded-xl p-3 animate-fade-in"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
              From the Lecture
            </h3>
            <div className="flex flex-col gap-4">
              {feedbackSlides.map(({ slide, lectureTitle }) => (
                <div key={`${lectureTitle}-${slide.id}`} className="flex flex-col gap-2">
                  {slide.image && (
                    <img
                      src={import.meta.env.BASE_URL + slide.image}
                      alt={`${lectureTitle}, slide ${slide.index}`}
                      className="w-full rounded-lg"
                      style={{ border: '1px solid var(--glass-border)' }}
                      loading="lazy"
                    />
                  )}
                  {slide.text && (
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>
                      {slide.text}
                    </p>
                  )}
                  <span className="text-[10px] italic" style={{ color: 'var(--color-text-muted)' }}>
                    — {lectureTitle}, slide {slide.index}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

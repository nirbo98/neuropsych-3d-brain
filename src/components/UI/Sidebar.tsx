import { useBrainStore } from '../../store/useBrainStore';

export default function Sidebar() {
  const {
    chapters,
    selectedChapter,
    setSelectedChapter,
    brainOpacity,
    setBrainOpacity,
    isAutoRotating,
    toggleAutoRotate,
  } = useBrainStore();

  return (
    <aside
      className="fixed left-3 top-[68px] bottom-3 z-40 flex flex-col glass-panel overflow-hidden"
      style={{ width: 280 }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          Chapters
        </h2>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {chapters.map((ch) => {
          const isActive = selectedChapter === ch.chapter;
          return (
            <button
              key={ch.chapter}
              onClick={() => setSelectedChapter(isActive ? null : ch.chapter)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-all duration-200"
              style={{
                background: isActive ? `${ch.color}18` : 'transparent',
                border: isActive ? `1px solid ${ch.color}40` : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {/* Icon */}
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: `${ch.color}20` }}
              >
                {ch.icon}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold"
                    style={{ color: isActive ? ch.color : 'var(--color-text-muted)' }}
                  >
                    {ch.chapter}
                  </span>
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  >
                    {ch.topic}
                  </span>
                </div>
              </div>

              {/* Card count badge */}
              <span
                className="shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{
                  background: isActive ? `${ch.color}30` : 'rgba(255,255,255,0.06)',
                  color: isActive ? ch.color : 'var(--color-text-muted)',
                }}
              >
                {ch.cards.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div
        className="shrink-0 px-4 py-3 flex flex-col gap-3"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        {/* Opacity slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Brain Opacity
            </label>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {Math.round(brainOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={brainOpacity}
            onChange={(e) => setBrainOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-accent) ${brainOpacity * 100}%, rgba(255,255,255,0.1) ${brainOpacity * 100}%)`,
            }}
          />
        </div>

        {/* Auto-rotate toggle */}
        <button
          onClick={toggleAutoRotate}
          className="flex items-center justify-between py-1.5 transition-colors"
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Auto Rotate
          </span>
          <div
            className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all duration-200"
            style={{
              background: isAutoRotating ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full transition-transform duration-200"
              style={{
                background: '#fff',
                transform: isAutoRotating ? 'translateX(16px)' : 'translateX(0)',
              }}
            />
          </div>
        </button>
      </div>
    </aside>
  );
}

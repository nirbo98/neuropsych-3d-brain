import { useBrainStore } from '../../store/useBrainStore';
import { getRegionById } from '../../data/brainRegions';
import {
  hemisphereProfiles,
  autismOverview,
  type AutismFeature,
  type AutismOverviewItem,
} from '../../data/autismData';
import type { Hemisphere } from '../../types/brain.types';

const HEMISPHERES: Hemisphere[] = ['left', 'right'];

/** Are these exactly the region ids currently glowing in the 3D scene? */
function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
}

export default function HemispherePanel() {
  const selectedHemisphere = useBrainStore((s) => s.selectedHemisphere);
  const selectHemisphere = useBrainStore((s) => s.selectHemisphere);
  const highlightedRegionIds = useBrainStore((s) => s.highlightedRegionIds);
  const setHighlightedRegions = useBrainStore((s) => s.setHighlightedRegions);

  const profile = selectedHemisphere ? hemisphereProfiles[selectedHemisphere] : null;

  const renderCard = (item: AutismFeature | AutismOverviewItem, accent: string) => {
    const live = sameSet(highlightedRegionIds, item.regionIds);
    const regionNames = item.regionIds
      .map((id) => getRegionById(id)?.name)
      .filter(Boolean) as string[];

    return (
      <div
        key={item.id}
        className="rounded-xl p-3 flex flex-col gap-2"
        style={{
          background: live ? 'rgba(34,211,238,0.10)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${live ? 'rgba(34,211,238,0.45)' : 'var(--glass-border)'}`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            {item.title}
          </h4>
          <button
            onClick={() => setHighlightedRegions(live ? [] : item.regionIds)}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors"
            style={{
              background: live ? '#22d3ee' : 'rgba(34,211,238,0.12)',
              color: live ? '#06283d' : '#22d3ee',
              border: '1px solid rgba(34,211,238,0.4)',
            }}
          >
            {live ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#06283d' }} />
                Live
              </>
            ) : (
              <>▶ Show in 3D</>
            )}
          </button>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {item.description}
        </p>
        {regionNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {regionNames.map((name) => (
              <span
                key={name}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed right-3 top-[68px] bottom-3 z-40 flex flex-col glass-panel overflow-hidden animate-slide-up"
      style={{ width: 340 }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-4 pt-4 pb-3"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <h2 className="text-base font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
          Hemispheres &amp; Autism
        </h2>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Pick a hemisphere — on the brain or below — then tap “Show in 3D” to light up the regions a feature involves.
        </p>

        {/* Hemisphere tabs */}
        <div className="flex gap-2 mt-3">
          {HEMISPHERES.map((h) => {
            const p = hemisphereProfiles[h];
            const active = selectedHemisphere === h;
            return (
              <button
                key={h}
                onClick={() => selectHemisphere(active ? null : h)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: active ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                  color: active ? p.color : 'var(--color-text-secondary)',
                  border: `1px solid ${active ? `${p.color}66` : 'var(--glass-border)'}`,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {profile ? (
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: profile.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: profile.color }}>
                {profile.tagline}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {profile.summary}
            </p>
            <div className="flex flex-col gap-2 mt-1">
              {profile.features.map((f) => renderCard(f, profile.color))}
            </div>
          </section>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Select the <span style={{ color: hemisphereProfiles.left.color }}>left</span> or{' '}
            <span style={{ color: hemisphereProfiles.right.color }}>right</span> hemisphere above (or click a half of
            the brain) to see how it relates to autism.
          </p>
        )}

        {/* Whole-brain overview — beyond left vs right */}
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Beyond left vs right
          </h3>
          <p className="text-xs leading-relaxed italic" style={{ color: 'var(--color-text-muted)' }}>
            {autismOverview.disclaimer}
          </p>
          <div className="flex flex-col gap-2 mt-1">
            {autismOverview.items.map((item) => renderCard(item, '#a78bfa'))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useBrainStore } from '../../store/useBrainStore';

export default function RegionLabel() {
  const hoveredRegionId = useBrainStore((s) => s.hoveredRegionId);
  const hoverInfo = useBrainStore((s) => s.hoverInfo);

  if (!hoveredRegionId || !hoverInfo) return null;

  return (
    <div
      className="glass-panel-sm"
      style={{
        position: 'absolute',
        left: hoverInfo.screenPosition.x + 12,
        top: hoverInfo.screenPosition.y - 28,
        pointerEvents: 'none',
        zIndex: 50,
        padding: '6px 12px',
        fontSize: '0.8rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        color: '#e2e8f0',
      }}
    >
      {hoverInfo.regionName}
    </div>
  );
}

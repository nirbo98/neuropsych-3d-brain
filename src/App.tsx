import BrainCanvas from './components/Brain3D/BrainCanvas';
import TopBar from './components/UI/TopBar';
import Sidebar from './components/UI/Sidebar';
import RegionInfoPanel from './components/UI/RegionInfoPanel';
import CognitiveDashboard from './components/UI/CognitiveDashboard';
import QuizPanel from './components/Quiz/QuizPanel';
import FlashcardPanel from './components/Flashcards/FlashcardPanel';
import { useBrainStore } from './store/useBrainStore';

export default function App() {
  const viewMode = useBrainStore((s) => s.viewMode);
  const selectedRegionId = useBrainStore((s) => s.selectedRegionId);
  const quizSession = useBrainStore((s) => s.quizSession);
  const flashcardSession = useBrainStore((s) => s.flashcardSession);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      <TopBar />

      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '56px' }}>
        <Sidebar />

        <div className="flex-1 relative overflow-hidden">
          <BrainCanvas />

          {viewMode === 'quiz' && quizSession && <QuizPanel />}
          {viewMode === 'flashcards' && flashcardSession && <FlashcardPanel />}
        </div>

        {selectedRegionId && <RegionInfoPanel />}
      </div>

      {viewMode === 'lesion' && <CognitiveDashboard />}
    </div>
  );
}

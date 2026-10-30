import { useMapContext } from '../../context/MapContext';
import ColonyInsightsSheet from './knowyourplace/ColonyInsightsSheet';
import PlotIntelligenceSheet from './knowyourplace/PlotIntelligenceSheet';

export default function KnowYourPlacePanel() {
  const { exploreMode, placeSubMode } = useMapContext();

  if (exploreMode !== 'place') return null;

  return (
    <>
      {placeSubMode === 'colony' && <ColonyInsightsSheet />}
      {placeSubMode === 'plot' && <PlotIntelligenceSheet />}
    </>
  );
}


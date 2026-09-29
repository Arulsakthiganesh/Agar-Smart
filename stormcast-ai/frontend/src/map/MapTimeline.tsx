import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export type TimeStep = '-30m' | '-15m' | 'NOW' | '+15m' | '+30m' | '+45m' | '+60m';

interface MapTimelineProps {
  currentStep: TimeStep;
  onStepChange: (step: TimeStep) => void;
}

const STEPS: { id: TimeStep; label: string; isForecast: boolean }[] = [
  { id: '-30m', label: '-30 MIN', isForecast: false },
  { id: '-15m', label: '-15 MIN', isForecast: false },
  { id: 'NOW', label: 'NOWCAST (0m)', isForecast: false },
  { id: '+15m', label: '+15 MIN', isForecast: true },
  { id: '+30m', label: '+30 MIN', isForecast: true },
  { id: '+45m', label: '+45 MIN', isForecast: true },
  { id: '+60m', label: '+60 MIN', isForecast: true },
];

export const MapTimeline: React.FC<MapTimelineProps> = ({ currentStep, onStepChange }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;

    if (isPlaying) {
      timer = setInterval(() => {
        const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
        const nextIndex = (currentIndex + 1) % STEPS.length;
        onStepChange(STEPS[nextIndex].id);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, onStepChange]);

  const activeStepObj = STEPS.find((s) => s.id === currentStep) || STEPS[2];

  return (
    <div className="bg-[#0D111D]/95 backdrop-blur border border-[#1F2937] p-3 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 text-xs shadow-lg transition-all"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY TIMELINE'}</span>
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange('NOW');
          }}
          className="p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-300 hover:text-white text-xs flex items-center gap-1"
          title="Reset to Current Nowcast"
        >
          <RotateCcw size={14} />
          <span>RESET</span>
        </button>
      </div>

      {/* Scrubbable Step Pills */}
      <div className="flex-1 flex items-center justify-between gap-1 w-full overflow-x-auto py-1">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold tracking-wider transition-all border ${
                isActive
                  ? step.isForecast
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg'
                    : 'bg-blue-600 text-white border-blue-400 shadow-lg'
                  : step.isForecast
                  ? 'bg-[#111827]/60 text-amber-400/70 border-[#1F2937] border-dashed hover:border-amber-500/50'
                  : 'bg-[#111827] text-gray-400 border-[#1F2937] hover:text-gray-200'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Status Mode Indicator */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#111827] border border-[#1F2937] text-[11px] font-mono whitespace-nowrap">
        <Clock size={14} className={activeStepObj.isForecast ? 'text-amber-400' : 'text-blue-400'} />
        <span className="text-gray-400">DATA:</span>
        <span className={activeStepObj.isForecast ? 'text-amber-400 font-bold' : 'text-blue-400 font-bold'}>
          {activeStepObj.isForecast ? 'PREDICTED FORECAST' : 'OBSERVED RADAR/SAT'}
        </span>
      </div>
    </div>
  );
};

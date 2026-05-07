import React, { useState } from 'react';
import { ExerciseType } from '../types';
import { PRESET_WORKSHEETS } from '../data/worksheets';
import { Button } from './Button';
import { WorksheetPaper } from './WorksheetPaper';
import { BookOpen, PenTool, FileText, ExternalLink, X } from 'lucide-react';

interface ExerciseZoneProps {
  type: ExerciseType;
}

export const ExerciseZone: React.FC<ExerciseZoneProps> = ({ type }) => {
  // Worksheet Overlay State
  const [activeWorksheetTitle, setActiveWorksheetTitle] = useState<string | null>(null);

  const openWorksheet = (title: string) => {
      setActiveWorksheetTitle(title);
  };

  if (activeWorksheetTitle) {
    const ws = PRESET_WORKSHEETS.find(w => w.title === activeWorksheetTitle);
    return (
        <div className="fixed inset-0 z-50 bg-slate-200 overflow-y-auto animate-fade-in">
            <div className="sticky top-0 z-50 p-4 flex justify-end no-print pointer-events-none">
                <Button 
                    onClick={() => setActiveWorksheetTitle(null)} 
                    className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white shadow-xl rounded-full px-6"
                >
                    <X className="mr-2 h-4 w-4" /> Close Worksheet
                </Button>
            </div>
            <div className="pb-20">
                {ws ? <WorksheetPaper worksheet={ws} /> : <div className="text-center p-20">Worksheet not found</div>}
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {type === ExerciseType.READING ? <BookOpen className="h-6 w-6 text-teal-500" /> : <PenTool className="h-6 w-6 text-indigo-500" />}
            {type === ExerciseType.READING ? 'Reading Comprehension' : 'Grammar Practice'}
          </h2>
          <p className="text-slate-500 mt-1">Select a worksheet to begin your practice session.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {PRESET_WORKSHEETS
            .filter(ws => {
                const wsTitle = ws.title.toLowerCase();
                return type === ExerciseType.READING ? wsTitle.includes('reading') : !wsTitle.includes('reading');
            })
            .map((ws) => {
              return (
                <div key={ws.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                        <div className={`w-12 h-12 transition-colors rounded-xl flex items-center justify-center mb-4 ${type === ExerciseType.READING ? 'bg-teal-50 text-teal-600 group-hover:bg-teal-100' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
                            {type === ExerciseType.READING ? <BookOpen className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{ws.title}</h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-3 whitespace-pre-line">{ws.content || "Practice questions."}</p>
                    </div>
                    <Button variant="outline" onClick={() => openWorksheet(ws.title)} className={`w-full justify-between ${type === ExerciseType.READING ? 'group-hover:border-teal-200 group-hover:text-teal-600' : 'group-hover:border-indigo-200 group-hover:text-indigo-600'}`}>
                        Open Sheet <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
              );
          })}
      </div>
    </div>
  );
};

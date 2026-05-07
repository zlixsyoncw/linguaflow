import React, { useState } from 'react';
import { ExerciseContent } from '../types';
import { gradeShortAnswers } from '../services/geminiService';
import { Button } from './Button';
import { Check, X, Printer, Loader2 } from 'lucide-react';

interface WorksheetPaperProps {
  worksheet: ExerciseContent;
}

export const WorksheetPaper: React.FC<WorksheetPaperProps> = ({ worksheet }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [grading, setGrading] = useState(false);
  const [shortAnswerResults, setShortAnswerResults] = useState<Record<number, {correct: boolean, feedback: string}>>({});
  const [score, setScore] = useState(0);

  const handleAnswerChange = (id: number, val: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    setGrading(true);
    try {
        let correctCount = 0;
        
        // Grade Multiple Choice
        worksheet.questions.forEach(q => {
            if (q.type !== 'short-answer' && answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        // Grade Short Answers via AI
        const shortAnswerQuestions = worksheet.questions.filter(q => q.type === 'short-answer');
        if (shortAnswerQuestions.length > 0) {
            const results = await gradeShortAnswers(worksheet.questions, answers);
            setShortAnswerResults(results);
            Object.values(results).forEach(r => {
                if (r.correct) correctCount++;
            });
        }
        
        setScore(correctCount);
        setSubmitted(true);
    } catch (error) {
        alert("Error grading worksheet. Please try again.");
    } finally {
        setGrading(false);
    }
  };

  const hasMultipleChoice = worksheet.questions.some(q => q.type !== 'short-answer');
  const hasShortAnswer = worksheet.questions.some(q => q.type === 'short-answer');

  // Check if content is long (likely a reading passage) to render it prominently
  const isReadingPassage = worksheet.content && worksheet.content.length > 50;

  return (
    <div className="min-h-screen bg-slate-200 p-8 font-serif overflow-auto">
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl p-12 min-h-[297mm] relative">
        {/* Paper Header */}
        <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">{worksheet.title}</h1>
                <div className="flex items-end gap-2">
                    <span className="text-slate-600 italic">Name:</span>
                    <div className="w-64 border-b border-black h-6"></div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                {submitted && (
                    <div className="text-4xl font-bold text-red-600 border-4 border-red-600 rounded-lg px-4 py-2 mt-2 rotate-[-5deg] inline-block opacity-90 mix-blend-multiply">
                        {score} / {worksheet.questions.length}
                    </div>
                )}
            </div>
        </div>

        {/* Reading Passage if applicable */}
        {isReadingPassage && (
            <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 tracking-widest">Reading Text</h3>
                <p className="text-lg leading-relaxed text-justify text-slate-900 font-serif">
                    {worksheet.content}
                </p>
            </div>
        )}

        {/* Worksheet Content */}
        <div className="space-y-8">
            {/* Multiple Choice Section */}
            {hasMultipleChoice && (
                <div>
                    <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">Multiple Choice</h2>
                    <div className="space-y-4">
                        {worksheet.questions.filter(q => q.type !== 'short-answer').map((q, i) => {
                            const isCorrect = submitted && answers[q.id] === q.correctAnswer;
                            const isWrong = submitted && answers[q.id] !== q.correctAnswer;
                            
                            return (
                                <div key={q.id} className="relative">
                                    <p className="font-medium mb-2">{i + 1}. {q.text}</p>
                                    <div className="pl-4 space-y-1">
                                        {q.options?.map((opt, optIndex) => {
                                            const letters = ['a', 'b', 'c', 'd'];
                                            const isSelected = answers[q.id] === opt;
                                            
                                            let labelClass = "flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded ";
                                            if (submitted) {
                                                if (opt === q.correctAnswer) labelClass += "bg-green-100 text-green-800 font-bold ";
                                                else if (isSelected) labelClass += "text-red-600 line-through decoration-2 ";
                                            }

                                            return (
                                                <label key={opt} className={labelClass}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q-${q.id}`} 
                                                        value={opt}
                                                        checked={isSelected}
                                                        onChange={() => handleAnswerChange(q.id, opt)}
                                                        disabled={submitted}
                                                        className="accent-black h-4 w-4"
                                                    />
                                                    <span className="font-medium mr-1">({letters[optIndex]})</span>
                                                    <span>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {submitted && isWrong && (
                                        <div className="absolute -left-8 top-0 text-red-600"><X size={24} strokeWidth={3} /></div>
                                    )}
                                    {submitted && isCorrect && (
                                        <div className="absolute -left-8 top-0 text-green-600"><Check size={24} strokeWidth={3} /></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Short Answer Section */}
            {hasShortAnswer && (
                <div>
                    <h2 className="text-lg font-bold mb-6 uppercase tracking-wide border-b border-gray-300 pb-1 mt-8">Questions</h2>
                    <div className="space-y-6">
                        {worksheet.questions.filter(q => q.type === 'short-answer').map((q, i) => {
                            const result = shortAnswerResults[q.id];
                            
                            return (
                                <div key={q.id} className="relative">
                                    <label className="block font-medium mb-2">{i + 1}. {q.text}</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            disabled={submitted}
                                            className="w-full border-b-2 border-slate-300 focus:border-black outline-none py-1 bg-transparent font-handwriting text-2xl text-blue-900 px-2"
                                            placeholder=""
                                        />
                                        {/* Visual underline extension */}
                                        <div className="h-px bg-slate-200 w-full mt-8"></div>
                                        <div className="h-px bg-slate-200 w-full mt-8"></div>
                                        
                                        {submitted && (
                                            <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                                {result?.correct ? (
                                                    <span className="text-green-600 font-bold flex items-center gap-1 text-base"><Check size={18}/> Correct</span>
                                                ) : (
                                                    <div className="text-red-600">
                                                        <span className="font-bold flex items-center gap-1 text-base"><X size={18}/> Incorrect</span>
                                                        <span className="italic block mt-1 text-slate-600 font-sans">Teacher Feedback: {result?.feedback}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="mt-16 flex justify-center gap-4 no-print">
            {!submitted ? (
                <Button onClick={handleSubmit} isLoading={grading} className="w-full max-w-xs h-12 text-lg bg-black text-white hover:bg-slate-800 shadow-xl">
                    {grading ? 'Grading...' : 'Submit Worksheet'}
                </Button>
            ) : (
                <Button onClick={() => window.print()} variant="outline" className="border-2 border-black text-black hover:bg-slate-100 font-bold">
                    <Printer className="mr-2 h-5 w-5" /> Print / Save PDF
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};
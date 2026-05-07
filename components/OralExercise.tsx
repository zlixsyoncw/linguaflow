import React, { useState, useRef, useEffect } from 'react';
import { getTutorClient, gradeOralSession } from '../services/geminiService';
import { createBlob, decodeAudioData } from '../services/audioUtils';
import { Button } from './Button';
import { OralGrade } from '../types';
import { Mic, MicOff, Activity, GraduationCap, CheckCircle, BarChart3, RefreshCcw } from 'lucide-react';
import { LiveServerMessage, Modality } from '@google/genai';

export const OralExercise: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Grading State
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<OralGrade | null>(null);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<Promise<any> | null>(null);
  const closeSessionRef = useRef<(() => void) | null>(null);

  // Refs for transcription
  const transcriptRef = useRef<{role: string, text: string}[]>([]);
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');

  const startSession = async () => {
    setError(null);
    setGradingResult(null);
    transcriptRef.current = [];
    currentInputRef.current = '';
    currentOutputRef.current = '';

    try {
      const client = getTutorClient();
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = client.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          // Enable transcription to capture conversation for grading
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are a friendly English conversation partner. Correct my pronunciation gently if needed, but focus on keeping the conversation flowing. Ask questions to help me practice.",
        },
        callbacks: {
            onopen: () => {
                console.log("Live session opened");
                setIsConnected(true);
                setupAudioInput(sessionPromise);
            },
            onmessage: async (msg: LiveServerMessage) => {
                // Handle Audio
                const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData && audioContextRef.current) {
                    await playAudioChunk(audioData);
                }

                // Handle Transcription
                if (msg.serverContent?.outputTranscription?.text) {
                    currentOutputRef.current += msg.serverContent.outputTranscription.text;
                }
                if (msg.serverContent?.inputTranscription?.text) {
                    currentInputRef.current += msg.serverContent.inputTranscription.text;
                }

                if (msg.serverContent?.turnComplete) {
                    // Turn complete implies an exchange happened
                    if (currentInputRef.current.trim()) {
                        transcriptRef.current.push({role: 'user', text: currentInputRef.current});
                        currentInputRef.current = '';
                    }
                    if (currentOutputRef.current.trim()) {
                        transcriptRef.current.push({role: 'model', text: currentOutputRef.current});
                        currentOutputRef.current = '';
                    }
                }
            },
            onclose: () => {
                console.log("Live session closed");
                setIsConnected(false);
                cleanup();
            },
            onerror: (err) => {
                console.error("Live session error", err);
                setError("Connection lost. Please try again.");
                setIsConnected(false);
                cleanup();
            }
        }
      });
      
      sessionRef.current = sessionPromise;

      sessionPromise.then(session => {
          closeSessionRef.current = () => session.close();
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start audio session");
      cleanup();
    }
  };

  const setupAudioInput = (sessionPromise: Promise<any>) => {
    if (!inputContextRef.current || !streamRef.current) return;

    const ctx = inputContextRef.current;
    const source = ctx.createMediaStreamSource(streamRef.current);
    const processor = ctx.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (isMuted) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      
      sessionPromise.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(processor);
    processor.connect(ctx.destination);
    
    sourceRef.current = source;
    processorRef.current = processor;
  };

  const playAudioChunk = async (base64Audio: string) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const arrayBuffer = await decodeAudioData(
        new Uint8Array(atob(base64Audio).split('').map(c => c.charCodeAt(0))),
        ctx,
        24000,
        1
    );

    const source = ctx.createBufferSource();
    source.buffer = arrayBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += arrayBuffer.duration;
  };

  const cleanup = () => {
    if (closeSessionRef.current) closeSessionRef.current();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (inputContextRef.current) inputContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();

    closeSessionRef.current = null;
    streamRef.current = null;
    sessionRef.current = null;
    setIsConnected(false);
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
  };

  const handleEndAndGrade = async () => {
    cleanup();
    setIsConnected(false);
    
    // Check if we have enough data
    const transcript = transcriptRef.current;
    // Capture any pending partials
    if (currentInputRef.current.trim()) transcript.push({role: 'user', text: currentInputRef.current});
    if (currentOutputRef.current.trim()) transcript.push({role: 'model', text: currentOutputRef.current});

    if (transcript.filter(t => t.role === 'user').length < 1) {
        setError("Not enough conversation data to grade. Please speak more next time.");
        return;
    }

    setIsGrading(true);
    try {
        const result = await gradeOralSession(transcript);
        setGradingResult(result);
    } catch (e) {
        console.error(e);
        setError("Failed to generate grade. Please try again.");
    } finally {
        setIsGrading(false);
    }
  };

  const reset = () => {
      setGradingResult(null);
      setError(null);
      setIsGrading(false);
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Grading View
  if (gradingResult) {
      return (
          <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-fade-in">
              <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                      <GraduationCap size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Assessment Complete!</h2>
                  <p className="text-slate-500">Here is your oral performance report</p>
              </div>

              <div className="flex justify-center mb-10">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-indigo-500 text-4xl font-bold text-indigo-700 shadow-lg shadow-indigo-200">
                      {gradingResult.score}
                      <span className="absolute top-6 right-2 text-sm text-slate-400 font-normal">/100</span>
                  </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <Activity size={18} className="text-blue-500"/> Fluency
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{gradingResult.fluency}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <CheckCircle size={18} className="text-green-500"/> Grammar
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{gradingResult.grammar}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <BarChart3 size={18} className="text-purple-500"/> Vocabulary
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{gradingResult.vocabulary}</p>
                  </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 mb-8">
                  <h3 className="font-bold text-yellow-800 mb-4">Areas for Improvement</h3>
                  <ul className="space-y-3">
                      {gradingResult.improvements?.map((imp, i) => (
                          <li key={i} className="flex items-start gap-3 text-yellow-900 text-sm">
                              <span className="bg-yellow-200 text-yellow-800 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i+1}</span>
                              {imp}
                          </li>
                      ))}
                  </ul>
              </div>

              <div className="flex justify-center">
                  <Button onClick={reset} className="px-8">
                      <RefreshCcw className="mr-2 h-4 w-4" /> Start New Session
                  </Button>
              </div>
          </div>
      );
  }

  // Active/Idle View
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-500 ${isConnected ? 'border-green-400 shadow-green-100' : 'border-slate-100'}`}>
        
        {/* Status Header */}
        <div className="bg-slate-50 p-6 text-center border-b border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-1">Live Conversation</h2>
           <p className="text-sm text-slate-500">Practice your speaking with Gemini</p>
        </div>

        {/* Visualizer Area */}
        <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 relative">
           {isGrading ? (
               <div className="flex flex-col items-center animate-pulse text-indigo-600">
                   <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                   <p className="font-medium">Analyzing your speech...</p>
               </div>
           ) : isConnected ? (
               <div className="flex items-center justify-center gap-2">
                   {/* Fake visualizer bars */}
                   {[...Array(5)].map((_, i) => (
                       <div key={i} className={`w-3 bg-indigo-500 rounded-full animate-pulse`} style={{ height: `${Math.random() * 40 + 20}px`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }}></div>
                   ))}
               </div>
           ) : (
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                   <MicOff size={32} />
               </div>
           )}
           
           {!isGrading && (
            <div className={`mt-8 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${isConnected ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                {isConnected ? 'Listening & Speaking' : 'Offline'}
            </div>
           )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-4">
             {isGrading ? (
                 <div className="col-span-2 text-center text-sm text-slate-400 py-3">Generating feedback...</div>
             ) : !isConnected ? (
                 <Button onClick={startSession} className="col-span-2 w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">
                     <Mic className="mr-2" /> Start Call
                 </Button>
             ) : (
                 <>
                    <Button onClick={toggleMute} variant={isMuted ? 'secondary' : 'outline'} className="justify-center">
                        {isMuted ? <MicOff /> : <Mic />}
                        {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                    <Button onClick={handleEndAndGrade} variant="primary" className="justify-center bg-red-500 hover:bg-red-600 border-red-500 text-white">
                        End & Grade
                    </Button>
                 </>
             )}
        </div>
        
        {error && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-6 text-center z-10">
                <div>
                    <div className="text-red-500 font-medium mb-4">{error}</div>
                    <Button onClick={() => setError(null)} variant="secondary" className="px-6">Dismiss</Button>
                </div>
            </div>
        )}
      </div>
      
      {!gradingResult && !isGrading && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex items-start gap-3 border border-blue-100">
            <Activity className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
                Have a natural conversation. When you're done, click "End & Grade" to receive an AI assessment of your English skills.
            </p>
        </div>
      )}
    </div>
  );
};
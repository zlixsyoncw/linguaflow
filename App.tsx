import React, { useState, useEffect } from 'react';
import { AuthForms } from './components/AuthForms';
import { ExerciseZone } from './components/ExerciseZone';
import { ChatTutor } from './components/ChatTutor';
import { OralExercise } from './components/OralExercise';
import { WorksheetPaper } from './components/WorksheetPaper';
import { User, ExerciseType } from './types';
import { getWorksheetById } from './data/worksheets';
import { GraduationCap, BookOpen, PenTool, MessageCircle, Mic, LogOut, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ExerciseType>(ExerciseType.TUTOR);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [worksheetId, setWorksheetId] = useState<number | null>(null);

  useEffect(() => {
    // Check for worksheet standalone mode
    const params = new URLSearchParams(window.location.search);
    const wsId = params.get('worksheetId');
    if (wsId) {
        setWorksheetId(Number(wsId));
        return;
    }

    const stored = localStorage.getItem('lingua_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Standalone Worksheet View
  if (worksheetId) {
      const worksheet = getWorksheetById(worksheetId);
      if (worksheet) {
          return <WorksheetPaper worksheet={worksheet} />;
      }
      return <div className="min-h-screen flex items-center justify-center text-slate-400">Worksheet not found.</div>;
  }

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('lingua_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lingua_user');
  };

  if (!user) {
    return <AuthForms onLogin={handleLogin} />;
  }

  const NavItem = ({ view, icon: Icon, label }: { view: ExerciseType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
         <div className="flex items-center gap-2 font-bold text-slate-800">
             <GraduationCap className="text-indigo-600" /> LinguaFlow
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-0 z-10 bg-white md:bg-transparent md:relative md:flex flex-col w-full md:w-64 border-r border-slate-200 
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:fixed md:w-64 h-full flex flex-col bg-white">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">LinguaFlow</h1>
          </div>

          <div className="space-y-2 flex-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Learning</p>
            <NavItem view={ExerciseType.TUTOR} icon={MessageCircle} label="AI Tutor Chat" />
            <NavItem view={ExerciseType.READING} icon={BookOpen} label="Reading" />
            <NavItem view={ExerciseType.GRAMMAR} icon={PenTool} label="Grammar" />
            <NavItem view={ExerciseType.ORAL} icon={Mic} label="Live Conversation" />
          </div>

          <div className="pt-6 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-3 px-4 mb-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                 {user.firstName[0]}{user.lastName[0]}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-semibold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                 <p className="text-xs text-slate-500 truncate">{user.email}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen md:ml-0">
        <div className="max-w-5xl mx-auto h-full">
          {currentView === ExerciseType.TUTOR && <ChatTutor />}
          {currentView === ExerciseType.READING && <ExerciseZone type={ExerciseType.READING} />}
          {currentView === ExerciseType.GRAMMAR && <ExerciseZone type={ExerciseType.GRAMMAR} />}
          {currentView === ExerciseType.ORAL && <OralExercise />}
        </div>
      </main>
    </div>
  );
};

export default App;
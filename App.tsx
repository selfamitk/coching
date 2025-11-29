import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './constants';
import { Subject, Topic, ContentType, UploadedResource, ResourceCategory } from './types';
import { generateStudyContent } from './services/geminiService';
import { MarkdownView } from './components/MarkdownView';
import { 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  GraduationCap, 
  Brain, 
  Clock, 
  Download, 
  Sparkles,
  Search,
  Book,
  Plus,
  Trash2,
  ExternalLink,
  Youtube,
  Link as LinkIcon,
  X,
  Save,
  MessageSquare,
  Image as ImageIcon,
  File,
  Upload,
  Lock,
  Unlock
} from 'lucide-react';

// --- Components ---

const Navbar = ({ onHome, isAdmin, onToggleAdmin }: { onHome: () => void, isAdmin: boolean, onToggleAdmin: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={onHome}>
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Foundation Wallah</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-indigo-600 hidden sm:block font-medium text-sm transition-colors">Resources</button>
          <button 
            onClick={onToggleAdmin}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                isAdmin 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
             {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
             {isAdmin ? 'Admin Mode' : 'Student View'}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4 text-white">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-xl">Foundation Wallah</span>
        </div>
        <p className="text-sm text-slate-400">
          Empowering students with AI-driven study materials and custom instructor resources.
          Learn smarter, not harder.
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Resources</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Class 10 Materials</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Class 12 Materials</a></li>
          <li><a href="#" className="hover:text-white transition-colors">PYQ Archives</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Legal</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} Foundation Wallah. All rights reserved.
    </div>
  </footer>
);

// Initial Mock Data
const MOCK_RESOURCES: UploadedResource[] = [
  {
    id: 'mock-1',
    classLevel: 'Class 10',
    subjectId: 'math',
    topicId: 'real-numbers',
    title: 'Important Theorems List',
    category: 'notes',
    content: '## Fundamental Theorem of Arithmetic\n\nEvery composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.\n\n## Euclid’s Division Lemma\n\nGiven positive integers **a** and **b**, there exist unique integers **q** and **r** satisfying `a = bq + r`, where `0 <= r < b`.',
    timestamp: Date.now()
  },
  {
    id: 'mock-2',
    classLevel: 'Class 10',
    subjectId: 'math',
    topicId: 'real-numbers',
    title: 'NCERT Official PDF',
    category: 'link',
    content: 'https://ncert.nic.in/textbook.php?jemh1=1-15',
    timestamp: Date.now()
  }
];

export default function App() {
  // Navigation State
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  
  // App Logic State
  const [isAdmin, setIsAdmin] = useState(false);

  // Resource Management State
  const [resources, setResources] = useState<UploadedResource[]>([]);
  const [activeResource, setActiveResource] = useState<UploadedResource | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // AI Content State
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [activeAiType, setActiveAiType] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load resources from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('edugenius_resources');
    if (saved) {
      try {
        setResources(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse resources", e);
        setResources(MOCK_RESOURCES);
      }
    } else {
      setResources(MOCK_RESOURCES);
    }
  }, []);

  // Save resources to LocalStorage
  useEffect(() => {
    localStorage.setItem('edugenius_resources', JSON.stringify(resources));
  }, [resources]);

  // Navigation Helpers
  const resetToHome = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setTopicSearchQuery("");
    resetContentView();
  };

  const resetToSubject = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setTopicSearchQuery("");
    resetContentView();
  };

  const resetToTopic = () => {
    setSelectedTopic(null);
    resetContentView();
  };

  const resetContentView = () => {
    setActiveAiType(null);
    setGeneratedContent("");
    setActiveResource(null);
    setError(null);
  };

  // Content Handlers
  const handleGenerateContent = async (type: ContentType) => {
    if (!selectedClass || !selectedSubject || !selectedTopic) return;
    
    console.log(`Generating ${type} for ${selectedTopic.name}`);

    // Switch to AI View
    setActiveResource(null);
    setActiveAiType(type);
    
    setLoading(true);
    setError(null);
    setGeneratedContent(""); 

    try {
      const result = await generateStudyContent(
        selectedClass,
        selectedSubject.name,
        selectedTopic.name,
        type
      );
      setGeneratedContent(result);
    } catch (e) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResource = (resource: UploadedResource) => {
    setActiveAiType(null);
    setGeneratedContent("");
    setActiveResource(resource);
  };

  const handleAddResource = (newResource: Omit<UploadedResource, 'id' | 'timestamp'>) => {
    const resource: UploadedResource = {
      ...newResource,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setResources(prev => [...prev, resource]);
    setIsUploadModalOpen(false);
    handleSelectResource(resource);
  };

  const handleDeleteResource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this resource?")) {
      setResources(prev => prev.filter(r => r.id !== id));
      if (activeResource?.id === id) {
        setActiveResource(null);
      }
    }
  };

  const handleDownload = async () => {
    if (activeResource) {
      let blob: Blob;
      let extension = 'txt';
      let mimeType = 'text/plain';

      // Determine Blob type and extension based on category
      if (activeResource.category === 'pdf') {
         try {
           const res = await fetch(activeResource.content);
           blob = await res.blob();
           extension = 'pdf';
           mimeType = 'application/pdf';
         } catch (e) {
           console.error("Download failed", e);
           return;
         }
      } else if (activeResource.category === 'image') {
         try {
           const res = await fetch(activeResource.content);
           blob = await res.blob();
           // Try to guess extension from existing base64 header or default to png
           const match = activeResource.content.match(/^data:image\/(\w+);base64,/);
           extension = match ? match[1] : 'png';
           mimeType = `image/${extension}`;
         } catch (e) {
           console.error("Download failed", e);
           return;
         }
      } else if (activeResource.category === 'link' || activeResource.category === 'video') {
         blob = new Blob([activeResource.content], { type: 'text/plain' });
         extension = 'url';
      } else {
         // Markdown/Text for notes, pyq, etc.
         blob = new Blob([activeResource.content], { type: 'text/markdown' });
         extension = 'md';
      }

      // Trigger download
      const url = window.URL.createObjectURL(blob!);
      const link = document.createElement('a');
      link.href = url;
      // Sanitize title for filename
      const safeTitle = activeResource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeTitle}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } else if (generatedContent && activeAiType) {
      // Download generated content as Markdown
      const blob = new Blob([generatedContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTopic = selectedTopic?.name.replace(/[^a-z0-9]/gi, '_') || 'study_material';
      link.download = `${safeTopic}_${activeAiType}_generated.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  // Filter resources for current view
  const currentTopicResources = resources.filter(r => 
    r.classLevel === selectedClass && 
    r.subjectId === selectedSubject?.id && 
    r.topicId === selectedTopic?.id
  );

  // --- Views ---

  // 1. Class Selection
  const ClassSelectionView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Select Your Class
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose your academic level to access custom study materials and AI-generated support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {Object.keys(CURRICULUM).map((cls) => (
          <div 
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-50 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls}</h3>
                  <p className="text-slate-500 text-sm mt-1">{CURRICULUM[cls].subjects.length} Subjects Available</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. Subject Selection
  const SubjectSelectionView = () => {
    const data = CURRICULUM[selectedClass!];
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button 
          onClick={resetToHome}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes
        </button>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedClass} <span className="text-slate-400 font-light">/</span> Subjects</h2>
        <p className="text-slate-600 mb-10">Select a subject to explore topics.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.subjects.map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setSelectedSubject(sub)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-300 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                 <Book className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{sub.name}</h3>
              <p className="text-xs text-slate-500">
                {CURRICULUM[selectedClass!].topics[sub.id]?.length || 0} Topics
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Topic Selection
  const TopicSelectionView = () => {
    const topics = CURRICULUM[selectedClass!].topics[selectedSubject!.id] || [];

    // Filter topics based on search query
    const filteredTopics = topics.filter(topic => 
      topic.name.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(topicSearchQuery.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button 
          onClick={resetToSubject}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subjects
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedSubject?.name} <span className="text-slate-400 font-light">/</span> Topics</h2>
            <p className="text-slate-600">Choose a chapter to view or upload materials.</p>
          </div>
          <div className="mt-4 md:mt-0 relative">
             <input 
               type="text" 
               placeholder="Search topics..." 
               value={topicSearchQuery}
               onChange={(e) => setTopicSearchQuery(e.target.value)}
               className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64" 
             />
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => {
              // Count resources for this topic
              const resCount = resources.filter(r => 
                r.classLevel === selectedClass && 
                r.subjectId === selectedSubject?.id && 
                r.topicId === topic.id
              ).length;

              return (
                <div 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="h-2 bg-indigo-500 w-0 group-hover:w-full transition-all duration-500"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{topic.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{topic.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium">
                        {resCount} Resource{resCount !== 1 ? 's' : ''}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No topics found</h3>
              <p className="text-slate-500 mt-1">We couldn't find any topics matching "{topicSearchQuery}"</p>
              <button 
                onClick={() => setTopicSearchQuery('')}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 4. Content View (Resources + AI)
  const ContentView = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button 
          onClick={resetToTopic}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Topics
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
             {/* Uploaded Resources Section */}
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">My Materials</h3>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsUploadModalOpen(true)}
                      className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                      title="Upload Resource"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 mb-2">
                  {currentTopicResources.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400">
                        {isAdmin ? 'No resources yet.' : 'No resources available.'}
                      </p>
                      {isAdmin && (
                        <button 
                           onClick={() => setIsUploadModalOpen(true)}
                           className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                        >
                          Upload One
                        </button>
                      )}
                    </div>
                  ) : (
                    currentTopicResources.map(res => (
                      <div 
                        key={res.id}
                        onClick={() => handleSelectResource(res)}
                        className={`group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer border transition-all ${activeResource?.id === res.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {res.category === 'notes' && <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                          {res.category === 'pyq' && <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />}
                          {(res.category === 'video' || res.category === 'link') && <ExternalLink className="h-4 w-4 text-purple-500 flex-shrink-0" />}
                          {res.category === 'pdf' && <File className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          {res.category === 'image' && <ImageIcon className="h-4 w-4 text-green-500 flex-shrink-0" />}
                          <span className={`truncate font-medium ${activeResource?.id === res.id ? 'text-indigo-900' : 'text-slate-700'}`}>{res.title}</span>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={(e) => handleDeleteResource(res.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
             </div>

             {/* AI Tools Section */}
             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">AI Assistant</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleGenerateContent('notes')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeAiType === 'notes' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    <FileText className="h-4 w-4" /> Generate Notes
                  </button>
                  <button 
                    onClick={() => handleGenerateContent('summary')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeAiType === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Brain className="h-4 w-4" /> Quick Summary
                  </button>
                  <button 
                    onClick={() => handleGenerateContent('pyq')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeAiType === 'pyq' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Clock className="h-4 w-4" /> Previous Year Qs
                  </button>
                  <button 
                    onClick={() => handleGenerateContent('quiz')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeAiType === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Sparkles className="h-4 w-4" /> Generate Quiz
                  </button>
                </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {(!activeAiType && !activeResource) ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm min-h-[500px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedTopic?.name}</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Select a resource from your library or ask the AI to generate new study materials.
                </p>
                <div className={`grid ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'} gap-4 text-left max-w-sm w-full`}>
                  {isAdmin && (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Plus size={16} className="text-indigo-500"/> Upload</h4>
                      <p className="text-xs text-slate-500">Add your own notes, links, or PDF references.</p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Sparkles size={16} className="text-indigo-500"/> Generate</h4>
                    <p className="text-xs text-slate-500">Create instant summaries, quizzes and PYQs.</p>
                  </div>
                </div>
              </div>
            ) : activeResource ? (
              // RESOURCE VIEW
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
                 <div className="border-b border-slate-100 p-6 flex justify-between items-start bg-slate-50/50">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${
                         activeResource.category === 'notes' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         activeResource.category === 'pyq' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                         activeResource.category === 'pdf' ? 'bg-red-50 text-red-700 border-red-200' :
                         activeResource.category === 'image' ? 'bg-green-50 text-green-700 border-green-200' :
                         'bg-purple-50 text-purple-700 border-purple-200'
                       }`}>
                         {activeResource.category}
                       </span>
                       <span className="text-xs text-slate-400">
                         {new Date(activeResource.timestamp).toLocaleDateString()}
                       </span>
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 leading-tight">{activeResource.title}</h2>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleDownload} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Download">
                        <Download className="h-5 w-5" />
                      </button>
                      {isAdmin && (
                        <button onClick={(e) => handleDeleteResource(activeResource.id, e)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete Resource">
                            <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                   </div>
                 </div>
                 <div className="p-8 flex-1">
                    {(activeResource.category === 'link' || activeResource.category === 'video') ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                        {activeResource.content.includes('youtube.com') || activeResource.content.includes('youtu.be') ? (
                           <Youtube className="h-16 w-16 text-red-500 mb-4" />
                        ) : (
                           <LinkIcon className="h-16 w-16 text-indigo-400 mb-4" />
                        )}
                        <h3 className="text-lg font-medium text-slate-900 mb-2">External Resource</h3>
                        <p className="text-slate-500 mb-6 text-center max-w-md truncate w-full px-4">{activeResource.content}</p>
                        <a 
                          href={activeResource.content} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          Open Link <ExternalLink size={16} />
                        </a>
                      </div>
                    ) : (activeResource.category === 'pdf') ? (
                      <div className="w-full h-[700px] bg-slate-100 rounded-lg border border-slate-200">
                         <iframe src={activeResource.content} className="w-full h-full rounded-lg" title="PDF Viewer" />
                      </div>
                    ) : (activeResource.category === 'image') ? (
                      <div className="flex justify-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                         <img src={activeResource.content} alt={activeResource.title} className="max-w-full h-auto rounded shadow-sm" />
                      </div>
                    ) : (
                      <MarkdownView content={activeResource.content} />
                    )}
                 </div>
              </div>
            ) : (
              // AI VIEW
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
                <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-indigo-50/30">
                  <h2 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    {activeAiType === 'pyq' ? 'AI Generated PYQs' : `AI ${activeAiType}`}
                  </h2>
                  <div className="flex gap-2">
                     {!loading && generatedContent && (
                       <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Download">
                         <Download className="h-5 w-5" />
                       </button>
                     )}
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto max-h-[800px]">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 font-medium">Consulting the AI Tutor...</p>
                      <p className="text-slate-400 text-sm mt-1">
                        {activeAiType === 'notes' ? `Drafting comprehensive notes for ${selectedTopic?.name}...` : 
                         activeAiType === 'pyq' ? `Retrieving and generating past questions for ${selectedTopic?.name}...` :
                         `Creating custom ${activeAiType} content...`}
                      </p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                       <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                         <X className="h-6 w-6 text-red-500" />
                       </div>
                       <p className="text-red-600 font-medium">{error}</p>
                       <button onClick={() => handleGenerateContent(activeAiType!)} className="mt-4 text-indigo-600 hover:underline">Try Again</button>
                    </div>
                  ) : (
                    <MarkdownView content={generatedContent} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 5. Upload Modal
  const UploadModal = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ResourceCategory>('notes');
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) return;
      
      handleAddResource({
        classLevel: selectedClass!,
        subjectId: selectedSubject!.id,
        topicId: selectedTopic!.id,
        title,
        category,
        content
      });
      setTitle('');
      setContent('');
      setFileName('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Limit file size to 5MB for LocalStorage safety
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please upload a smaller file.");
        e.target.value = '';
        return;
      }

      setFileName(file.name);
      
      // Auto-fill title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setContent(reader.result as string);
        }
      };
      
      if (category === 'notes' || category === 'pyq') {
        // For notes/pyq, try to read as text if it looks like text, else data URL
        // Actually simplest is just always use dataURL for PDF/Image and Text for Text
        // But for consistency let's assume notes are editable markdown text
        reader.readAsText(file);
      } else {
        // PDF and Images read as Data URL
        reader.readAsDataURL(file);
      }
    };

    if (!isUploadModalOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-lg text-slate-800">Upload Material</h3>
            <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1 Summary" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['notes', 'pyq', 'video', 'link', 'pdf', 'image'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                        setCategory(cat);
                        setContent('');
                        setFileName('');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                      category === cat 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {(category === 'video' || category === 'link') ? 'URL / Link' : 
                 (category === 'pdf' || category === 'image') ? 'Upload File' : 
                 'Content'}
              </label>

              {(category === 'video' || category === 'link') ? (
                 <input 
                  type="url" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com/resource" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  required
                />
              ) : (category === 'pdf' || category === 'image') ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
                    <input 
                        type="file" 
                        accept={category === 'pdf' ? '.pdf' : 'image/*'}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required={!content}
                    />
                    <div className="flex flex-col items-center justify-center text-slate-500">
                        {fileName ? (
                             <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                                <File size={16} /> {fileName}
                             </div>
                        ) : (
                            <>
                                <Upload size={24} className="mb-2" />
                                <span className="text-sm">Click to upload {category.toUpperCase()}</span>
                                <span className="text-xs text-slate-400 mt-1">Max size 5MB</span>
                            </>
                        )}
                    </div>
                </div>
              ) : (
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Enter your notes here (Markdown supported)..." 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm h-40 resize-none"
                  required
                />
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Add Resource
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onHome={resetToHome} isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />
      
      <main className="flex-grow">
        {!selectedClass && <ClassSelectionView />}
        {selectedClass && !selectedSubject && <SubjectSelectionView />}
        {selectedClass && selectedSubject && !selectedTopic && <TopicSelectionView />}
        {selectedClass && selectedSubject && selectedTopic && <ContentView />}
      </main>

      <UploadModal />
      <Footer />
    </div>
  );
}
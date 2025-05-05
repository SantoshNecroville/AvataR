'use client';

import { useState, useRef, useEffect, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Grid, List, Play, Pause, X } from 'lucide-react';

const AvatarGallery = () => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');
const [currentAudio, setCurrentAudio] = useState<string | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
const audioRef = useRef<HTMLAudioElement>(null);
const [viewMode, setViewMode] = useState('grid');
const [theme, setTheme] = useState('light');
const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    
    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem('theme') || 'light';
      setTheme(updatedTheme);
    };
    
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);
  
  const avatars = [
    { id: 'builder', name: 'Builder', src: '/avatars/builder.png', text: 'Visionary creator of worlds.', audio: '/audio/builder.mp3', category: 'Creator', description: 'The Builder constructs realities and reshapes landscapes with innovative vision and meticulous attention to detail.' },
    { id: 'guardian', name: 'Guardian', src: '/avatars/guardian.png', text: 'Protector of ancient secrets.', audio: '/audio/guardian.mp3', category: 'Defender', description: 'Standing vigilant, the Guardian safeguards knowledge and treasures from those who would misuse them.' },
    { id: 'hacker', name: 'Hacker', src: '/avatars/hacker.png', text: 'Master of digital realms.', audio: '/audio/hacker.mp3', category: 'Tech', description: 'With keystrokes as weapons, the Hacker navigates the complex networks of cyberspace.' },
    { id: 'knight', name: 'Knight', src: '/avatars/knight.png', text: 'Noble warrior of justice.', audio: '/audio/knight.mp3', category: 'Warrior', description: 'Clad in armor forged from honor, the Knight fights for those who cannot defend themselves.' },
    { id: 'mage', name: 'Mage', src: '/avatars/mage.png', text: 'Weaver of arcane magic.', audio: '/audio/mage.mp3', category: 'Magic', description: 'The Mage channels primordial energies to bend reality itself to their will.' },
    { id: 'queen', name: 'Queen', src: '/avatars/monk.png', text: 'Disciplined soul of balance.', audio: '/audio/queen.mp3', category: 'Spiritual', description: 'Through meditation and self-discipline, the Monk achieves harmony between mind, body, and spirit.' },
    { id: 'ninja', name: 'Ninja', src: '/avatars/ninja.png', text: 'Silent shadow of the night.', audio: '/audio/ninja.mp3', category: 'Warrior', description: 'Moving unseen through darkness, the Ninja strikes with precision and disappears without a trace.' },
    { id: 'monk', name: 'Monk', src: '/avatars/queen.png', text: 'Ruler with fierce grace.', audio: '/audio/monk.mp3', category: 'Royalty', description: 'The Queen commands respect through wisdom, strategy, and unwavering determination.' },
    { id: 'sage', name: 'Sage', src: '/avatars/sage.png', text: 'Wise mind of the ancients.', audio: '/audio/sage.mp3', category: 'Spiritual', description: 'Drawing from lifetimes of knowledge, the Sage offers guidance to those seeking enlightenment.' },
    { id: 'samurai', name: 'Samurai', src: '/avatars/samurai.png', text: 'Honor-bound blade master.', audio: '/audio/samurai.mp3', category: 'Warrior', description: 'The Samurai lives by a strict code of honor, mastering both combat and inner discipline.' },
    { id: 'space', name: 'Space', src: '/avatars/space.png', text: 'Explorer of galaxies.', audio: '/audio/space.mp3', category: 'Explorer', description: 'Venturing into the unknown, the Space Explorer maps the mysteries of distant stars and planets.' },
    { id: 'wizard', name: 'Wizard', src: '/avatars/wizard.png', text: 'Master of cosmic spells.', audio: '/audio/wizard.mp3', category: 'Magic', description: 'With ancient tomes and potent incantations, the Wizard manipulates the fundamental forces of existence.' },
  ];

  const categories = ['All', ...new Set(avatars.map(avatar => avatar.category))];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleError = (error: Event) => {
      console.error("Audio error:", error);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (!audio.paused) audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleAudio = async (audioSrc: string | SetStateAction<null>) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAudio === audioSrc && isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);

    try {
      if (typeof audioSrc === 'string') {
        audio.src = audioSrc;
      }
      await audio.play();
      setIsPlaying(true);
      setCurrentAudio(audioSrc as string | null);
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };
  
  const handleAvatarSelection = (avatar: { id: string; src: string; audio: string }) => {
    if (!avatar) return;
    
    router.push(`/createAvatarP?avatar=${avatar.id}&image=${encodeURIComponent(avatar.src)}&audio=${encodeURIComponent(avatar.audio)}`);
  };

  const filteredAvatars = avatars
    .filter(avatar => selectedCategory === 'All' || avatar.category === selectedCategory)
    .filter(avatar =>
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const AvatarDetailModal = () => {
    if (!selectedAvatar) return null;
    
    const avatar = avatars.find(a => a.id === selectedAvatar || a.name === selectedAvatar);
    if (!avatar) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-purple-900 text-white' : 'bg-white border-purple-200'} rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border`}>
          <div className="relative">
            <button
              onClick={() => setSelectedAvatar(null)}
              className={`absolute top-4 right-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} p-2 rounded-full z-10 shadow-md transition-all duration-300`}
            >
              <X size={24} />
            </button>
            <div className="h-64 bg-gradient-to-r from-purple-500 to-violet-300 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image src={avatar.src} alt={avatar.name} width={160} height={160} className="object-cover" />
                </div>
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${theme === 'dark' ? 'bg-gray-800 text-purple-300' : 'bg-white text-purple-700'} py-1 px-4 rounded-full shadow-lg text-sm font-medium`}>
                  {avatar.category}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{avatar.name}</h2>
            </div>
            <p className="text-purple-600 italic mb-4 text-lg">{avatar.text}</p>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8 text-lg`}>{avatar.description}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => toggleAudio(avatar.audio)}
                className={`flex items-center ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-lg`}
              >
                {currentAudio === avatar.audio && isPlaying ? (
                  <>
                    <Pause size={20} className="mr-2" />
                    Pause Voice
                  </>
                ) : (
                  <>
                    <Play size={20} className="mr-2" />
                    Play Voice
                  </>
                )}
              </button>
              <button
                onClick={() => handleAvatarSelection(avatar)}
                className={`flex items-center ${theme === 'dark' ? 'bg-violet-700 hover:bg-violet-800' : 'bg-violet-600 hover:bg-violet-700'} transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-lg`}
              >
                USE AVATAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-950 to-gray-900' : 'bg-gradient-to-br from-indigo-50 to-white'} z-0`}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(/avatars/background.jpg)' }}
        />
      </div>

      <div className="absolute top-40 left-10 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <audio ref={audioRef} preload="auto"></audio>
        
        <div className="mb-12 relative">
          <div className={`inline-block ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'} px-3 py-1 rounded-full text-sm font-medium mb-3 shadow-sm`}>
            Next-Gen AI Avatar Gallery
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
            <div className="relative">
              <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} relative z-10 mb-2`}>
                Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500">Digital Identity</span>
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
                Explore our collection of AI-powered digital avatars designed to represent your unique personality in the virtual world.
              </p>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
            </div>
            
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search size={20} className="text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search avatars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${theme === 'dark' ? 'bg-gray-800 bg-opacity-70 text-white border-gray-700' : 'bg-white bg-opacity-70 text-gray-900 border-gray-200'} backdrop-blur-sm rounded-xl w-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400 border shadow-sm`}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-2 w-full md:w-auto">
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-center">
                Create Avatar
              </Link>
              <div className={`flex ${theme === 'dark' ? 'bg-gray-800 bg-opacity-70 border-gray-700' : 'bg-white bg-opacity-70 border-gray-200'} backdrop-blur-sm rounded-xl p-1 shadow-sm border`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg flex-1 md:flex-none ${viewMode === 'grid' ? 
                    'bg-purple-600 text-white' : 
                    `hover:bg-purple-100 text-purple-600 ${theme === 'dark' ? 'hover:bg-gray-700 text-purple-300' : ''}`
                  } transition-colors`}
                  title="Grid View"
                >
                  <div className="flex justify-center items-center">
                    <Grid size={20} />
                    <span className="ml-2 block md:hidden">Grid</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg flex-1 md:flex-none ${viewMode === 'list' ? 
                    'bg-purple-600 text-white' : 
                    `hover:bg-purple-100 text-purple-600 ${theme === 'dark' ? 'hover:bg-gray-700 text-purple-300' : ''}`
                  } transition-colors`}
                  title="List View"
                >
                  <div className="flex justify-center items-center">
                    <List size={20} />
                    <span className="ml-2 block md:hidden">List</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-6 mb-6">
          <div className="flex space-x-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg transform scale-105'
                    : `${theme === 'dark' ? 'bg-gray-800 bg-opacity-70 text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-white bg-opacity-70 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border-gray-200'} backdrop-blur-sm border shadow-sm`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8 text-gray-500 flex items-center">
          <span className={theme === 'dark' ? 'text-gray-400' : ''}>Showing {filteredAvatars.length} {filteredAvatars.length === 1 ? 'avatar' : 'avatars'}</span>
          <div className="flex-grow mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`${theme === 'dark' ? 'bg-gray-800 bg-opacity-70 border-gray-700' : 'bg-white bg-opacity-70 border-gray-100'} backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="relative w-full h-56 bg-gradient-to-b from-purple-50 to-white">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <Image
                        src={avatar.src}
                        alt={avatar.name}
                        width={128}
                        height={128}
                        className="object-cover rounded-full shadow-lg border-2 border-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{avatar.name}</h3>
                    <span className={`inline-block ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'} text-xs px-2 py-1 rounded-full`}>{avatar.category}</span>
                  </div>
                  <p className="text-purple-600 italic mb-4">{avatar.text}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(avatar.audio);
                    }}
                    className={`mt-4 w-full flex items-center justify-center ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-purple-900 hover:bg-gray-600 text-purple-300' 
                        : 'bg-white border-purple-200 hover:bg-purple-50 text-purple-600'
                    } transition-colors px-4 py-2 rounded-xl font-medium border`}
                  >
                    {currentAudio === avatar.audio && isPlaying ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Pause Voice
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Play Voice
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-6">
            {filteredAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`${theme === 'dark' ? 'bg-gray-800 bg-opacity-70 border-gray-700' : 'bg-white bg-opacity-70 border-gray-100'} backdrop-blur-sm rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="relative w-28 h-28 md:w-24 md:h-24 flex-shrink-0 mb-4 md:mb-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-purple-100 shadow-lg">
                    <div className="relative w-full h-full">
                      <Image
                        src={avatar.src}
                        alt={avatar.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:ml-6 flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{avatar.name}</h3>
                    <span className={`inline-block ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'} text-xs px-3 py-1 rounded-full mt-1 md:mt-0`}>{avatar.category}</span>
                  </div>
                  <p className="text-purple-600 italic mb-4">{avatar.text}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio(avatar.audio);
                  }}
                  className={`mt-4 md:mt-0 md:ml-6 flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 border-purple-900 text-purple-300' 
                      : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-600'
                  } transition-colors px-4 py-2 rounded-xl font-medium border`}
                >
                  {currentAudio === avatar.audio && isPlaying ? (
                    <>
                      <Pause size={18} className="mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={18} className="mr-2" />
                      Play Voice
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <AvatarDetailModal />
      </div>
    </div>
  );
};

export default AvatarGallery;
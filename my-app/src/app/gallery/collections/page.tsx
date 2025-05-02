'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AvatarGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Avatar data
  const avatars = [
    {
      name: 'Builder',
      src: '/avatars/builder.png',
      text: 'Visionary creator of worlds.',
      audio: '/audio/builder.mp3',
      category: 'Creator',
      description: 'The Builder constructs realities and reshapes landscapes with innovative vision and meticulous attention to detail.'
    },
    {
      name: 'Guardian',
      src: '/avatars/guardian.png',
      text: 'Protector of ancient secrets.',
      audio: '/audio/guardian.mp3',
      category: 'Defender',
      description: 'Standing vigilant, the Guardian safeguards knowledge and treasures from those who would misuse them.'
    },
    {
      name: 'Hacker',
      src: '/avatars/hacker.png',
      text: 'Master of digital realms.',
      audio: '/audio/hacker.mp3',
      category: 'Tech',
      description: 'With keystrokes as weapons, the Hacker navigates the complex networks of cyberspace.'
    },
    {
      name: 'Knight',
      src: '/avatars/knight.png',
      text: 'Noble warrior of justice.',
      audio: '/audio/knight.mp3',
      category: 'Warrior',
      description: 'Clad in armor forged from honor, the Knight fights for those who cannot defend themselves.'
    },
    {
      name: 'Mage',
      src: '/avatars/mage.png',
      text: 'Weaver of arcane magic.',
      audio: '/audio/mage.mp3',
      category: 'Magic',
      description: 'The Mage channels primordial energies to bend reality itself to their will.'
    },
    {
      name: 'Monk',
      src: '/avatars/monk.png',
      text: 'Disciplined soul of balance.',
      audio: '/audio/monk.mp3',
      category: 'Spiritual',
      description: 'Through meditation and self-discipline, the Monk achieves harmony between mind, body, and spirit.'
    },
    {
      name: 'Ninja',
      src: '/avatars/ninja.png',
      text: 'Silent shadow of the night.',
      audio: '/audio/ninja.mp3',
      category: 'Warrior',
      description: 'Moving unseen through darkness, the Ninja strikes with precision and disappears without a trace.'
    },
    {
      name: 'Queen',
      src: '/avatars/queen.png',
      text: 'Ruler with fierce grace.',
      audio: '/audio/queen.mp3',
      category: 'Royalty',
      description: 'The Queen commands respect through wisdom, strategy, and unwavering determination.'
    },
    {
      name: 'Sage',
      src: '/avatars/sage.png',
      text: 'Wise mind of the ancients.',
      audio: '/audio/sage.mp3',
      category: 'Spiritual',
      description: 'Drawing from lifetimes of knowledge, the Sage offers guidance to those seeking enlightenment.'
    },
    {
      name: 'Samurai',
      src: '/avatars/samurai.png',
      text: 'Honor-bound blade master.',
      audio: '/audio/samurai.mp3',
      category: 'Warrior',
      description: 'The Samurai lives by a strict code of honor, mastering both combat and inner discipline.'
    },
    {
      name: 'Space',
      src: '/avatars/space.png',
      text: 'Explorer of galaxies.',
      audio: '/audio/space.mp3',
      category: 'Explorer',
      description: 'Venturing into the unknown, the Space Explorer maps the mysteries of distant stars and planets.'
    },
    {
      name: 'Wizard',
      src: '/avatars/wizard.png',
      text: 'Master of cosmic spells.',
      audio: '/audio/wizard.mp3',
      category: 'Magic',
      description: 'With ancient tomes and potent incantations, the Wizard manipulates the fundamental forces of existence.'
    },
  ];

  // Extract unique categories
  const categories = ['All', ...new Set(avatars.map(avatar => avatar.category))];

  // Audio playback controls - Fixed
  const toggleAudio = (audioSrc, avatarName) => {
    // Ensure we check if audioRef.current exists first
    if (!audioRef.current) return;

    // If the same audio is already playing, pause it
    if (currentAudio === audioSrc && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is already playing, pause it and reset
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Set new audio source and update state
    setCurrentAudio(audioSrc);
    setIsPlaying(true);

    // Use timeout to ensure the audio source is set before playing
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
    }, 100);
  };

  // Cleanup effect for audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle audio ended event
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioRef.current]); // Fixed dependency to properly reattach listener

  // Filter avatars
  const filteredAvatars = avatars
    .filter(avatar => selectedCategory === 'All' || avatar.category === selectedCategory)
    .filter(avatar =>
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Generate random stats
  const generateRandomStat = () => {
    const stats = [
      { value: `${Math.floor(Math.random() * 50) + 30}%`, label: 'Lower exit rates' },
      { value: `${(Math.random() * 5 + 1).toFixed(1)}x`, label: 'Returning visitor rate' },
      { value: `${Math.floor(Math.random() * 60) + 20}%`, label: 'Time saved on calls' },
      { value: `${(Math.random() * 10 + 1).toFixed(1)}x`, label: 'Faster onboarding' }
    ];

    return [
      stats[Math.floor(Math.random() * stats.length)],
      stats[Math.floor(Math.random() * stats.length)]
    ];
  };

  // Avatar detail modal
  const AvatarDetailModal = () => {
    if (!selectedAvatar) return null;
    const avatar = avatars.find(a => a.name === selectedAvatar);
    if (!avatar) return null;
    const stats = generateRandomStat();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-purple-200">
          <div className="relative">
            <button
              onClick={() => setSelectedAvatar(null)}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-2 rounded-full z-10 shadow-md transition-all duration-300"
            >
              <svg width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="h-64 bg-gradient-to-r from-purple-500 to-violet-300 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image src={avatar.src} alt={avatar.name} width={160} height={160} className="object-cover" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white py-1 px-4 rounded-full shadow-lg text-sm font-medium text-purple-700">
                  {avatar.category}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900">{avatar.name}</h2>
            </div>
            <p className="text-purple-600 italic mb-4 text-lg">{avatar.text}</p>
            <p className="text-gray-600 mb-8 text-lg">{avatar.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-1">
                    <svg className="text-purple-600 mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-purple-600 font-bold text-lg">{stat.value}</span>
                  </div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => toggleAudio(avatar.audio, avatar.name)}
                className="flex items-center bg-purple-600 hover:bg-purple-700 transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
              >
                {currentAudio === avatar.audio && isPlaying ? (
                  <>
                    <svg width="20" height="20" stroke="currentColor" fill="none" className="mr-2">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause Voice
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" stroke="currentColor" fill="none" className="mr-2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Play Voice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with image overlay - Fixed backgroundImage syntax */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(/avatars/background.jpg)' }}
        />
      </div>

      {/* Navigation bar
      <nav className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm shadow-sm py-4 px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-purple-600">AvatarAI</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Home</Link>
            <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Reflections</Link>
            <Link href="#" className="text-purple-600 font-medium">Gallery</Link>
            <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Create</Link>
            <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Settings</Link>
          </div>
          <Link href="#" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-full font-medium shadow-md transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav> */}

      {/* Decorative background elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
      
      {/* Main content with positioning relative to decorative elements */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Fixed the audio element to always have a source */}
        <audio ref={audioRef} src={currentAudio || ''} onEnded={() => setIsPlaying(false)} />
        
        {/* Enhanced Page header with visual elements */}
        <div className="mb-12 relative">
          {/* Title badge with glow effect */}
          <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-3 shadow-sm">
            Next-Gen AI Avatar Gallery
          </div>
          
          {/* Enhanced title section with decorative elements */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 relative z-10 mb-2">
                Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500">Digital Identity</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore our collection of AI-powered digital avatars designed to represent your unique personality in the virtual world.
              </p>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
            </div>
            
          </div>
          
          {/* Search and view controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg width="20" height="20" stroke="currentColor" fill="none" className="text-purple-400">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search avatars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white bg-opacity-70 backdrop-blur-sm text-gray-900 rounded-xl w-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400 border border-gray-200 shadow-sm"
              />
            </div>
            <div>
            <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 whitespace-nowrap">
              Create Avatar
            </Link>
            </div>
            <div className="flex space-x-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-purple-600'} transition-colors`}
                title="Grid View"
              >
                <svg width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-purple-600'} transition-colors`}
                title="List View"
              >
                <svg width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category filters with enhanced styling */}
        <div className="overflow-x-auto pb-6 mb-6">
          <div className="flex space-x-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg transform scale-105'
                    : 'bg-white bg-opacity-70 backdrop-blur-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results counter with subtle separator */}
        <div className="mb-8 text-gray-500 flex items-center">
          <span>Showing {filteredAvatars.length} {filteredAvatars.length === 1 ? 'avatar' : 'avatars'}</span>
          <div className="flex-grow mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Avatar display - Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAvatars.map((avatar) => {
              const stats = generateRandomStat();

              return (
                <div
                  key={avatar.name}
                  className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                  onClick={() => setSelectedAvatar(avatar.name)}
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
                      <h3 className="text-xl font-bold text-gray-900">{avatar.name}</h3>
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{avatar.category}</span>
                    </div>
                    <p className="text-purple-600 italic mb-4">{avatar.text}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {stats.map((stat, i) => (
                        <div key={i} className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                          <div className="flex items-center mb-1">
                            <svg className="text-purple-600 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="text-purple-600 font-bold">{stat.value}</span>
                          </div>
                          <span className="text-xs text-gray-600">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudio(avatar.audio, avatar.name);
                      }}
                      className="mt-4 w-full flex items-center justify-center bg-white border border-purple-200 hover:bg-purple-50 transition-colors text-purple-600 px-4 py-2 rounded-xl font-medium"
                    >
                      {currentAudio === avatar.audio && isPlaying ? (
                        <>
                          <svg width="16" height="16" stroke="currentColor" fill="none" className="mr-2">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                          Pause Voice
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" stroke="currentColor" fill="none" className="mr-2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Play Voice
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Avatar display - List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {filteredAvatars.map((avatar) => {
              const stats = generateRandomStat();

              return (
                <div
                  key={avatar.name}
                  className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
                  onClick={() => setSelectedAvatar(avatar.name)}
                >
                  <div className="relative w-28 h-28 md:w-24 md:h-24 flex-shrink-0 mb-4 md:mb-0">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-purple-100 shadow-lg">
                      <Image
                        src={avatar.src}
                        alt={avatar.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:ml-6 flex-grow text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{avatar.name}</h3>
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full mt-1 md:mt-0">{avatar.category}</span>
                    </div>
                    <p className="text-purple-600 italic mb-4">{avatar.text}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {stats.map((stat, i) => (
                        <div key={i} className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                          <div className="flex items-center mb-1">
                            <svg className="text-purple-600 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="text-purple-600 font-bold">{stat.value}</span>
                          </div>
                          <span className="text-xs text-gray-600">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(avatar.audio, avatar.name);
                    }}
                    className="mt-4 md:mt-0 md:ml-6 flex items-center justify-center bg-white hover:bg-purple-50 border border-purple-200 transition-colors text-purple-600 px-4 py-2 rounded-xl font-medium"
                  >
                    {currentAudio === avatar.audio && isPlaying ? (
                      <>
                        <svg width="18" height="18" stroke="currentColor" fill="none" className="mr-2">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" stroke="currentColor" fill="none" className="mr-2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Play Voice
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Avatar Modal */}
        <AvatarDetailModal />
      </div>
    </div>
  );
};

export default AvatarGallery;
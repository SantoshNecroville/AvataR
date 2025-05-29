"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search } from 'lucide-react';
import { FileText, ChevronRight, Plus as PlusIcon, Mic, Moon, Sun } from "lucide-react";
import { useRouter } from 'next/navigation';

type ProjectType = 'all' | 'personalized' | 'avatar' | 'screen';

type HomePageProps = {
    setCurrentItem: (item: string) => void; 
};

const HomePage = ({ setCurrentItem }: HomePageProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ProjectType>('all');
    const [component, setComponent] = useState("frontPage");
    const [isDarkMode, setIsDarkMode] = useState(false);

    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const DirectToCreate = (message: string) => {
        console.log(message);
        setComponent(message);
        router.push(message);
    }

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className={`${component !== "frontPage" ? "hidden" : "block"} min-h-screen bg-background dark:bg-black text-purple-900 dark:text-purple-100 p-4 sm:p-6 md:p-8 rounded-md w-full overflow-x-hidden transition-colors duration-300`}>
                <Head>
                    <title>Studio by Gan.AI</title>
                    <meta name="description" content="Create personalized videos and avatars" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                {/* Theme Toggle Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <main className="max-w-7xl mx-auto">
                    
                    <div className="mb-8 md:mb-16">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-900 dark:text-purple-100">What would you like to create?</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" >

                            <div className="group bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 transition hover:scale-105 hover:to-purple-200 dark:hover:to-purple-800 duration-300 border-t-2 border-t-purple-500 dark:border-t-purple-400 rounded-lg p-3 sm:p-4 flex items-center justify-between cursor-pointer shadow-md"
                                onClick={() => DirectToCreate("createAvatarP")}>
                                <div className="flex items-center">
                                    <div className="bg-purple-200 dark:bg-purple-800 p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                                        <DocumentIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700 dark:text-purple-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-purple-900 dark:text-purple-100">New personalized project</h3>
                                        <p className="text-purple-600 dark:text-purple-300 text-xs sm:text-sm">Record a single video & personalize it for each viewer</p>
                                    </div>
                                </div>
                                <button className="p-1 sm:p-2 rounded-lg text-purple-600 dark:text-purple-300 cursor-pointer flex-shrink-0">
                                    <ChevronRight className="hidden group-hover:block h-4 w-4 sm:h-5 sm:w-5" />
                                    <PlusIcon className="block group-hover:hidden h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>

                            <div className="group bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/50 transition hover:scale-105 hover:to-purple-200 dark:hover:to-purple-800 duration-300 border-t-2 border-t-purple-500 dark:border-t-purple-400 cursor-pointer rounded-lg p-3 sm:p-4 flex items-center justify-between shadow-md"
                                onClick={() => { setCurrentItem("textToAudio") }}>
                                <div className="flex items-center">
                                    <div className="bg-purple-200 dark:bg-purple-800 p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                                        <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700 dark:text-purple-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-purple-900 dark:text-purple-100">Convert Text to Speech</h3>
                                        <p className="text-purple-600 dark:text-purple-300 text-xs sm:text-sm">Create audio with your voice and text</p>
                                    </div>
                                </div>
                                <button className="p-1 sm:p-2 rounded-lg text-purple-600 dark:text-purple-300 cursor-pointer flex-shrink-0">
                                    <ChevronRight className="hidden group-hover:block h-4 w-4 sm:h-5 sm:w-5" />
                                    <PlusIcon className="block group-hover:hidden h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        </div>
                    </div>


                    <hr className="border-purple-200 dark:border-purple-800 my-6 sm:my-8" />

                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <div className="flex items-center">
                                <h2 className="text-xl sm:text-2xl font-semibold mr-2 text-purple-900 dark:text-purple-100">Recently created</h2>
                                <span className="text-purple-400 dark:text-purple-500">•</span>
                            </div>

                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full sm:w-auto bg-purple-50 dark:bg-purple-900/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 border border-purple-200 dark:border-purple-700 dark:text-purple-100"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400 dark:text-purple-300" />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 overflow-x-auto">
                            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} isDark={isDarkMode}>
                                All
                            </TabButton>
                            <TabButton active={activeTab === 'personalized'} onClick={() => setActiveTab('personalized')} isDark={isDarkMode}>
                                Personalized projects
                            </TabButton>
                            <TabButton active={activeTab === 'avatar'} onClick={() => setActiveTab('avatar')} isDark={isDarkMode}>
                                Avatar projects
                            </TabButton>
                        </div>

                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20">
                            <div className="relative w-48 sm:w-64 h-36 sm:h-48 mb-4 sm:mb-6">
                                <div className="absolute top-0 right-4 sm:right-8 text-xs bg-purple-100 dark:bg-purple-800 bg-opacity-80 p-1 rounded">
                                    <div className="text-xs text-purple-800 dark:text-purple-200">
                                        <p>Hey John!</p>
                                        <p>Hey Jane!</p>
                                        <p>Hey Patel!</p>
                                    </div>
                                </div>
                                <AvatarIllustration isDark={isDarkMode} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-center text-purple-900 dark:text-purple-100">Welcome to Studio by Gan.AI</h3>
                            <button 
                                className="bg-purple-700 dark:bg-purple-600 cursor-pointer hover:bg-purple-800 dark:hover:bg-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium w-full sm:w-auto shadow-md" 
                                onClick={() => DirectToCreate("createAvatarP")}
                            >
                                Generate an Avatar Video
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


const TabButton = ({
    children,
    active,
    onClick,
    isDark = false
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    isDark?: boolean;
}) => {
    return (
        <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                active 
                    ? 'bg-purple-700 dark:bg-purple-600 text-white' 
                    : isDark 
                        ? 'text-purple-300 hover:bg-purple-800/50' 
                        : 'text-purple-600 hover:bg-purple-100'
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const DocumentIcon = ({ className }: { className?: string }) => (
    <FileText className={className} />
);


const AvatarIllustration = ({ isDark = false }: { isDark?: boolean }) => (
    <div className="relative h-full w-full">
        <div className="absolute bottom-0 left-8 sm:left-12">
            <div className={`w-16 sm:w-24 h-24 sm:h-32 ${isDark ? 'bg-purple-700' : 'bg-purple-300'} rounded-t-full relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 sm:w-16 h-16 sm:h-20 ${isDark ? 'bg-purple-600' : 'bg-purple-400'} rounded-t-full`}>
                        <div className={`w-8 sm:w-10 h-8 sm:h-10 ${isDark ? 'bg-purple-500' : 'bg-purple-500'} rounded-full absolute top-1 sm:top-2 left-2 sm:left-3`}></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-2 sm:bottom-4 right-8 sm:right-12">
            <div className="w-16 sm:w-20 h-20 sm:h-24 relative">
                <div className={`w-8 sm:w-12 h-8 sm:h-12 ${isDark ? 'bg-purple-600' : 'bg-purple-400'} rounded-lg`}></div>
                <div className={`w-6 sm:w-8 h-12 sm:h-16 ${isDark ? 'bg-purple-700' : 'bg-purple-300'} absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2`}></div>
            </div>
        </div>
    </div>
);

export default HomePage;
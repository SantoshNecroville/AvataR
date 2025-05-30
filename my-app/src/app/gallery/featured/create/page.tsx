'use client';

import { useRef } from 'react';

export default function CreateAvatarPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#3b2f2f,_#1a1a2e)] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-4xl bg-[#1f1f2e]/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-[#2e2e4d]">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-12">🎭 Create Your Avatar</h1>

        <div className="space-y-10">
          <div className="bg-[#2d2d44] p-6 rounded-xl border border-[#3b3b5c]">
            <h2 className="text-2xl font-semibold mb-3">📝 Name or Describe Your Avatar</h2>
            <input
              type="text"
              placeholder="E.g. Cyberpunk Wizard, Chill Monk, Neon Knight..."
              className="w-full mt-2 p-3 rounded-lg bg-[#1c1c2b] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Avatar Image Upload */}
          <div className="bg-[#2d2d44] p-6 rounded-xl border border-[#3b3b5c]">
            <h2 className="text-2xl font-semibold mb-3">📸 Upload Avatar Image</h2>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>

          {/* Voice Upload */}
          <div className="bg-[#2d2d44] p-6 rounded-xl border border-[#3b3b5c]">
            <h2 className="text-2xl font-semibold mb-3">🎤 Upload or Record Voice</h2>
            <input
              type="file"
              accept="audio/*"
              ref={audioInputRef}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200">
              🚀 Submit Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

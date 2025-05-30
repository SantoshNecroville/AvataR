'use client';

import { useEffect, useState } from 'react';

export default function Preferences() {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedFont = localStorage.getItem('fontSize');
    if (storedTheme) setTheme(storedTheme);
    if (storedFont) setFontSize(storedFont);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    if (theme === 'light') {
      html.classList.add('light');
    } else if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? 'dark' : 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('text-sm', 'text-base', 'text-lg');
    if (fontSize === 'small') {
      body.classList.add('text-sm');
    } else if (fontSize === 'large') {
      body.classList.add('text-lg');
    } else {
      body.classList.add('text-base');
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <div className="relative min-h-screen py-10 px-6 bg-[#e6e6fa] overflow-hidden">

      <div className="absolute inset-0 opacity-25 z-0">
        <img src="/ai(1).png" alt="Background" className="w-full h-full object-cover" />
      </div>


      <div className="relative z-10 max-w-4xl mx-auto space-y-10">


        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Preferences</h1>
          <p className="text-lg text-black">Manage your theme, font size, and notification settings.</p>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-200">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Appearance Settings</h3>
          <div className="flex gap-6 flex-wrap">
            <div className="flex-1">
              <label className="block text-purple-800 font-medium mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 shadow-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-purple-800 font-medium mb-2">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full p-3 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 shadow-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium (Default)</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-200">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Notification Settings</h3>


          <div className="bg-[#f4f0ff] p-4 rounded-xl flex items-center gap-3 border border-purple-200 shadow">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 accent-purple-700"
            />
            <label htmlFor="emailNotifications" className="text-purple-900 font-medium">
              Enable Email Notifications
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}

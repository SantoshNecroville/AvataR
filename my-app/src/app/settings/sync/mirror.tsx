'use client';

import { useState } from 'react';

export default function MirrorSyncPage() {
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('realtime');
  const [syncAppearance, setSyncAppearance] = useState(true);
  const [syncLanguage, setSyncLanguage] = useState(true);
  const [syncNotifications, setSyncNotifications] = useState(true);

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: '#E6E6FA' }}>
      
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
        <img src="/ai(1).png" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">

        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Mirror Sync</h1>
          <p className="text-gray-700">
            Enable Mirror Sync to automatically sync your preferences across all devices. Choose how frequently syncing occurs and which preferences to include.
          </p>
        </div>

        <div className="bg-[#4a3d66] p-6 rounded-3xl shadow-xl border border-purple-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-white font-semibold text-lg">Enable Mirror Sync</label>
            <input
              type="checkbox"
              checked={isSyncEnabled}
              onChange={(e) => setIsSyncEnabled(e.target.checked)}
              className="w-5 h-5 accent-purple-400"
            />
          </div>
          <p className="text-purple-100 text-sm">
            {isSyncEnabled ? 'Sync Active • Last synced 5 minutes ago' : 'Sync is currently disabled'}
          </p>
        </div>

        <div className="bg-[#4a3d66] p-6 rounded-3xl shadow-xl border border-purple-200">
          <label className="block text-white font-semibold text-lg mb-2">Sync Frequency</label>
          <select
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#e8ddff] text-black border border-purple-300 shadow-sm"
          >
            <option value="realtime">Real-time</option>
            <option value="5min">Every 5 minutes</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div className="bg-[#4a3d66] p-6 rounded-3xl shadow-xl border border-purple-200">
          <h2 className="text-white font-semibold text-lg mb-4">Selective Sync</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncAppearance}
                onChange={() => setSyncAppearance(!syncAppearance)}
                className="w-5 h-5 accent-purple-400"
              />
              <span className="text-white">Appearance Settings</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncLanguage}
                onChange={() => setSyncLanguage(!syncLanguage)}
                className="w-5 h-5 accent-purple-400"
              />
              <span className="text-white">Language Preferences</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={syncNotifications}
                onChange={() => setSyncNotifications(!syncNotifications)}
                className="w-5 h-5 accent-purple-400"
              />
              <span className="text-white">Notification Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

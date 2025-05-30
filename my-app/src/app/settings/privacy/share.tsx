'use client';

import { useState } from 'react';

export default function PrivacySettings() {
  const [accountPrivacy, setAccountPrivacy] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  return (
    <div className="min-h-screen py-10 px-6" style={{ backgroundColor: '#E6E6FA' }}>
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="absolute inset-0 opacity-10 z-0">
          <img src="/ai(1).png" alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-black mb-1">Privacy Settings</h1>
          <p className="text-gray-700">
            Customize your privacy settings, including account privacy, data sharing, and location sharing.
          </p>
        </div>


        <div className="bg-[#3a3050] p-1 rounded-2xl shadow-2xl border border-purple-300">
          <div className="bg-[#4a3d66] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Account Privacy</h3>
            <p className="text-white mb-4">
              Control the visibility of your account. Toggle the switch to hide or show your profile to others.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={accountPrivacy}
                onChange={(e) => setAccountPrivacy(e.target.checked)}
                className="w-5 h-5 accent-purple-500"
              />
              <span className="text-white">Enable Account Privacy</span>
            </label>
          </div>
        </div>

        {/* Data Sharing Settings */}
        <div className="bg-[#3a3050] p-1 rounded-2xl shadow-2xl border border-purple-300">
          <div className="bg-[#4a3d66] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Data Sharing</h3>
            <p className="text-white mb-4">
              Choose whether to share your data with third parties for personalized experiences and ads.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
                className="w-5 h-5 accent-purple-500"
              />
              <span className="text-white">Enable Data Sharing</span>
            </label>
          </div>
        </div>

        {/* Location Sharing Settings */}
        <div className="bg-[#3a3050] p-1 rounded-2xl shadow-2xl border border-purple-300">
          <div className="bg-[#4a3d66] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Location Sharing</h3>
            <p className="text-white mb-4">
              Control whether or not to share your location with the app. Turn off to keep your location private.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={locationSharing}
                onChange={(e) => setLocationSharing(e.target.checked)}
                className="w-5 h-5 accent-purple-500"
              />
              <span className="text-white">Enable Location Sharing</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}

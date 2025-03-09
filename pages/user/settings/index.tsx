import React, { useState } from 'react';
import { Globe, Moon, Sun, Upload, User } from 'lucide-react';
import dynamic from 'next/dynamic';
function Index() {

    const Navbar=dynamic(()=>import('../../components/Navbar'),{ssr:false})
  const [useAnimations, setUseAnimations] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <>
    <Navbar/>

    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1121] text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
<div className="container mx-auto px-4 py-12 max-w-3xl mt-20">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        {/* Profile Section */}
        <div className={`p-8 rounded-2xl mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#151F32]' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold">Profile</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Profile Image</h3>
            <p className="text-sm text-gray-400 mb-6">Upload or drag a profile picture to personalize your account.</p>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors duration-300 
                ${isDarkMode ? 'border-gray-700 hover:border-gray-600 bg-[#0B1121]/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
            >
              <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <p className="mb-2 font-medium">Drag and drop your image here</p>
              <p className="text-sm text-gray-500 mb-6">PNG, JPG, or GIF (max. 3MB)</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto">
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className={`p-8 rounded-2xl mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#151F32]' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold">Appearance</h2>
          </div>

          {/* Theme Toggle */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium mb-1">Theme</h3>
                <p className="text-sm text-gray-400">Customize how the application looks for you.</p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Animations Toggle */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium mb-1">Animations</h3>
                <p className="text-sm text-gray-400">Enable or disable UI animations.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAnimations}
                  onChange={(e) => setUseAnimations(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium mb-1">Font Size</h3>
                <p className="text-sm text-gray-400">Adjust the base font size for the application.</p>
              </div>
              <span className="text-2xl font-semibold text-blue-500">{fontSize}%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Smaller</span>
              <input
                type="range"
                min="50"
                max="150"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-sm font-medium">Larger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Index;
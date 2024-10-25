import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useSession } from "next-auth/react";
import Cookies from 'js-cookie';
import ImageCarousel from './components/imageCarousel';
import NetworkStatus from './components/networkStatus';
import NetworkSpeedButton from './components/NetworkSpeed';
import dynamic from 'next/dynamic';

const Index: React.FC = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const AiChatBot = dynamic(() => import('./components/ChatBox'));
console.log(session,'dscd')
  useEffect(() => {
    // Simulate loading time (e.g., splash screen)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds delay for loading

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If session exists and the token is available, set it in a cookie
    if (session && session.user?.token) {
      Cookies.set('jwtToken', session.user.token, { expires: 7 }); // Expires in 7 days
      Cookies.set('userId',session.user.usersId)
      console.log('JWT Token set in cookie:', session.user.token);
    }
  }, [session]);

  // Inline styles for loading screen and animation
  const loadingScreenStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a2d45', // Dark background for loading screen
  };

  const loadingBarStyle = {
    width: '100px',
    height: '5px',
    backgroundColor: '#0c2336', // Bar background
    marginTop: '10px',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const loadingBarFillStyle = {
    width: '0',
    height: '100%',
    backgroundColor: '#0073b1', // Loading bar fill color
    animation: 'load 3s ease-in-out infinite',
  };

  // Keyframe animation using JavaScript
  const loadingKeyframes = `
    @keyframes load {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }
  `;

  return (
    <>
      <style>
        {loadingKeyframes}
      </style>
      {isLoading ? (
        <div style={loadingScreenStyle}>
          <Image
            src="/logo_airline.png" // Replace with your logo path
            alt="Logo"
            width={200}
            height={200}
          />
          <div style={loadingBarStyle}>
            <div style={loadingBarFillStyle}></div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <AiChatBot />
          <div className="h-[80vh] relative">
  <Image
    src="https://airline-datacenter.s3.ap-south-1.amazonaws.com/5668d540-7c4a-4e62-a7f6-d4eeacfeeeec.png"
    layout="fill"
    alt="Loading Error"
    loading="lazy"
    className="opacity-100"
    objectFit="cover"
  />
  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
    
    <h1 className="text-white text-6xl font-bold text-center">Welcome to Skybeats</h1>
  </div>
</div>

          <footer className="bg-gray-900">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
              {/* Footer content */}
              <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                  <a href="/" className="flex items-center">
                    <Image src="/logo_airline.png" width={140} height={12} className="h-8" alt="Flowbite Logo" />
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  {[
                    { title: 'Resources', links: ['Skybeats Inc.', 'Airbus', 'Boeing'] },
                    { title: 'Follow us', links: ['Github', 'Discord'] },
                    { title: 'Legal', links: ['Privacy Policy', 'Terms & Conditions'] }
                  ].map((section, index) => (
                    <div key={index}>
                      <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                        {section.title}
                      </h2>
                      <ul className="text-gray-500 dark:text-gray-400 font-medium">
                        {section.links.map((link, idx) => (
                          <li key={idx} className="mb-4">
                            <a href="#" className="hover:underline">
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                  © 2024 <a href="/" className="hover:underline">Skybeats™</a>. All Rights Reserved.
                </span>
                <div className="flex mt-4 sm:justify-center sm:mt-0">
                  {/* Social media links */}
                  {[
                    { href: '#', svgPath: 'M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z', title: 'Facebook page' },
                    { href: '#', svgPath: 'M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59Z', title: 'Discord community' },
                    { href: '#', svgPath: 'M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.179-.005-.357-.014-.534A8.18 8.18 0 0 0 20 1.892Z', title: 'Twitter page' },
                    { href: '#', svgPath: 'M20 0H0v20h20V0ZM8.25 15H5.5V8.25H8.25V15Zm-1.375-7.188A1.688 1.688 0 1 1 8.25 6.125a1.682 1.682 0 0 1-1.687 1.688Zm9.625 7.188h-2.75v-3.375c0-.813-.014-1.875-1.125-1.875-1.125 0-1.313.88-1.313 1.813V15H9.875V8.25h2.625v.938h.037a2.88 2.88 0 0 1 2.588-1.425c2.775 0 3.288 1.825 3.288 4.2V15Z', title: 'LinkedIn profile' }
                  ].map((icon, index) => (
                    <a href={icon.href} className="text-gray-500 hover:text-gray-900 dark:hover:text-white" key={index}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d={icon.svgPath} />
                      </svg>
                      <span className="sr-only">{icon.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

export default Index;

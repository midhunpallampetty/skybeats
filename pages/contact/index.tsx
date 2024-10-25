import React, { useEffect, useState } from 'react';

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://airline-datacenter.s3.ap-south-1.amazonaws.com/4ab849db-833b-400e-ac4a-2b3b3509c303.jpeg')" }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 text-white text-center px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            {/* Loading Skeleton */}
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-1/2 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-1/4 bg-gray-300 rounded mb-2"></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">CONTACT</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your Skybeats journey starts here. We welcome the opportunity to tell you more about our singular and spectacular property.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <p className="mb-2">Address: Skybeats, Bangalore, India</p>
                <p className="mb-2">Phone: +91 123 456 7890</p>
                <p className="mb-2">Email: info@skybeats.com</p>
              </div>
              
              {/* Add your form or additional content here */}
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactPage;

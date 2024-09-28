import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      email
      isBlocked
      username
    }
  }
`;

const ProfileComponent = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'Female',
    contactNo: '+11 998001001',
    currentAddress: 'Beech Creek, PA, Pennsylvania',
    permanentAddress: 'Arlington Heights, IL, Illinois',
    email: 'jane@example.com',
    birthday: 'Feb 06, 1998',
    profileImage:
      'https://e0.pxfuel.com/wallpapers/103/954/desktop-wallpaper-abstract-glare-rays-beams-lines-paints.jpg',
    coverImage:
      'https://e0.pxfuel.com/wallpapers/103/954/desktop-wallpaper-abstract-glare-rays-beams-lines-paints.jpg',
  });

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e, imageType) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUser({ ...user, [imageType]: fileReader.result });
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const userId = Cookies.get('userId');
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const queriedUser = data?.getUserById;

  const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });

  return (
    <>
      <div className="">
        {/* Navbar */}
        <div className="w-full text-white bg-main-color">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className="p-4 flex flex-row items-center justify-between">
              <a href="#" className="text-lg font-semibold tracking-widest uppercase rounded-lg focus:outline-none focus:shadow-outline">
                Example Profile
              </a>
              <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline">
                <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <Navbar />
          </div>
        </div>

        {/* Profile Section */}
        <div className="container bg-blue-950 rounded-lg mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2">
            {/* Left Side - Profile Card */}
            <div className="w-full rounded-lg md:w-3/12 md:mx-2">
              <div className="bg-blue-900/85 rounded-lg p-3 relative">
                <div className="image overflow-hidden relative">
                  <img
                    className="h-auto w-full rounded-lg mx-auto"
                    src={user.profileImage}
                    alt="profile"
                  />
                  {editMode && (
                    <div className="absolute top-2 right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'profileImage')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                      />
                    </div>
                  )}
                </div>
                <h1 className="text-black font-bold text-xl leading-8 my-1">
                  {queriedUser.username}
                </h1>
                <h3 className="text-white font-lg text-semibold leading-6">
                  Owner at Her Company Inc.
                </h3>
                <p className="text-sm text-black hover:text-gray-600 leading-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
                  non deserunt.
                </p>
                <ul className="bg-black/50 shadow-inner shadow-white text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded">
                  <li className="flex items-center py-3">
                    <span>Status</span>
                    <span className="ml-auto">
                      <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">Nov 07, 2016</span>
                  </li>
                </ul>
              </div>
              <div className="my-4"></div>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-9/12 mx-2 h-54">
              {/* About Section */}
              <div className="bg-blue-500/35 shadow-sm rounded-lg relative">
                <img
                  className="w-full h-48 rounded-lg"
                  src={user.coverImage}
                  alt="Profile Background"
                />
                {editMode && (
                  <div className="absolute top-2 right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'coverImage')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                  </div>
                )}
              </div>
              <div className="bg-blue-500/35 mt-2 p-3 shadow-sm rounded-lg">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-white">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">About</span>
                </div>
                <div className="text-white">
                  <button
                    onClick={handleEditClick}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {editMode ? 'Save' : 'Edit'}
                  </button>
                  <div className="grid md:grid-cols-2 text-sm">
                    {Object.entries(user).map(([key, value]) => (
                      <div className="grid grid-cols-2" key={key}>
                        <div className="px-4 py-2 font-semibold">
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="px-4 py-2">
                          {editMode ? (
                            key === 'profileImage' || key === 'coverImage' ? null : (
                              <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleChange}
                                className="w-full px-2 py-1 text-black rounded"
                              />
                            )
                          ) : key === 'email' ? (
                            <a className="text-white" href={`mailto:${value}`}>
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-800/20 shadow-white/50 shadow-inner rounded-lg text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-sm text-gray-400">
              We are a leading company providing top-notch services across
              various industries. Our goal is to deliver high-quality solutions
              tailored to the needs of our customers.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:underline">Consulting</a></li>
              <li><a href="#" className="hover:underline">Development</a></li>
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Training</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-400">
              Email: info@example.com <br />
              Phone: +1 234 567 890
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default ProfileComponent;

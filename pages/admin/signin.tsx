'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';

const Signin: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminType, setAdminType] = useState('superadmin');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminTypeError, setAdminTypeError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdminType(e.target.value);
    setAdminTypeError('');
  };

  const validateFields = () => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Admin type validation
    if (!adminType) {
      setAdminTypeError('Admin type is required');
      isValid = false;
    } else {
      setAdminTypeError('');
    }

    return isValid;
  };

  const handleSignin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setGeneralError('');

    if (!validateFields()) return;

    try {
      const response = await axios.post('/api/adminLogin', {
        email,
        password,
        adminType,
      });

      if (response.data && response.data.adminaccessToken && response.data.adminrefreshToken) {
        const { adminrefreshToken, adminaccessToken } = response.data;
        Cookies.set('adminaccessToken', adminaccessToken, { expires: 30 });
        Cookies.set('adminrefreshToken', adminrefreshToken, { expires: 30 });

        router.push('/admin/dashboard');
      } else {
        setGeneralError('Invalid credentials. Please check your inputs.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setGeneralError('An error occurred. Please try again later.');
        console.error('Error during admin login:', error.message);
      } else {
        setGeneralError('An unknown error occurred.');
        console.error('An unknown error occurred during admin login:', error);
      }
    }
  };

  const accessToken = Cookies.get('adminaccessToken');
  const refreshToken = Cookies.get('adminrefreshToken');

  useEffect(() => {
    if (accessToken && refreshToken) {
      router.push('/admin/dashboard');
    }
  }, [accessToken, refreshToken, router]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.04, pointerEvents: 'none', backgroundImage: 'url(/admin_bg.png)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <section className="xl:w-[600px] md:w-[400px] bg-transparent">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
              <img className="w-30 h-12 mr-2 opacity-70" src="/logo_airline.png" alt="logo" />
              <span className="text-white/35 text-sm">CRM®</span>
            </a>
            <div className="w-full bg-transparent rounded-xl shadow border-2 md:mt-0 sm:max-w-md xl:p-0 border-blue-950">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">Sign in to your account</h1>

                {/* Email Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    id="email"
                    className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 text-white focus:ring-blue-500/15 focus:border-blue-500/5"
                    placeholder="name@company.com"
                  />
                  {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 text-white"
                  />
                  {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                </div>

                {/* Admin Type Dropdown */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Select Role</label>
                  <select
                    id="role"
                    value={adminType}
                    onChange={handleDropdown}
                    name="role"
                    className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 text-white"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="flightoperator">Flight Operator</option>
                    <option value="cargomanager">Cargo Manager</option>
                    <option value="hoteladmin">Hotel Admin</option>
                    <option value="hradmin">HR Admin</option>
                  </select>
                  {adminTypeError && <p className="text-sm text-red-500 mt-1">{adminTypeError}</p>}
                </div>

                {/* General Error */}
                {generalError && <p className="text-sm text-red-500 mt-4">{generalError}</p>}

                <button
                  style={{ backgroundColor: '#8C68CD' }}
                  type="submit"
                  onClick={handleSignin}
                  className="w-full text-white text-xl font-extrabold bg-primary-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Signin;

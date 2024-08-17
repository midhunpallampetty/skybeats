"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import OtpModal from '../components/otpModal';
import Link from "next/link";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/graphql/mutations/userSignupMutation";

const validateUsername = (username: string) => {
  if (username.length < 4) {
    return 'Username must be at least 4 characters long';
  }
  return '';
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

const Signup: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState({ username: '', email: '', password: '' });
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [userSignup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  useEffect(() => {
    if (!vantaEffect && myRef.current) {
      setVantaEffect(
        FOG({
          el: myRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x202f9f,
          midtoneColor: 0xb3ded,
          lowlightColor: 0x2e2354,
          baseColor: 0x1c1c4f,
          speed: 4,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle Signup Function
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate inputs
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (usernameError || emailError || passwordError) {
      setCustomError({ username: usernameError, email: emailError, password: passwordError });
      return;
    }

    try {
      console.log(email, password, username, "data reached yahooooo~");
      const { data } = await userSignup({
        variables: {
          username,
          email,
          password,
        },
      });
      console.log("Signup Successful", data);

      setIsOtpModalOpen(true);
    } catch (error) {
      console.log("Error during signup", error);
    }
  };

  return (
    <div
      ref={myRef}
      className={`h-screen overflow-hidden flex flex-col bg-[#0E1139] text-white`}
    >
      <div className="absolute top-0 bottom-0 right-0 mt-4 ml-4 hidden sm:block">
        <Image
          src="/hero-shape-2.svg"
          width={700}
          height={600}
          className="opacity-10"
          alt="Shape"
        />
      </div>
      <div className="absolute top-0 bottom-0 left-0 mt-4 ml-4 hidden sm:block">
        <Image
          src="/footer-shape-2.svg"
          width={500}
          height={300}
          className="opacity-10"
          alt="Shape"
        />
      </div>
      <div className="absolute top-0 bottom-0 left-0 mt-4 ml-4 hidden sm:block">
        <Image
          src="/hero-shape-1.svg"
          width={500}
          height={300}
          className="opacity-10"
          alt="Shape"
        />
      </div>
      <div className="absolute top-0 left-0 mt-4 ml-4 hidden sm:block">
        <Image
          src="/footer-shape-1.svg"
          width={500}
          height={300}
          className="opacity-10"
          alt="Shape"
        />
      </div>
      <div className="absolute top-0 right-0 mt-4 ml-4 hidden sm:block">
        <Image
          src="/footer-shape-1.svg"
          width={500}
          height={300}
          className="opacity-10"
          alt="Shape"
        />
      </div>

      <nav className={`fixed w-full z-20 top-0 left-0 bg-transparent`}>
        <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/logo_airline.png"
              width={140}
              height={40}
              className="h-8"
              alt="Logo"
            />
          </Link>
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
            <label className="inline-flex items-center cursor-pointer"></label>
          </div>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zM3 10a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zM3 15a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full">
        <div
          className={`w-full max-w-md border border-white/20 lg:w-[450px] rounded-lg shadow `}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              className={`text-xl font-bold leading-tight text-white md:text-2xl `}
            >
              Register as New Account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setCustomError({ ...customError, username: validateUsername(e.target.value) });
                  }}
                  name="username"
                  id="username"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="user123"
                  
                />
                <span className="text-red-500 text-xs">{customError.username}</span>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`block mb-2 text-sm font-medium text-white`}
                >
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCustomError({ ...customError, email: validateEmail(e.target.value) });
                  }}
                  name="email"
                  id="email"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  
                />
                <span className="text-red-500 text-xs">{customError.email}</span>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className={`block mb-2 text-sm font-medium text-white`}
                >
                  Your password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setCustomError({ ...customError, password: validatePassword(e.target.value) });
                  }}
                  name="password"
                  id="password"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="••••••••"
                />
                <span className="text-red-500 text-xs">{customError.password}</span>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-extrabold"
              >
                Register
              </button>
              {error && (
                <p className="text-red-500 mb-4">Error: {error.message}</p>
              )}
              <div className="text-sm font-medium text-white dark:white-black">
                Already Registered?{" "}
                <Link
                  href="/user/signin"
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Log In to account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <OtpModal
        email={email}
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </div>
  );
};

export default Signup;

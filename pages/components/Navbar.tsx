"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Component() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = Cookies.get('jwtToken');

  useEffect(() => {
    if (router.query.userEmail || router.query.googleauth || token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [router.query, token]);

  const handleLogout = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('userId');
    router.push("/");
  };

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-950  shadow-white/40 shadow-inner fixed w-full z-20 top-0 start-0 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo_airline.png" width={140} height={12} className="h-8" alt="Airline Logo" />
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Log Out
            </button>
          ) : (
            <Link href="/user/signin">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Sign In
              </button>
            </Link>
          )}
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-blue-700 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
            {[
              { name: "Flights", href: "/user/flight/listflights"},
              { name: "Cargo", href: "/", submenu: [
                { name: "Request Cargo", href: "/user/cargo/RequestCargo" },
                { name: "Track Cargo", href: "/user/cargo/TrackCargo" },
                { name: "All Cargos", href: "/user/cargo/allCargoRequests" },
              ]},
              { name: "Hotels", href: "/hotel", submenu: [
                { name: "Book Hotels", href: "/hotel" },
                { name: "Booking History", href: "/hotel/hotelHistory" },
              ]},
              { name: "Careers", href: "/user/careers", submenu: [
                { name: "Job Openings", href: "/user/careers" },
                
              ]},
              { name: "Contact Us", href: "/contact"},
              { name: "Chat Support", href: "/user/clientChat" },
            ].map((item) => (
              <li key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="block py-2 px-3 text-white rounded hover:bg-blue-900 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <ul className="absolute left-0 hidden mt-2 space-y-2 bg-white border rounded-md shadow-lg group-hover:block md:w-48">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.name}>
                        <Link
                          href={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeMobileMenu}
                        >
                          {subitem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="relative group">
              <Link
                href="/user/profile"
                className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                onClick={closeMobileMenu}
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://miro.medium.com/v2/resize:fit:1400/1*VcrrNXYOXbtnZqQ9R_Svbw.png"
                  alt="User profile"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
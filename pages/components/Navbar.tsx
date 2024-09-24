"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
const Navbar: React.FC = () => {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
const token=Cookies.get('jwtToken')
  useEffect(() => {
    if (router.query.userEmail || router.query.googleauth || token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [router.query]);

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

  return (
    <>
      <nav className="bg-white  shad dark:bg-gray-900 fixed rounded-md  shadow-white/30 shadow-inner w-full z-20 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/logo_airline.png"
              width={140}
              height={12}
              className="h-8"
              alt="Flowbite Logo"
            />
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isLoggedIn  ? (
              <button
                onClick={handleLogout}
                className="text-white bg-blue-200 hover:bg-blue-200/10 focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm px-5 py-3 text-center dark:bg-blue-600/20 rounded-2xl font-extrabold dark:hover:bg-blue-600/40 dark:focus:ring-blue-950"
              >
                Log Out
              </button>
            ) : (
              <Link href="/user/signin">
                <button
                  type="button"
                  className="text-white bg-blue-200 hover:bg-blue-200/10 focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm px-5 py-3 text-center dark:bg-blue-600/20 rounded-2xl font-extrabold dark:hover:bg-blue-600/40 dark:focus:ring-blue-950"
                >
                  Sign In
                </button>
              </Link>
            )}
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
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-16 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-blue-950 md:dark:bg-gray-900 dark:border-gray-700">
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("home")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Home
                </Link>
                {activeMenu === "home" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Submenu 1
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Submenu 2
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("flights")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/user/flight/listflights"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Flights
                </Link>
                {activeMenu === "flights" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/user/flight/domestic"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Domestic Flights
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/user/flight/international"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        International Flights
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/user/flight/bookingHistory"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Booking History
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("cargo")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Cargo
                </Link>
                {activeMenu === "cargo" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/user/cargo/RequestCargo"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Request Cargo
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/user/cargo/TrackCargo"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Track Cargo
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("hotels")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/hotel"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Hotels
                </Link>
                {activeMenu === "hotels" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/hotel"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Book Hotels
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/hotel/hotelHistory"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Booking History
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/hotel/hotelHistory"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Booking History
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("careers")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/user/careers"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Careers
                </Link>
                {activeMenu === "careers" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/careers/jobs"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Job Openings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/careers/internships"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Internships
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("contact")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/contact"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Contact Us
                </Link>
                {activeMenu === "contact" && (
                  <ul className="absolute bg-white dark:bg-blue-950 shadow-lg rounded-lg mt-2  min-w-[200px]">
                    <li>
                      <Link
                        href="/contact/service"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Customer Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact/support"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Support
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="relative group"
                onMouseEnter={() => handleMouseEnter("gallery")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/user/view_gallery"
                  className="block py-2 px-3 text-xl md:text-lg text-white rounded md:bg-transparent md:p-0 font-extrabold"
                  aria-current="page"
                >
                  Gallery
                </Link>
                
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

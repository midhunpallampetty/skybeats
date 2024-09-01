import React, { useEffect } from 'react'
import Link from 'next/link';
import { useState } from 'react';
const Adminaside:React.FC=()=> {
   const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

   const toggleSubmenu = () => {
     setIsSubmenuOpen(!isSubmenuOpen);
   };
 useEffect(()=>{
   let timer;
   if(isSubmenuOpen){
      timer=setTimeout(() => {
         setIsSubmenuOpen(false)
      }, 15000);
   }
 })
  return (
    <>
     <aside
    id="logo-sidebar"
    className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 sm:w-72"
    aria-label="Sidebar"
 >
    <div className="h-full px-3 py-4 overflow-y-auto bg-transparent border border-white/10 rounded">
       <a href="https://flowbite.com/" className="flex items-center ps-2.5 mb-5">
          <img src="/logo_airline.png" className="h-6 me-3 sm:h-7" alt="Flowbite Logo" />
          <span className="text-white/35 text-sm">CRM®</span>
       </a>
       <ul className="space-y-2 p-4 mt-10 font-medium">
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3L280 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 204.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Dashboard</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M112 0C85.5 0 64 21.5 64 48l0 48L16 96c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 208 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 160l-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l16 0 176 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 224l-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 144 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 288l0 128c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L112 0zM544 237.3l0 18.7-128 0 0-96 50.7 0L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Cargo</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z" /></svg>               </svg>
                   <div className="relative">
      <span
        className="flex-1 ms-4 text-2xl whitespace-nowrap cursor-pointer"
        onClick={toggleSubmenu}
      >
        Flights
      </span>
      {isSubmenuOpen && (
        <div className="absolute left-0 mt-2 w-48  bg-blue-950 shadow-lg rounded-md">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-blue-800/50 cursor-pointer">Domestic Flights</li>
            <li className="px-4 py-2 hover:bg-blue-800/50 cursor-pointer">International Flights</li>
            <li className="px-4 py-2 hover:bg-blue-800/50 cursor-pointer">Chartered Flights</li>
            <Link href='/admin/flightBookings'>            <li className="px-4 py-2 hover:bg-blue-800/50 cursor-pointer">Booked Flights</li>
            </Link>

          </ul>
        </div>
      )}
    </div>                
    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium  bg-blue-100 rounded-full text-blue-300">3</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M192 0c-17.7 0-32 14.3-32 32l0 32 0 .2c-38.6 2.2-72.3 27.3-85.2 64.1L39.6 228.8C16.4 238.4 0 261.3 0 288L0 432l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48 320 0 0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48 0-144c0-26.7-16.4-49.6-39.6-59.2L437.2 128.3c-12.9-36.8-46.6-62-85.2-64.1l0-.2 0-32c0-17.7-14.3-32-32-32L192 0zM165.4 128l181.2 0c13.6 0 25.7 8.6 30.2 21.4L402.9 224l-293.8 0 26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zM96 288a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm288 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Cabs</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Offers</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium  bg-blue-100 rounded-full  text-blue-300">3</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" /></svg>               </svg>
               <Link href='/admin/super_adminDashboard'>
               <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Users</span>

               </Link>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Staffs</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5  transition duration-75 text-gray-400  group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M48 256C48 141.1 141.1 48 256 48c63.1 0 119.6 28.1 157.8 72.5c8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0C114.6 0 0 114.6 0 256l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6c-15.2 5-18.7 23.7-8.3 35.9c7.1 8.3 18.8 10.8 29.4 7.9c10.6-2.9 21.8-4.4 33.4-4.4c70.7 0 128 57.3 128 128l0 24.9c0 25.2-1.5 50.3-4.4 75.3c-1.7 14.6 9.4 27.8 24.2 27.8c11.8 0 21.9-8.6 23.3-20.3c3.3-27.4 5-55 5-82.7l0-24.9c0-97.2-78.8-176-176-176zM150.7 148.7c-9.1-10.6-25.3-11.4-33.9-.4C93.7 178 80 215.4 80 256l0 24.9c0 24.2-2.6 48.4-7.8 71.9C68.8 368.4 80.1 384 96.1 384c10.5 0 19.9-7 22.2-17.3c6.4-28.1 9.7-56.8 9.7-85.8l0-24.9c0-27.2 8.5-52.4 22.9-73.1c7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96l0 24.9c0 35.9-4.6 71.5-13.8 106.1c-3.8 14.3 6.7 29 21.5 29c9.5 0 17.9-6.2 20.4-15.4c10.5-39 15.9-79.2 15.9-119.7l0-24.9c0-28.7 23.3-52 52-52s52 23.3 52 52l0 24.9c0 36.3-3.5 72.4-10.4 107.9c-2.7 13.9 7.7 27.2 21.8 27.2c10.2 0 19-7 21-17c7.7-38.8 11.6-78.3 11.6-118.1l0-24.9c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3C267.9 411.9 280 346.7 280 280.9l0-24.9z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Sign In</span>
             </a>
          </li>
          <li>
             <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white hover:bg-blue-950/50 group"
             >
                <svg
                   className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-white"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528 160l0 256c0 8.8-7.2 16-16 16l-192 0c0-44.2-35.8-80-80-80l-64 0c-44.2 0-80 35.8-80 80l-32 0c-8.8 0-16-7.2-16-16l0-256 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM272 256a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm104-48c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0z" /></svg>               </svg>
                <span className="flex-1 ms-4 text-2xl whitespace-nowrap">Sign Up</span>
             </a>
          </li>
       </ul>
    </div>
 </aside>
    
    </>
  )
}

export default Adminaside
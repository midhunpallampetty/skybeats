'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { ADMIN_LOGIN_MUTATION } from '@/graphql/mutations/adminLoginMutation';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
const Signin: React.FC = () => {
  const router=useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminType, setadminType] = useState('superadmin');
  const [adminLogin, { loading, error, data }] = useMutation(ADMIN_LOGIN_MUTATION);
  const handleDropdown = (e: any) => {
    setadminType(e.target.value);
  };
  const handleSignin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!email || !password || !adminType) {
        alert('All fields (email, password, admin type) must be provided');
        return;
      }
  
      const { data } = await adminLogin({
        variables: {
          email,
          password,
          adminType
        }
      });
  
      if (data && data.adminLogin) {
        const { token } = data.adminLogin;
        if(token){
          Cookies.set('jwtToken', token, { expires: 30 }); 
        }else{
          alert('No token received. Please check your login credentials.');
        }
        console.log('Login success', data.adminLogin);
        if(adminType!=''){
          router.push('/admin/dashboard');

        }

      } else {
        alert('Invalid credentials. Please check your email, password, and admin type.');
      }
    } catch (error) {
      console.error('Operation of admin login not successful', error);
      alert('Can\'t perform admin login operation. Please try again.');
    }
  };
 
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.04,
    pointerEvents: 'none' as 'none',
    backgroundImage: 'url(/admin_bg.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div style={contentStyle}>
        <section className=" xl:w-[600px] md:w-[400px] bg-transparent " style={{ position: 'relative', zIndex: 10 }}>
          <div className="flex flex-col items-center justify-center  px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold  text-white">
              <img className="w-30 h-12 mr-2 opacity-70" src="/logo_airline.png" alt="logo" />
              <span className='text-white/35 text-sm'>CRM®</span>
            </a>
            <div className="w-full bg-transparent rounded-xl shadow  border-2 md:mt-0 sm:max-w-md xl:p-0  border-blue-950">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                  Sign in to your account
                </h1>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                  <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" id="email" className=" border   rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 text-white focus:ring-blue-500/15 focus:border-blue-500/5" placeholder="name@company.com" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                  <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className=" border  text-blue-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">Select Role</label>
                  <select id="role" value={adminType} onChange={handleDropdown} name="role" className=" border   rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-blue-950 border-blue-600 placeholder-blue-400 text-white focus:ring-blue-500 dark:focus:border-blue-500">

                    <option value="superadmin">Super Admin</option>
                    <option value="flightoperator">Flight Operator</option>
                    <option value="cargomanager">Cargo Manager</option>
                    <option value="hoteladmin">Hotel Admin</option>
                    <option value="cabadmin">Cab Admin</option>
                    <option value="hradmin">HR Admin</option>


                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <button
                  style={{ backgroundColor: '#8C68CD' }}
                  type="submit" onClick={handleSignin}
                  className="w-full text-white text-xl font-extrabold bg-primary-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:focus:ring-primary-800"
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

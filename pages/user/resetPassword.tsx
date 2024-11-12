'use client';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

import Link from 'next/link';
const RESET_PASSWORD = gql`
  mutation resetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; 

  const [newPassword, setNewPassword] = useState('');
  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await resetPassword({ variables: { token, newPassword } });
      Swal.fire({
        title: 'Success',
        text: 'Password successfully Updated',
        icon: 'success',
        
      });
      router.push('/user/signin');
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'Password Reset Failed',
        
        
      });
    }
  };
  useEffect(() => {
    const handlePopState = () => {
      // Redirect user back to the locked page
      router.replace('/locked-page'); // Use your page's route
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
  return (
    <>
    <Navbar/>
    <div className="mt-52">
  <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full">
    <div className="w-full max-w-md bg-white text-black lg:w-[450px] rounded-lg shadow">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight text-black md:text-2xl">
          Add new Password
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-black"
            >
New Password            
</label>
            <input
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              name="email"
              id="email"
              className="block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white font-extrabold h-[50px] rounded-lg w-[150px] bg-blue-950"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>

          <div className="w-full flex justify-center items-center">
            {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}
          </div>

          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Don't have an account?{' '}
            <Link
              href="/user/signup"
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Create account
            </Link>
          </div>

          {data && data.requestPasswordReset && <p>{data.requestPasswordReset.message}</p>}
        </form>
      </div>
    </div>
  </section>
</div>
      
    </>
  );
}

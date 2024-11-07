import React from 'react';
import { useRouter } from 'next/router';
export default function ThanksPayment() {
  const router=useRouter()
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden text-center p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Thank You!</h1>
        <p className="text-xl text-gray-700 mb-6">
          Your booking has been confirmed.
        </p>
        <button className='text-white bg-blue-900 p-3 py-2 font-extrabold rounded-lg' onClick={()=>router.push('/')}>Home</button>
        <p className="text-gray-600">
          We appreciate your trust in us and look forward to providing you with a great travel experience.
        </p>
      </div>
    </div>
  );
}

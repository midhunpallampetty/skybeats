// components/OtpModal.tsx

'use client';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_OTP_MUTATION } from '@/graphql/mutations/verifyOtpMutation';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface OtpModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ email, isOpen, onClose }) => {
  const [otp, setOtp] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [verifyOtp, { loading, error }] = useMutation(VERIFY_OTP_MUTATION);
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleVerify = async () => {
    try {
      const { data } = await verifyOtp({
        variables: {
          email,
          otp,
        },
      });

      console.log('OTP Verified Successfully', data);

      router.push('/');
    } catch (error) {
      console.log('Error during OTP verification', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-950">Enter OTP</h2>
        <p className="mb-4 text-black">
          We have sent an OTP to your email: <span className="font-semibold">{email}</span>
        </p>
        <div className="relative">
          <input
            type={isVisible ? 'text' : 'password'}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded-lg mb-4"
            placeholder="Enter OTP"
          />
          <button
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            aria-label={isVisible ? 'Hide OTP' : 'Show OTP'}
          >
            <FontAwesomeIcon icon={isVisible ? faEyeSlash : faEye} size="lg" />
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}
        <button
          onClick={handleVerify}
          className="w-full py-2.5 px-5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-extrabold"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 px-5 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 font-extrabold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpModal;

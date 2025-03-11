'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axiosInstance from '@/pages/api/utils/axiosInstance';
import { motion } from 'framer-motion';

interface JobApplicationFormProps {
  // Define any props if needed
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  cv: File | null;
}

interface Errors {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  cv: string;
}

// Renamed to match export convention (PascalCase)
const ApplyCareer: React.FC<JobApplicationFormProps> = () => {
  const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });

  const selectedJob = useSelector((state: RootState) => state.job.selectedJob);
  const router = useRouter();
  const isSubmitting = useRef(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cv: null,
  });
  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cv: '',
  });
  // For client-side window access
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const userId = Cookies.get('userId');
  
  // Set window dimensions on client side only
  useEffect(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (!selectedJob) {
      router.push('/');
    }
  }, [selectedJob, router]);

  useEffect(() => {
    if (!userId) {
      router.push('/');
    }
  }, [userId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = /\.(pdf|doc|docx)$/i;
      if (!allowedExtensions.test(file.name)) {
        setErrors(prev => ({ ...prev, cv: 'Only PDF, DOC, or DOCX files are allowed.' }));
        return;
      }
      setFormData({ ...formData, cv: file });
      setErrors(prev => ({ ...prev, cv: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Errors = {
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      cv: '',
    };

    if (!/^[A-Za-z]{4,}$/.test(formData.name)) {
      newErrors.name = 'Name must be at least 4 letters long and contain only alphabets.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be a positive numeric value.';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter cannot be empty.';
    }

    if (!formData.cv) {
      newErrors.cv = 'Please upload a CV in PDF, DOC, or DOCX format.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;

    if (!validateForm()) return;

    const { name, email, phone, coverLetter, cv } = formData;

    try {
      isSubmitting.current = true;

      let cvUrl = '';
      if (cv) {
        cvUrl = await uploadToS3(cv);
      }

      const applicationData = {
        name,
        email,
        phone,
        coverLetter,
        cv: cvUrl,
        userId,
        jobPost: selectedJob?.designation,
      };

      const response = await axiosInstance.post('/applyJob', applicationData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: `Your application for the position of ${selectedJob?.designation} has been submitted successfully.`,
        });
        router.push('/');
      }
    } catch (error: any) { // Type annotation for error
      console.error('Error:', error);
      
      if (error && 'response' in error) {
        const { response } = error;
        if (response?.status === 400 && response.data.error === 'All fields are required.') {
          Swal.fire({
            icon: 'warning',
            title: 'Incomplete Data',
            text: 'Please fill out all required fields before submitting your application.',
          });
        } else if (response?.status === 500) {
          Swal.fire({
            icon: 'warning',
            title: 'Already Applied!',
            text: 'You have already applied for this job.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      isSubmitting.current = false;
    }
  };

  const isFetching2 = useRef(false);
  const urlCache = useRef<{ [key: string]: string }>({});

  const getPresignedUrl = async (filename: string, filetype: string) => {
    const cacheKey = `${filename}_${filetype}`;
    
    if (urlCache.current[cacheKey]) {
      return urlCache.current[cacheKey];
    }
    
    if (isFetching2.current) {
      throw new Error('Already fetching pre-signed URL');
    }
    
    try {
      isFetching2.current = true;
      const response = await axiosInstance.post(
        '/awss3',
        { filename, filetype },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const uploadUrl = response.data.uploadUrl;
      urlCache.current[cacheKey] = uploadUrl;
      return uploadUrl;
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
      throw new Error('Failed to get pre-signed URL');
    } finally {
      isFetching2.current = false;
    }
  };

  const uploadToS3 = async (file: File) => {
    const filename = file.name;
    const filetype = file.type;
    try {
      const uploadUrl = await getPresignedUrl(filename, filetype);
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': filetype,
        },
      });
      return uploadUrl.split('?')[0];
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const truncateDescription = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <>
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[40vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-indigo-900/70 to-blue-950/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('https://airline-datacenter.s3.ap-south-1.amazonaws.com/e9f1d460-5e31-4a2c-9348-85d8ba317708.jpeg')] bg-cover bg-center opacity-10" />
        
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0 ? "bg-blue-400/30 w-3 h-3" : 
                i % 3 === 1 ? "bg-indigo-400/20 w-2 h-2" : 
                "bg-purple-400/20 w-4 h-4"
              }`}
              initial={{ 
                x: Math.random() * windowDimensions.width, 
                y: Math.random() * windowDimensions.height 
              }}
              animate={{ 
                x: Math.random() * windowDimensions.width, 
                y: Math.random() * windowDimensions.height,
                opacity: [0.1, 0.5, 0.1],
                scale: [1, i % 4 === 0 ? 1.8 : 1.3, 1]
              }}
              transition={{ 
                duration: 6 + Math.random() * 12, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-100">
              Apply for this Job
            </h1>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mt-24 mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Job Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-950/60 shadow-lg rounded-lg p-6 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Job Details</h2>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Job Title:</span>
              <span className="text-white">{selectedJob?.designation}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Location:</span>
              <span className="text-white">FullTime</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Employment Type:</span>
              <span className="text-white">In Flight</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-white">Job Description:</span>
              <span className="text-white">
                {selectedJob?.description 
                  ? truncateDescription(selectedJob.description, 100) 
                  : 'Description not available'}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Job Application Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-950/60 shadow-lg rounded-lg p-6 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Apply for this Job</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-blue-400 rounded-md bg-blue-900/30 text-white"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-blue-400 rounded-md bg-blue-900/30 text-white"
                placeholder="johndoe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-blue-400 rounded-md bg-blue-900/30 text-white"
                placeholder="+1 234 567 890"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-blue-400 rounded-md bg-blue-900/30 text-white"
                placeholder="Write your cover letter here..."
                rows={4}
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-xs mt-1">{errors.coverLetter}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Upload CV</label>
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 block w-full text-white"
              />
              {errors.cv && (
                <p className="text-red-500 text-xs mt-1">{errors.cv}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer Code */}
      <footer className="bg-gray-900 mt-20 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-sm text-gray-400">
              We are a leading company providing top-notch services across various
              industries. Our goal is to deliver high-quality solutions tailored
              to the needs of our customers.
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

export default ApplyCareer;
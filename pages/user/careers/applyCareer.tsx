'use client';
import React, { useState,useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
const JobApplicationForm = () => {
    const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });
    const selectedJob = useSelector((state: RootState) => state.job.selectedJob);
    const router=useRouter()
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        cv: null,
    });

    const truncateDescription = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, cv: file }); 
        }
    };

    const userId=Cookies.get('userId');
    const getPresignedUrl = async (filename: string, filetype: string) => {
        const response = await fetch('/api/awss3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename, filetype }),
        });

        if (!response.ok) {
            throw new Error('Failed to get pre-signed URL');
        }

        const data = await response.json();
        return data.uploadUrl;
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
            return uploadUrl.split('?')[0]; // Return the URL without query parameters
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // Rethrow the error to be handled in handleSubmit
        }
    };
useEffect(()=>{
if(!selectedJob){
    router.push('/')
}
},[selectedJob])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare form data to send to the API
        const { name, email, phone, coverLetter, cv } = formData;

        try {
            let cvUrl = '';
            if (cv) {
                cvUrl = await uploadToS3(cv); // Upload the CV and get the S3 URL
            }

            const applicationData = {
                name,
                email,
                phone,
                coverLetter,
                cv: cvUrl, 
                userId,
                jobPost:selectedJob?.designation,
            };

            const response = await fetch('/api/applyJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            if (response.ok) {
                const data = await response.json();
                Swal.fire('Application Submitted!', `Your application for ${data.name} has been submitted successfully.`);
                console.log('Application submitted:', data);
                router.push('/')
            } else {
                console.error('Failed to submit application,User Alreadty Applied');
                Swal.fire('Error!', 'Failed to submit your application. Please try again later.User Alreadty Applied', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error!', 'An unexpected error occurred. Please try again later.', 'error');
        }
    };
    useEffect(()=>{
        console.log(userId)
        if(!userId){
          router.push('/')
        }
        },[userId])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mt-24 mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Job Details */}
                <div className="bg-white shadow-md rounded-md p-4">
                    <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
                    <div className="space-y-3">
                        <p><strong>Job Title:</strong> {selectedJob?.designation}</p>
                        <p><strong>Location:</strong> FullTime</p>
                        <p><strong>Employment Type:</strong> In Flight</p>
                        <p><strong>Job Description:</strong> {selectedJob?.description ? truncateDescription(selectedJob.description, 100) : 'Description not available'}</p>
                    </div>
                </div>

                {/* Right Side: Job Application Form */}
                <div className="bg-white shadow-md rounded-md p-4">
                    <h2 className="text-2xl font-semibold mb-4">Apply for this Job</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="johndoe@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="+1 234 567 890"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Write your cover letter here..."
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload CV</label>
                            <input
                                type="file"
                                name="cv"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-gray-700"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Code */}
            <footer className="bg-gray-800/20 shadow-white/50 shadow-inner rounded-lg text-white py-8">
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
                        <ul className="text-sm text-black space-y-2">
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

export default JobApplicationForm;

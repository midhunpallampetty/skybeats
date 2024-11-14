import React, { useEffect, useState } from 'react';
import { FileText, Mail, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import axios from 'axios';


interface JobApplication {
    id: string;
    name: string;
    email: string;
    phone: string;
    coverLetter: string;
    cv: string;
    Date: string;
    createdAt: string;
}


const pageSize = 5;

export default function AppliedJobs() {
    const Navbar = dynamic(() => import('../../components/Navbar'));
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'Date' | 'createdAt'>('createdAt');
    const [sortedApplications, setSortedApplications] = useState<JobApplication[]>([]);

    const userId = Cookies.get('userId');

    // Function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await axios.post('/api/getApplied', {
                    userId,
                    headers: { 'Content-Type': 'application/json' }
                });
                setJobApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications:', error);
            }
        };

        if (userId) fetchAppliedJobs();
    }, [userId]);

    useEffect(() => {
        // Sort applications based on the selected field
        const sortedData = [...jobApplications].sort((a, b) => {
            if (sortField === 'Date') {
                return new Date(b.Date).getTime() - new Date(a.Date).getTime();
            } else {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
        setSortedApplications(sortedData);
    }, [jobApplications, sortField]);
    

    // Paginate applications
    const paginatedApplications = sortedApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Handler for pagination
    const handlePageChange = (page: number) => setCurrentPage(page);

    // Handler for sorting
    const handleSortChange = (field: 'Date' | 'createdAt') => setSortField(field);

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-10 bg-navy-50 mt-20 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-white">Applied Jobs</h1>

                {/* Sorting Controls */}
                <div className="flex items-center mb-4">
                    <label htmlFor="sort" className="text-white mr-2">Sort By:</label>
                    <select
                        id="sort"
                        value={sortField}
                        onChange={(e) => handleSortChange(e.target.value as 'Date' | 'createdAt')}
                        className="px-3 py-2 rounded bg-navy-200 text-navy-800"
                    >
                        <option value="Date">Application Date</option>
                        <option value="createdAt">Created At</option>
                    </select>
                </div>

                {/* Job Applications List */}
                <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                    {paginatedApplications.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-navy-200">
                            <div className="bg-navy-100 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-navy-900">{job.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-navy-600">
                                            <Mail className="h-4 w-4" />
                                            <span>{job.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-navy-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{job.phone}</span>
                                        </div>
                                    </div>
                                    <span className="bg-navy-200 text-navy-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {formatDate(job.Date)}
                                    </span>
                                </div>
                            </div>
                            <div className="px-6 py-4">
                                <div className="grid gap-4">
                                    <div>
                                        <h3 className="font-semibold mb-2 text-navy-900">Cover Letter</h3>
                                        <p className="text-sm text-navy-700">{job.coverLetter}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-navy-600" />
                                        <a
                                            href={job.cv}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-navy-600 hover:text-navy-800 hover:underline"
                                        >
                                            View CV
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-navy-200 text-navy-800 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-white">Page {currentPage}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * pageSize >= sortedApplications.length}
                        className="px-4 py-2 bg-navy-200 text-navy-800 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

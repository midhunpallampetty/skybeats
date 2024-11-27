import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const withAuthorization = (WrappedComponent: React.FC, requiredRole: string) => {
    return (props: any) => {
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();
        const token = Cookies.get('adminaccessToken');

        useEffect(() => {
            if (!token) {
                router.push('/admin/signin');
                return;
            }

            const verifyToken = async () => {
                try {
                    const response = await fetch('/api/tokenVerify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });
                    const data = await response.json();

                    if (data === requiredRole || requiredRole === 'superadmin') {
                        setIsAuthorized(true);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            verifyToken();
        }, [token, requiredRole, router]);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading...</p>
                </div>
            );
        }

        if (!isAuthorized) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center text-red-500">
                        <h1 className="text-4xl font-bold">Access Denied</h1>
                        <p className="mt-4 text-lg">You do not have permission to access this page.</p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthorization;

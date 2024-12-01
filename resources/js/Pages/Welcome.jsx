import React from 'react';
import { Head } from '@inertiajs/react';
import WelcomeNavbar from '../Components/WelcomeNavbar';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <WelcomeNavbar />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="text-4xl font-bold">Welcome</h1>
                            
                    </div>
                </div>
            </div>
        </>
    );
}
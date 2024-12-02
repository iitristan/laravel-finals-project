import React from 'react';
import { Head } from '@inertiajs/react';
import WelcomeNavbar from '../Components/WelcomeNavbar';

const Welcome: React.FC = () => {
    return (
        <>
            <Head title="Welcome" />
            <WelcomeNavbar />
        </>
    );
}

export default Welcome;
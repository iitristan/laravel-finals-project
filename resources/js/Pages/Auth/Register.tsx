import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string>('');

    const validateForm = () => {
        if (!data.name || !data.email || !data.password || !data.password_confirmation) {
            setFormError('All fields are required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(data.password)) {
            setFormError(
                'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
            );
            return false;
        }

        if (data.password !== data.password_confirmation) {
            setFormError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        
        if (!validateForm()) return;

        post('/register', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
            onError: (errors) => {
                if (errors.email) {
                    setFormError(errors.email);
                } else if (errors.password) {
                    setFormError(errors.password);
                } else if (errors.name) {
                    setFormError(errors.name);
                } else {
                    setFormError('Registration failed. Please try again later.');
                }
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <Head title="Register" />
            <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
                <p className="text-center text-gray-400 mb-6">Sign up to get started</p>
                <form onSubmit={handleSubmit}>
                    {formError && (
                        <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-400 text-red-700">
                            {formError}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={processing}
                    >
                        {processing ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <Link
                        href="/login"
                        className="font-medium w-full mt-4 block text-center text-indigo-500 hover:text-indigo-400 py-2 px-4 rounded-md transition"
                    >
                        Return to Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

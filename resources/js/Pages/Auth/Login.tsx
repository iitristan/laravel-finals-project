import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

interface LoginForm {
    email: string;
    password: string;
    remember?: boolean;
}

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string>('');

    const validateForm = () => {
        if (!data.email || !data.password) {
            setFormError('All fields are required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        
        if (!validateForm()) return;

        post('/login', {
            onSuccess: () => {
                reset('password');
            },
            onError: (errors) => {
                if (errors.credentials) {
                    setFormError(errors.credentials);
                    setData('password', '');
                } else if (errors.email) {
                    setFormError(errors.email);
                    setData('password', '');
                } else if (errors.password) {
                    setFormError(errors.password);
                    setData('password', '');
                } else {
                    setFormError('An unexpected error occurred. Please try again.');
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <Head title="Login" />
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-white mb-8">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                        <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-400 text-red-700">
                            {formError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="you@example.com"
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
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-gray-300 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-500 hover:text-indigo-400">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link
                        href="/register"
                        className="font-medium text-indigo-500 hover:text-indigo-400 transition"
                    >
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

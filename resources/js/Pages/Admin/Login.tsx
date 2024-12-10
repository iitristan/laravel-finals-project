import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');
        
        if (!validateForm()) return;

        post('/admin/login', {
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
                    setFormError('Invalid administrator credentials. Please contact system administrator.');
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <Head title="Admin Login" />
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
                {formError && (
                    <div className="p-4 rounded-md bg-red-50 border border-red-400 text-red-700">
                        {formError}
                    </div>
                )}
                <div>
                    <h2 className="text-center text-3xl font-extrabold">
                        Admin Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setData('password', e.target.value)
                                }
                            />
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

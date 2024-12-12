import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { data, setData, post, processing, reset } = useForm<LoginForm>({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; credentials?: string }>({});
    const [popupMessage, setPopupMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormErrors({});
        setPopupMessage(null); // Clear previous popup message

        post('/admin/login', {
            onSuccess: () => {
                reset('password'); // Clear the password field
            },
            onError: (errors) => {
                setFormErrors(errors); // Set form-specific errors
                if (errors.credentials) {
                    setPopupMessage(errors.credentials);
                } else if (errors.email) {
                    setPopupMessage(errors.email);
                } else if (errors.password) {
                    setPopupMessage(errors.password);
                } else {
                    setPopupMessage('An unexpected error occurred. Please try again.');
                }
            },
        });
    };

    const closePopup = () => {
        setPopupMessage(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <Head title="Admin Login" />
            {popupMessage && (
                <div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={closePopup}
                >
                    <div
                        className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>{popupMessage}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-extrabold">Admin Login</h2>
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
                            {formErrors.email && (
                                <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>
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
                            {formErrors.password && (
                                <div className="text-red-500 text-sm mt-1">{formErrors.password}</div>
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

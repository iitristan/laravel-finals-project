import React from 'react';
import { useForm } from '@inertiajs/react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const Register: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md md:w-96 w-full p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                        disabled={processing}
                    >
                        {processing ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-blue-500 hover:text-blue-600">
                        Already have an account? Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register;

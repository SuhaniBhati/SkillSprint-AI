import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { FiEye, FiEyeOff } from 'react-icons/fi';

import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate();

    const {
        loading,
        register
    } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    /**
     * Handle Input Change
     */
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error while typing
        if (error) {
            setError('');
        }
    };

    /**
     * Handle Form Submit
     */
    const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading || isSubmitting) return;

    setIsSubmitting(true);

    try {

        await register(formData);

        navigate('/login');

    } catch (err) {

        const backendMessage =
            err?.response?.data?.message;

        const validationError =
            err?.response?.data?.errors?.[0]?.msg;

        setError(
            backendMessage ||
            validationError ||
            'Registration failed. Please try again.'
        );

    } finally {

        setIsSubmitting(false);

    }
  };


    return (

        <AuthLayout
            title="Create Account"
            subtitle="Start optimizing your career journey with AI."
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Error Message */}
                {
                    error && (
                        <div
                            className="
                                bg-red-50
                                border
                                border-red-200
                                text-red-600
                                px-4
                                py-3
                                rounded-xl
                                text-sm
                            "
                        >
                            {error}
                        </div>
                    )
                }

                {/* Username */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>

                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-gray-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#970747]
                            transition-all
                            disabled:bg-gray-100
                            disabled:cursor-not-allowed
                        "
                    />

                </div>

                {/* Email */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-gray-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#970747]
                            transition-all
                            disabled:bg-gray-100
                            disabled:cursor-not-allowed
                        "
                    />

                </div>

                {/* Password */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>

                    <div className="relative">

                        <input
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
                            name="password"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            minLength={6}
                            required
                            className="
                                w-full
                                px-4
                                py-3
                                pr-12
                                rounded-xl
                                border
                                border-gray-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#970747]
                                transition-all
                                disabled:bg-gray-100
                                disabled:cursor-not-allowed
                            "
                        />

                        {/* Toggle Password */}
                        <button
                            type="button"
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                            className="
                                absolute
                                top-1/2
                                right-4
                                -translate-y-1/2
                                text-gray-500
                                hover:text-[#970747]
                                transition-colors
                            "
                        >

                            {
                                showPassword
                                    ? <FiEyeOff size={20} />
                                    : <FiEye size={20} />
                            }

                        </button>

                    </div>

                    {/* Password Hint */}
                    <p className="text-sm text-gray-500 mt-2">
                        Password must contain at least 6 characters.
                    </p>

                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="
                        w-full
                        bg-[#970747]
                        hover:bg-[#7d063b]
                        disabled:bg-[#c45b89]
                        disabled:cursor-not-allowed
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        shadow-lg
                        transition-all
                        duration-300
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    {
                        loading || isSubmitting
                            ? (
                                <>
                                    <div
                                        className="
                                            w-5
                                            h-5
                                            border-2
                                            border-white
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        "
                                    />

                                    Creating account...
                                </>
                            )
                            : 'Create Account'
                    }

                </button>

                {/* Footer */}
                <p className="text-center text-gray-500">

                    Already have an account?{' '}

                    <Link
                        to="/login"
                        className="
                            text-[#970747]
                            font-semibold
                            hover:underline
                        "
                    >
                        Login
                    </Link>

                </p>

            </form>

        </AuthLayout>
    );
};

export default Register;
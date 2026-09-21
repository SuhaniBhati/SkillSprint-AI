import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    
    const {
        loading,
        login
    } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
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
        await login(formData);
        navigate("/home");
    } catch (err) {
        const backendMessage =
            err?.response?.data?.message;

        const validationError =
            err?.response?.data?.errors?.[0]?.msg;

        setError(
            backendMessage ||
            validationError ||
            "Login failed. Please try again."
        );
    } finally {
        setIsSubmitting(false);
    }
    };

    return (

        <AuthLayout
            title="Welcome Back"
            subtitle="Login to continue your AI-powered career journey."
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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
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

                </div>

                {/* Login Button */}
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

                                    Logging in...
                                </>
                            )
                            : 'Login'
                    }

                </button>

                {/* Footer */}
                <p className="text-center text-gray-500">

                    Don&apos;t have an account?{' '}

                    <Link
                        to="/register"
                        className="
                            text-[#970747]
                            font-semibold
                            hover:underline
                        "
                    >
                        Register
                    </Link>

                </p>

            </form>

        </AuthLayout>
    );
};

export default Login;
import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-[#fff7fb] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

                {/* LEFT SECTION */}
                <div className="hidden lg:flex flex-col justify-between bg-[#970747] p-12 text-white relative overflow-hidden">

                    {/* Decorative circles */}
                    <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-pink-400/20 rounded-full"></div>

                    <div className="absolute bottom-[-100px] left-[-80px] w-80 h-80 bg-pink-300/10 rounded-full"></div>

                    {/* Logo */}
                    <div className="z-10">
                        <div className="flex items-center gap-3">

                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#970747] text-2xl font-bold shadow-lg">
                                R
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold tracking-wide">
                                    SkillSprint AI
                                </h1>

                                <p className="text-pink-100 text-sm">
                                    AI Career Intelligence Platform
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="z-10 mt-10">

                        <h2 className="text-5xl font-bold leading-tight">
                            Build Smarter Careers With AI
                        </h2>

                        <p className="mt-6 text-pink-100 text-lg leading-relaxed max-w-md">
                            Upload resumes, analyze job descriptions,
                            identify skill gaps, generate interview questions,
                            and create ATS-optimized resumes instantly.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-4">

                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <h3 className="font-semibold text-lg">
                                    ATS Resume Analysis
                                </h3>

                                <p className="text-sm text-pink-100 mt-2">
                                    Improve resume score with AI insights.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <h3 className="font-semibold text-lg">
                                    Interview Prep
                                </h3>

                                <p className="text-sm text-pink-100 mt-2">
                                    AI-generated interview questions instantly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="z-10 text-sm text-pink-100">
                        © 2026 SkillSprint AI. All rights reserved.
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center justify-center p-8 md:p-14">

                    <div className="w-full max-w-md">

                        <div className="mb-8">

                            <h2 className="text-4xl font-bold text-[#111111]">
                                {title}
                            </h2>

                            <p className="text-gray-500 mt-3">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
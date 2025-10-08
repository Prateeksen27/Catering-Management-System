
import React from 'react';
import SignIn from '../../SignIn/SignIn';

const SignInPage = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/90 to-primary/10 text-foreground font-['Inter'] flex flex-col">
            <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">

                {/* Left Section (Brand Area) */}
                <div className="
          md:w-1/2 w-full 
          h-[40vh] md:h-full 
          bg-primary/90 
          backdrop-blur-md 
          flex flex-col items-center justify-center
          text-center md:text-left
          p-8 md:p-16 
          rounded-b-[80px] md:rounded-b-none md:rounded-r-[160px] 
          shadow-lg md:shadow-2xl
          transition-all duration-500
        ">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground tracking-tight">
                        Welcome to <span className="text-yellow-300">CMS</span>
                    </div>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-md leading-relaxed">
                        Manage your team, projects, and workflow effortlessly — all in one place 🚀
                    </p>
                </div>

                {/* Right Section (Login Form) */}
                <div className="
          md:w-1/2 w-full 
          flex items-center justify-center 
          px-5 sm:px-10 md:px-16 lg:px-24 
          py-10 md:py-0
          bg-background
        ">
                    <div className="w-full max-w-md bg-card/50 border border-border rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm">
                       <SignIn />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

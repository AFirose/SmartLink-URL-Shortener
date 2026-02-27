 import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  // Colorful gradient backgrounds for cards
  const cardColors = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-green-500 to-teal-400',
    'from-orange-500 to-red-400',
    'from-indigo-500 to-purple-400',
    'from-pink-500 to-rose-400'
  ];

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header Section with Gradient Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Powerful Features
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover all the amazing features that make Shortly the most powerful URL shortener on the web.
          </p>
          
          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">1M+</div>
            <div className="text-sm text-gray-300">Links Shortened</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm text-gray-300">Happy Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-gray-300">Uptime</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-300">Support</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 - Lightning Fast */}
          <div className={`bg-gradient-to-br ${cardColors[0]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Lightning Fast</h3>
            <p className="text-white/90 mb-4">
              Our URLs are generated in milliseconds, ensuring you never have to wait.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Feature 2 - Secure & Reliable */}
          <div className={`bg-gradient-to-br ${cardColors[1]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Secure & Reliable</h3>
            <p className="text-white/90 mb-4">
              Your links are safe with us. We use enterprise-grade security measures.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Feature 3 - Detailed Analytics */}
          <div className={`bg-gradient-to-br ${cardColors[2]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Detailed Analytics</h3>
            <p className="text-white/90 mb-4">
              Track clicks, locations, and devices for every shortened URL.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Feature 4 - Free Forever */}
          <div className={`bg-gradient-to-br ${cardColors[3]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Free Forever</h3>
            <p className="text-white/90 mb-4">
              No hidden fees. Our basic plan is completely free, forever.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Feature 5 - Custom Links */}
          <div className={`bg-gradient-to-br ${cardColors[4]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">🔧</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Custom Links</h3>
            <p className="text-white/90 mb-4">
              Create branded, custom short links that represent your business.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Feature 6 - 24/7 Support */}
          <div className={`bg-gradient-to-br ${cardColors[5]} rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer group`}>
            <div className="bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <span className="text-4xl">🎧</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">24/7 Support</h3>
            <p className="text-white/90 mb-4">
              Our support team is always available to help you with any issues.
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">Learn more</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to get started?
            </h2>
            <p className="text-white/90 mb-8 text-lg relative z-10 max-w-2xl mx-auto">
              Join thousands of satisfied users who are already enjoying our features.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg relative z-10"
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
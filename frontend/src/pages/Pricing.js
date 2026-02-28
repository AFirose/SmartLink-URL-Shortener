import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="pt-24 pb-16 px-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Free</h3>
            <p className="text-4xl font-bold mb-6 text-primary-cyan">$0</p>
            <p className="text-gray-600 mb-6">Perfect for getting started</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                50 URLs per month
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basic analytics
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Standard support
              </li>
            </ul>
            <Link
              to="/register"
              className="block text-center bg-primary-cyan text-white px-6 py-3 rounded-full hover:bg-primary-dark-cyan transition"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-primary-cyan relative transform scale-105">
            <div className="absolute top-0 right-0 bg-primary-cyan text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pro</h3>
            <p className="text-4xl font-bold mb-6 text-primary-cyan">$9</p>
            <p className="text-gray-600 mb-6">For power users</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1000 URLs per month
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom links
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>
            <Link
              to="/register"
              className="block text-center bg-primary-cyan text-white px-6 py-3 rounded-full hover:bg-primary-dark-cyan transition"
            >
              Upgrade Now
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise</h3>
            <p className="text-4xl font-bold mb-6 text-primary-cyan">Custom</p>
            <p className="text-gray-600 mb-6">For large organizations</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited URLs
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom analytics
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dedicated support
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SLA guarantee
              </li>
            </ul>
            <Link
              to="/contact"
              className="block text-center bg-primary-cyan text-white px-6 py-3 rounded-full hover:bg-primary-dark-cyan transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
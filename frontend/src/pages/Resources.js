import React from 'react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const blogPosts = [
    {
      title: "10 Ways to Optimize Your Links",
      excerpt: "Learn how to get the most out of your shortened URLs with these pro tips.",
      date: "Mar 15, 2024",
      readTime: "5 min read"
    },
    {
      title: "The Future of Link Management",
      excerpt: "Discover emerging trends in URL shortening and link analytics.",
      date: "Mar 10, 2024",
      readTime: "4 min read"
    },
    {
      title: "Security Best Practices for Short Links",
      excerpt: "Keep your links and data safe with these security guidelines.",
      date: "Mar 5, 2024",
      readTime: "6 min read"
    }
  ];

  const guides = [
    "Getting Started Guide",
    "API Documentation",
    "Analytics Dashboard Guide",
    "Custom Links Tutorial",
    "Team Collaboration"
  ];

  return (
    <div className="pt-24 pb-16 px-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Resources</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to make the most of Shortly.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Blog Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Latest from the Blog</h2>
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${index}`} className="text-primary-cyan hover:underline mt-4 inline-block">
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Guides */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Guides & Tutorials</h2>
              <ul className="space-y-3">
                {guides.map((guide, index) => (
                  <li key={index}>
                    <Link to={`/guides/${index}`} className="text-gray-600 hover:text-primary-cyan flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {guide}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Center */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                Visit our help center for FAQs and support.
              </p>
              <Link
                to="/help"
                className="inline-block bg-primary-cyan text-white px-6 py-2 rounded-full hover:bg-primary-dark-cyan transition"
              >
                Get Help
              </Link>
            </div>

            {/* API Docs */}
            <div className="bg-primary-dark-violet p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-xl font-bold mb-2">API Access</h2>
              <p className="mb-4 text-gray-200">
                Integrate Shortly into your applications with our powerful API.
              </p>
              <Link
                to="/api-docs"
                className="inline-block bg-white text-primary-dark-violet px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
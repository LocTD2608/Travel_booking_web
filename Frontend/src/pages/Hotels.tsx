import React from 'react';

const Hotels: React.FC = () => {
    return (
        <div className="px-4 md:px-10 lg:px-40 py-16">
            <div className="max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-blue-600">hotel</span>
                </div>
                <h1 className="text-4xl font-black text-primary mb-4">Hotels</h1>
                <p className="text-lg text-gray-500 mb-8">
                    Find the perfect place to stay for your next trip. Coming soon!
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
                    <h3 className="font-bold text-lg mb-4">Looking for accommodation?</h3>
                    <p className="text-gray-600 mb-6">
                        We are currently partnering with top hotels to bring you the best deals.
                        Check back soon or explore our other travel options!
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hotels;

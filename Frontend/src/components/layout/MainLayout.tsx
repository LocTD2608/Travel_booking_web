import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const MainLayout: React.FC = () => {

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div >
    );
};

export default MainLayout;

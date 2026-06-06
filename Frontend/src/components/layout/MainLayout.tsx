import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationToast } from '../common/NotificationToast';

const MainLayout: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <NotificationToast />
        </div>
    );
};

export default MainLayout;

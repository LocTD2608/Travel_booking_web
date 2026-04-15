import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!email || !token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Đường dẫn không hợp lệ</h2>
                    <p className="text-gray-600 mb-6">Thiếu thông tin xác thực. Vui lòng thử lại quá trình quên mật khẩu.</p>
                    <button onClick={() => navigate('/')} className="w-full bg-travel-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (password.length < 6) {
           setError("Mật khẩu phải có ít nhất 6 ký tự");
           return;
        }

        setIsProcessing(true);
        try {
            await authApi.resetPassword(email, token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in relative overflow-hidden">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-travel-blue text-4xl">flight_takeoff</span>
                        <h2 className="text-[#141414] text-3xl font-black tracking-tight">Traveloka</h2>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h3>
                    <p className="text-sm text-gray-600 mt-2">Nhập mật khẩu mới cho tài khoản của bạn</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200 mb-6 flex items-center">
                        <span className="material-symbols-outlined text-lg mr-2">error</span>
                        {error}
                    </div>
                )}
                
                {success ? (
                    <div className="text-center animate-scale-in">
                        <div className="bg-green-50 text-green-600 p-6 rounded-xl border border-green-200 mb-6 flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                            <p className="font-bold text-lg">Đổi mật khẩu thành công!</p>
                            <p className="text-sm">Bạn sẽ được chuyển hướng về trang chủ trong giây lát...</p>
                        </div>
                        <button onClick={() => navigate('/')} className="w-full bg-travel-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                            Về trang chủ ngay
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-3 px-4 border outline-none transition-all" 
                                placeholder="Nhập mật khẩu mới" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                            <input 
                                type="password" 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-3 px-4 border outline-none transition-all" 
                                placeholder="Nhập lại mật khẩu mới" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isProcessing} 
                            className="w-full bg-travel-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-all hover-lift active:scale-[0.98] mt-2 shadow-lg shadow-blue-500/30"
                        >
                            {isProcessing ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/authApi";
import { useLanguage } from "../../context";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "register" | "forgot" | "verify";
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    initialView = "login",
}) => {
    const [view, setView] = useState<"login" | "register" | "forgot" | "verify">(initialView);
    const { login: loginApi, register: registerApi, isLoading } = useAuth();
    const { t } = useLanguage();

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setError("");
            setMessage("");
            setEmail("");
            setPassword("");
            setFullName("");
            setPhone("");
            setConfirmPassword("");
            setOtp("");
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await loginApi({ email, password });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('auth.errorLogin', 'Đăng nhập thất bại'));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError(t('auth.errorMatch', 'Mật khẩu xác nhận không khớp'));
            return;
        }
        try {
            await registerApi({ fullName, phone, email, password });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('auth.errorRegister', 'Đăng ký thất bại'));
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsProcessing(true);
        try {
            await authApi.forgotPassword(email);
            setMessage(t('auth.otpSent', 'Mã OTP đã được gửi đến email của bạn.'));
            setTimeout(() => {
                setView("verify");
                setMessage("");
            }, 2000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('auth.errorOccurred', 'Đã có lỗi xảy ra'));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsProcessing(true);
        try {
            const response = await authApi.verifyOtp(email, otp);
            onClose();
            window.location.href = `/reset-password?email=${email}&token=${response.resetToken}`;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('auth.errorOtp', 'Mã OTP không hợp lệ'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10 hover:rotate-90 transition-transform">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                <div className="overflow-y-auto p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-travel-blue text-3xl">flight_takeoff</span>
                            <h2 className="text-[#141414] text-2xl font-black tracking-tight">Booking Travel</h2>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {view === "login" && t('auth.loginTitle', 'Đăng nhập tài khoản')}
                            {view === "register" && t('auth.registerTitle', 'Tạo tài khoản mới')}
                            {view === "forgot" && t('auth.forgotTitle', 'Quên mật khẩu')}
                            {view === "verify" && t('auth.verifyTitle', 'Xác thực OTP')}
                        </h3>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-lg mr-2">error</span>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200 mb-4 flex items-center">
                            <span className="material-symbols-outlined text-lg mr-2">check_circle</span>
                            {message}
                        </div>
                    )}

                    {view === "login" && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email', 'Email')}</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderEmail', 'Nhập email')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password', 'Mật khẩu')}</label>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderPassword', 'Nhập mật khẩu')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="button" onClick={() => setView('forgot')} className="text-sm font-semibold text-travel-blue hover:text-blue-600">{t('auth.forgotLink', 'Quên mật khẩu?')}</button>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-travel-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-all hover-lift active:scale-[0.98]">
                                {isLoading ? t('auth.processing', 'Đang xử lý...') : t('auth.btnSubmitLogin', 'Đăng nhập')}
                            </button>
                            <div className="text-center mt-4 text-sm text-gray-600">
                                {t('auth.noAccount', 'Chưa có tài khoản?')} <button type="button" onClick={() => setView('register')} className="font-semibold text-travel-blue hover:text-blue-600">{t('auth.registerLink', 'Đăng ký ngay')}</button>
                            </div>
                        </form>
                    )}

                    {view === "register" && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName', 'Họ và tên')}</label>
                                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderName', 'Nhập họ và tên')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone', 'Số điện thoại')}</label>
                                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderPhone', 'Nhập số điện thoại')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email', 'Email')}</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderEmail', 'Nhập email')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password', 'Mật khẩu')}</label>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderPassword', 'Nhập mật khẩu')} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword', 'Xác nhận mật khẩu')}</label>
                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderConfirm', 'Nhập lại mật khẩu')} />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-travel-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-all hover-lift active:scale-[0.98]">
                                {isLoading ? t('auth.processing', 'Đang xử lý...') : t('auth.btnSubmitRegister', 'Đăng ký')}
                            </button>
                            <div className="text-center mt-4 text-sm text-gray-600">
                                {t('auth.hasAccount', 'Đã có tài khoản?')} <button type="button" onClick={() => setView('login')} className="font-semibold text-travel-blue hover:text-blue-600">{t('auth.loginLink', 'Đăng nhập')}</button>
                            </div>
                        </form>
                    )}

                    {view === "forgot" && (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">{t('auth.forgotDesc', 'Nhập email để nhận mã OTP khôi phục mật khẩu.')}</p>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-sm py-2.5 px-3 border outline-none" placeholder={t('auth.placeholderEmail', 'Nhập email')} />
                            <button type="submit" disabled={isProcessing} className="w-full bg-travel-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                                {isProcessing ? t('auth.sending', 'Đang gửi...') : t('auth.btnSubmitForgot', 'Gửi mã OTP')}
                            </button>
                        </form>
                    )}

                    {view === "verify" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <p className="text-sm text-gray-600 text-center">{t('auth.otpText', 'Nhập mã OTP 6 số đã gửi tới {email}').replace('{email}', email)}</p>
                            <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-travel-blue focus:border-travel-blue sm:text-xl text-center py-2.5 px-3 border tracking-widest outline-none" placeholder={t('auth.placeholderOtp', '000000')} />
                            <button type="submit" disabled={isProcessing || otp.length !== 6} className="w-full bg-travel-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                                {isProcessing ? t('auth.verifying', 'Đang xác thực...') : t('auth.btnSubmitVerify', 'Xác nhận OTP')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;

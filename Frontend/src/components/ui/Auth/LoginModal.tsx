import React, { useState } from 'react';
import { useAuth, type LoginCredentials } from '../../../context/AuthContext';
import { Modal } from '../../common/Modal/Modal';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const auth = useAuth();
    const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
    const [localError, setLocalError] = useState<string | null>(null);

    // State kiểm soát Quên mật khẩu
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setLocalError(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!credentials.email || !credentials.password) {
            setLocalError('Vui lòng điền đầy đủ Email/SĐT và Mật khẩu.');
            return;
        }

        try {
            await auth.login(credentials);
            onClose(); 
        } catch (error: any) {
            setLocalError(error.message || 'Lỗi đăng nhập');
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.forgotPassword(forgotEmail);
            alert("Mã OTP đã được gửi! Kiểm tra Terminal Backend nhé sốp.");
            // Sau này làm thêm giao diện nhập OTP ở đây
        } catch (err: any) {
            alert(err.message);
        }
    };

    // 1. GIAO DIỆN QUÊN MẬT KHẨU
    if (showForgot) {
        return (
            <Modal isOpen={true} onClose={() => setShowForgot(false)} title="Khôi phục mật khẩu">
                <div style={{ padding: '20px', minWidth: '350px' }}>
                    <p style={{ fontSize: '14px', marginBottom: '15px' }}>Nhập Email để nhận mã xác thực OTP:</p>
                    <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="email" 
                            placeholder="Email của bạn"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <button type="submit" disabled={auth.isLoading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {auth.isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                        </button>
                        <button type="button" onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                            Quay lại Đăng nhập
                        </button>
                    </form>
                </div>
            </Modal>
        );
    }

    // 2. GIAO DIỆN ĐĂNG NHẬP (MẶC ĐỊNH)
    return (
        <Modal isOpen={true} onClose={onClose} title="Đăng nhập">
            <div style={{ padding: '20px', minWidth: '350px' }}>
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="email">Email hoặc Số điện thoại</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Nhập email hoặc SĐT"
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    {/* Nút Quên mật khẩu */}
                    <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '10px' }}>
                        <button 
                            type="button" 
                            onClick={() => setShowForgot(true)}
                            style={{ fontSize: '12px', color: '#1BA0E2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                    
                    {localError && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{localError}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={auth.isLoading}
                        style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        {auth.isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default LoginModal;
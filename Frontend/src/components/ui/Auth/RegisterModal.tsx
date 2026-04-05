import React, { useState } from 'react';
import { useAuth, type RegisterData } from '../../../context/AuthContext';
import {Modal} from '../../common/Modal/Modal';

interface RegisterModalProps {
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
    const auth = useAuth();
    const [registerData, setRegisterData] = useState<RegisterData>({ name: '', email: '', password: '', phone: '' });
    const [localError, setLocalError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setLocalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!registerData.name || !registerData.email || !registerData.password) {
            setLocalError('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.');
            return;
        }

        try {
            await auth.register(registerData);
            onClose(); 
        } catch (error: any) {
             setLocalError(error.message || 'Lỗi đăng ký');
        }
    };

    return (
        // 2. Thêm isOpen={true} và title
        <Modal isOpen={true} onClose={onClose} title="Đăng ký">
            <div style={{ padding: '20px', minWidth: '350px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                     {/* ... (Các ô input giữ nguyên) ... */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Họ và Tên</label>
                        <input type="text" name="name" value={registerData.name} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Email</label>
                        <input type="email" name="email" value={registerData.email} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Số điện thoại</label>
                        <input type="tel" name="phone" value={registerData.phone} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={registerData.password} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    
                    {localError && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{localError}</p>}
                    
                    <button type="submit" disabled={auth.isLoading} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                        {auth.isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default RegisterModal;
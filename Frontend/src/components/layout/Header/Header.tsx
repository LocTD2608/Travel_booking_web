import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import LoginModal from '../../ui/Auth/LoginModal';
import RegisterModal from '../../ui/Auth/RegisterModal';
// Import thêm component Modal dùng cho Pop-up xác nhận
import { Modal } from '../../common/Modal/Modal'; 

const Header = () => {
  const auth = useAuth(); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // State mới để điều khiển Pop-up Đăng xuất
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', borderBottom: '1px solid #eee' }}>
      <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
        Traveloka
      </div>
      
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center' }}>
        {auth.isAuthenticated ? (
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
               src={auth.user?.avatar || 'https://i.pravatar.cc/150?img=12'} 
               alt="Avatar" 
               style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 'bold' }}>{auth.user?.name}</span>
            {/* Đổi sự kiện onClick ở đây để mở Modal thay vì đăng xuất luôn */}
            <button 
                onClick={() => setShowLogoutConfirm(true)}
                style={{ marginLeft: '15px', padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}
            >
                Đăng xuất
            </button>
          </div>
        ) : (
          <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={() => setIsLoginOpen(true)}
                style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Log In
            </button>
            <button 
                onClick={() => setIsRegisterOpen(true)} 
                style={{ padding: '8px 16px', border: 'none', backgroundColor: '#000', color: '#fff', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                Register
            </button>
          </div>
        )}
      </div>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} />}

      {/* --- GIAO DIỆN POP-UP XÁC NHẬN ĐĂNG XUẤT --- */}
      {showLogoutConfirm && (
        <Modal isOpen={true} onClose={() => setShowLogoutConfirm(false)} title="Xác nhận đăng xuất">
            <div style={{ padding: '20px', textAlign: 'center', minWidth: '300px' }}>
                <p style={{ marginBottom: '25px', fontSize: '16px', color: '#333' }}>
                    Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button 
                        onClick={() => setShowLogoutConfirm(false)}
                        style={{ padding: '8px 25px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={() => {
                            auth.logout();
                            setShowLogoutConfirm(false); // Ẩn pop-up đi sau khi đăng xuất
                        }}
                        style={{ padding: '8px 25px', borderRadius: '6px', border: 'none', background: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </Modal>
      )}
    </header>
  );
};

export default Header;
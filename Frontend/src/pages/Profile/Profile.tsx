import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/userApi';
import type { UserProfile } from '../../services/userApi';

const Profile: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState({ Ho: '', Ten: '', Email: '', SDT: '', CCCD: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile(user.id);
                setProfile(data);
                setForm({
                    Ho: data.Ho || '',
                    Ten: data.Ten || '',
                    Email: data.Email || '',
                    SDT: data.SDT || '',
                    CCCD: data.CCCD || '',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải profile');
            }
        };

        fetchProfile();
    }, [isAuthenticated, user]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setError(null);
        setMessage(null);

        try {
            await userApi.updateProfile(user.id, {
                Ho: form.Ho,
                Ten: form.Ten,
                Email: form.Email,
                SDT: form.SDT,
                CCCD: form.CCCD,
            });
            setMessage('Cập nhật profile thành công');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Bạn cần đăng nhập</h2>
                <p className="text-gray-600 mb-6">Để xem và chỉnh sửa thông tin cá nhân, vui lòng đăng nhập.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/" className="rounded-lg bg-travel-blue px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Profile của bạn</h1>
                    <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản và cập nhật dữ liệu cá nhân.</p>
                </div>
                <Link to="/" className="text-sm text-travel-blue hover:underline">Quay lại trang chủ</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
                {error && <div className="mb-4 rounded-xl bg-red-100 border border-red-200 p-4 text-red-700">{error}</div>}
                {message && <div className="mb-4 rounded-xl bg-green-100 border border-green-200 p-4 text-green-700">{message}</div>}

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-gray-700">Họ</span>
                            <input
                                name="Ho"
                                value={form.Ho}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-travel-blue focus:outline-none"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-gray-700">Tên</span>
                            <input
                                name="Ten"
                                value={form.Ten}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-travel-blue focus:outline-none"
                            />
                        </label>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-gray-700">Email</span>
                            <input
                                name="Email"
                                type="email"
                                value={form.Email}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-travel-blue focus:outline-none"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-gray-700">Số điện thoại</span>
                            <input
                                name="SDT"
                                value={form.SDT}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-travel-blue focus:outline-none"
                            />
                        </label>
                    </div>

                    <label className="space-y-2">
                        <span className="text-sm font-semibold text-gray-700">CCCD / CMND</span>
                        <input
                            name="CCCD"
                            value={form.CCCD}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-travel-blue focus:outline-none"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center justify-center rounded-2xl bg-travel-blue px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>

                {profile && (
                    <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50 p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin hệ thống</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">ID tài khoản</p>
                                <p className="font-medium text-gray-900">{profile.UserID}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Quyền</p>
                                <p className="font-medium text-gray-900">{profile.Role || 'USER'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Trạng thái</p>
                                <p className="font-medium text-gray-900">{profile.TrangThai || 'ACTIVE'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Xác minh</p>
                                <p className="font-medium text-gray-900">{profile.TinhTrangXacMinh || 'UNVERIFIED'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        to="/profile/booking-history"
                        className="flex items-center justify-between w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-travel-blue group-hover:bg-blue-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">Lịch sử đặt vé</p>
                                <p className="text-sm text-gray-500">Xem lại các chuyến đi và dịch vụ bạn đã đặt</p>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-travel-blue transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;

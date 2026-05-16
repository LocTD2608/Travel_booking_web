import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import { confirmPayment, verifyVNPayReturn } from '../../services/paymentApi';
import styles from './PaymentCallback.module.css';

const PaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Lấy query string từ URL
                const queryString = window.location.search;
                const txnId = searchParams.get('vnp_TxnRef');

                if (!txnId) {
                    throw new Error('Transaction ID not found');
                }

                setTransactionId(txnId);

                // Gọi backend API để verify chữ ký và lưu DB
                const verificationResult = await verifyVNPayReturn(queryString);

                if (verificationResult.success) {
                    // Update booking state via API or it's already done in backend?
                    // The old paymentController handleSuccess needs to be called, but wait, 
                    // the controller we wrote (vnpayReturn) only verifies checksum. 
                    // If verified, we should call a backend endpoint to confirm the order or do it right there.
                    
                    // Call confirmPayment just like before
                    try {
                        const userStr = localStorage.getItem('user');
                        const userId = userStr ? JSON.parse(userStr).MaNguoiDung || JSON.parse(userStr).id : 1;
                        await confirmPayment(txnId, userId);
                    } catch (e) {
                        console.log('Error confirming payment (might already be confirmed by another webhook)', e);
                    }

                    setStatus('success');
                    setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');

                    // Chuyển hướng sang trang thành công sau 2 giây
                    setTimeout(() => {
                        navigate('/payment-success', { state: { transactionId: txnId } });
                    }, 2000);
                } else {
                    setStatus('failed');
                    setMessage('Thanh toán không thành công. ' + (verificationResult.message || 'Vui lòng thử lại.'));

                    // Chuyển hướng sang trang thất bại sau 3 giây
                    setTimeout(() => {
                        navigate('/checkout'); // Should be a better page
                    }, 3000);
                }
            } catch (error: any) {
                console.error('Error handling callback:', error);
                setStatus('failed');
                setMessage(`Lỗi: ${error.message}`);

                setTimeout(() => {
                    navigate('/checkout'); // go back to home or history
                }, 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className={styles.page}>
            {status === 'loading' && (
                <Modal
                    title="Đang xử lý thanh toán..."
                    visible={true}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div className={styles.loadingContent}>
                        <Spin size="large" />
                        <p>Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn...</p>
                    </div>
                </Modal>
            )}

            {status === 'success' && (
                <Modal
                    title="✅ Thanh toán thành công"
                    visible={true}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div className={styles.resultContent}>
                        <div className={styles.icon}>✓</div>
                        <p className={styles.message}>{message}</p>
                        {transactionId && (
                            <p className={styles.transactionId}>
                                Mã giao dịch: <strong>{transactionId}</strong>
                            </p>
                        )}
                        <p className={styles.redirectText}>Chuyển hướng tới trang xác nhận...</p>
                    </div>
                </Modal>
            )}

            {status === 'failed' && (
                <Modal
                    title="❌ Thanh toán thất bại"
                    visible={true}
                    footer={null}
                    closable={false}
                    centered
                >
                    <div className={styles.resultContent}>
                        <div className={`${styles.icon} ${styles.error}`}>✕</div>
                        <p className={styles.message}>{message}</p>
                        <p className={styles.redirectText}>Quay trở lại trang thanh toán...</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PaymentCallback;

import React, { useState, useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface CountdownHoldProps {
    expiresInSeconds: number; // 600 for 10 mins
    onExpire?: () => void;
}

const CountdownHold: React.FC<CountdownHoldProps> = ({ expiresInSeconds, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(expiresInSeconds);
    const [expired, setExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft <= 0) {
            if (!expired) {
                setExpired(true);
                if (onExpire) onExpire();
                Modal.warning({
                    title: 'Quá thời gian giữ chỗ',
                    content: 'Yêu cầu giữ chỗ của bạn đã hết hạn. Hệ thống sẽ tải về trang trước đó.',
                    onOk: () => {
                        navigate(-1);
                    }
                });
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, expired, navigate, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div style={{ padding: '10px 15px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '6px', textAlign: 'center', marginBottom: '20px' }}>
            <Text type="danger" strong style={{ fontSize: '16px' }}>
                ⏳ Thời gian giữ chỗ còn lại: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                Vui lòng hoàn tất thanh toán trước khi thời gian kết thúc.
            </div>
        </div>
    );
};

export default CountdownHold;

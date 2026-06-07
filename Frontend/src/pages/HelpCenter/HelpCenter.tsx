import React from 'react';
import { useLanguage } from '../../context';
import styles from './HelpCenter.module.css';

interface FAQItem {
    id: string;
    category: 'flights' | 'accommodations' | 'account' | 'payment';
    question: string;
    answer: string;
}

const FAQS: FAQItem[] = [
    {
        id: 'f1',
        category: 'flights',
        question: 'Làm thế nào để thay đổi lịch trình (Reschedule) hoặc hoàn vé máy bay (Refund)?',
        answer: 'Bạn có thể gửi yêu cầu thay đổi lịch trình hoặc hoàn tiền vé trực tiếp bằng cách truy cập vào trang "Lịch sử đặt vé" (My Booking) trong hồ sơ cá nhân của mình, chọn vé máy bay cần xử lý và nhấn vào mục tương ứng. Lệ phí thay đổi và chính sách hoàn lại sẽ tuân thủ nghiêm ngặt theo điều kiện giá vé của từng hãng hàng không.'
    },
    {
        id: 'f2',
        category: 'flights',
        question: 'Khi nào tôi có thể tiến hành làm thủ tục check-in trực tuyến?',
        answer: 'Hầu hết các hãng vận chuyển hàng không cho phép quý khách làm thủ tục check-in trực tuyến trước giờ khởi hành dự kiến từ 24 đến 48 tiếng. Bạn chỉ cần truy cập website/app của hãng bay, nhập mã đặt chỗ (PNR hoặc mã đặt vé gốc) cùng họ tên hành khách để lấy thẻ lên máy bay điện tử.'
    },
    {
        id: 'f3',
        category: 'flights',
        question: 'Mức hành lý ký gửi miễn cước được tính như thế nào?',
        answer: 'Trọng lượng hành lý ký gửi miễn phí phụ thuộc vào chính sách của từng hãng hàng không và hạng vé bạn đã mua (thường từ 20kg đến 30kg). Chúng tôi khuyên bạn nên mua thêm hành lý ký gửi trong quá trình đặt vé trực tuyến hoặc trước giờ bay ít nhất 4 tiếng để có giá ưu đãi nhất.'
    },
    {
        id: 'a1',
        category: 'accommodations',
        question: 'Làm thế nào để hủy phòng khách sạn và nhận tiền hoàn trả?',
        answer: 'Vui lòng truy cập "My Booking" trong tài khoản cá nhân, lựa chọn mã phòng đã đặt và nhấn nút "Hủy phòng". Nếu phòng của bạn thuộc gói ưu đãi áp dụng chính sách "Hủy miễn phí" và thực hiện trước thời hạn quy định, toàn bộ số tiền sẽ được tự động hoàn về tài khoản thanh toán ban đầu của bạn.'
    },
    {
        id: 'a2',
        category: 'accommodations',
        question: 'Thời gian Check-in (Nhận phòng) và Check-out (Trả phòng) tiêu chuẩn là bao nhiêu?',
        answer: 'Giờ nhận phòng tiêu chuẩn thường bắt đầu từ 14:00 chiều và trả phòng trước 12:00 trưa hàng ngày. Để yêu cầu nhận phòng sớm hơn hoặc trả phòng muộn hơn, quý khách nên liên hệ trực tiếp với quầy lễ tân của khách sạn để được tư vấn (phí phụ thu có thể áp dụng).'
    },
    {
        id: 'a3',
        category: 'accommodations',
        question: 'Tôi có phải nộp tiền đặt cọc giữ phòng khi làm thủ tục nhận phòng không?',
        answer: 'Một số khách sạn có quy định yêu cầu khách hàng đặt cọc một khoản tiền nhỏ (bằng tiền mặt hoặc phong tỏa thẻ tín dụng) để phục vụ cho các chi phí dịch vụ phát sinh (như Minibar, Giặt là, Ăn uống tại phòng). Khoản tiền này sẽ được hoàn trả 100% khi bạn check-out và không làm phát sinh phí tổn.'
    },
    {
        id: 'u1',
        category: 'account',
        question: 'Làm cách nào để thay đổi mật khẩu tài khoản hoặc email liên hệ?',
        answer: 'Quý khách vui lòng truy cập vào mục "Profile" (Hồ sơ của tôi) trên thanh điều hướng, tìm tới phần "Cài đặt tài khoản" để cập nhật mật khẩu mới, cập nhật số điện thoại hoặc thay đổi địa chỉ email của mình.'
    },
    {
        id: 'u2',
        category: 'account',
        question: 'Làm cách nào để đảm bảo tính an toàn tối đa cho tài khoản của tôi?',
        answer: 'Để tăng cường bảo mật, hãy đặt mật khẩu có độ phức tạp cao (gồm tối thiểu 8 ký tự, có ký tự hoa, thường, chữ số và ký hiệu đặc biệt), tuyệt đối không chia sẻ mã xác thực OTP gửi về điện thoại cho người khác, và nên đăng xuất tài khoản khi sử dụng trên các thiết bị công cộng.'
    },
    {
        id: 'u3',
        category: 'account',
        question: 'Tôi bị quên mật khẩu đăng nhập thì phải làm thế nào?',
        answer: 'Hãy nhấn vào nút "Đăng nhập" ở góc phải màn hình, sau đó chọn liên kết "Quên mật khẩu". Nhập email bạn đã đăng ký tài khoản và hệ thống sẽ gửi một email hướng dẫn kèm đường dẫn bảo mật để bạn thiết lập lại mật khẩu mới.'
    },
    {
        id: 'p1',
        category: 'payment',
        question: 'Hệ thống hỗ trợ các cổng giao dịch và phương thức thanh toán nào?',
        answer: 'Traveloka hỗ trợ đa dạng phương thức thanh toán bảo mật chuẩn quốc tế bao gồm: Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), cổng thanh toán nội địa và quốc tế VNPay, ví điện tử MoMo, hoặc chuyển khoản trực tiếp qua hệ thống VietQR tích hợp tự động đối soát.'
    },
    {
        id: 'p2',
        category: 'payment',
        question: 'Tài khoản ngân hàng của tôi đã bị trừ tiền nhưng hệ thống chưa gửi vé?',
        answer: 'Trong các trường hợp gián đoạn kết nối mạng, tài khoản có thể bị trừ tiền nhưng giao dịch chưa kịp ghi nhận. Đừng lo lắng, hệ thống tự động của chúng tôi sẽ đối soát hoàn tiền lại trong vòng 24 - 48 giờ. Bạn cũng có thể gửi mã giao dịch và sao kê qua Hotline 1900-1234 để được hỗ trợ kiểm tra và xuất vé thủ công ngay lập tức.'
    },
    {
        id: 'p3',
        category: 'payment',
        question: 'Thanh toán qua cổng VNPay Sandbox có bị tính phí thật không?',
        answer: 'Không, đây là cổng thanh toán kiểm thử (Sandbox) được tích hợp trong giai đoạn phát triển và chạy thử nghiệm sản phẩm. Các thông tin tài khoản và thẻ test đều là giả lập và không phát sinh bất kỳ khoản phí thực tế nào từ tài khoản ngân hàng của bạn.'
    }
];

const HelpCenter: React.FC = () => {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = React.useState<'flights' | 'accommodations' | 'account' | 'payment'>('flights');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [appliedSearch, setAppliedSearch] = React.useState('');
    const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);

    const handleSearch = () => {
        setAppliedSearch(searchQuery.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategoryClick = (category: 'flights' | 'accommodations' | 'account' | 'payment') => {
        setActiveCategory(category);
        setSearchQuery('');
        setAppliedSearch('');
        setOpenFaqId(null);
    };

    const toggleFaq = (id: string) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const getFaqQuestion = React.useCallback((faq: FAQItem) => {
        return t(`help.faq.${faq.id}.q`, faq.question);
    }, [t]);

    const getFaqAnswer = React.useCallback((faq: FAQItem) => {
        return t(`help.faq.${faq.id}.a`, faq.answer);
    }, [t]);

    const filteredFaqs = React.useMemo(() => {
        if (appliedSearch) {
            return FAQS.filter(faq => {
                const q = getFaqQuestion(faq).toLowerCase();
                const a = getFaqAnswer(faq).toLowerCase();
                const term = appliedSearch.toLowerCase();
                return q.includes(term) || a.includes(term);
            });
        }
        return FAQS.filter(faq => faq.category === activeCategory);
    }, [activeCategory, appliedSearch, getFaqQuestion, getFaqAnswer]);

    const highlightMatches = (text: string, term: string) => {
        if (!term) return <span>{text}</span>;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === term.toLowerCase() 
                        ? <span key={i} className={styles.highlightText}>{part}</span>
                        : part
                )}
            </span>
        );
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'flights': return t('help.catFlights', 'Vé máy bay');
            case 'accommodations': return t('help.catAccommodations', 'Nơi lưu trú');
            case 'account': return t('help.catAccount', 'Tài khoản');
            case 'payment': return t('help.catPayment', 'Thanh toán');
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t('help.title', 'Hello, how can we help you?')}</h1>
                <p>{t('help.subtitle', 'Find answers, guides and policies here')}</p>
            </div>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder={t('help.searchPlaceholder', 'Search for guides, topics, or FAQs')}
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className={styles.searchButton} onClick={handleSearch}>{t('help.searchBtn', 'Search')}</button>
            </div>

            <div className={styles.topics}>
                <div 
                    className={activeCategory === 'flights' && !appliedSearch ? styles.topicCardActive : styles.topicCard}
                    onClick={() => handleCategoryClick('flights')}
                >
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>flight</span>
                    <h3>{t('help.catFlights', 'Flights')}</h3>
                    <p>{t('help.catFlightsDesc', 'Booking, Check-in, Reschedule & Refunds')}</p>
                </div>
                <div 
                    className={activeCategory === 'accommodations' && !appliedSearch ? styles.topicCardActive : styles.topicCard}
                    onClick={() => handleCategoryClick('accommodations')}
                >
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>hotel</span>
                    <h3>{t('help.catAccommodations', 'Accommodations')}</h3>
                    <p>{t('help.catAccommodationsDesc', 'Hotel & Villa bookings, Cancellation')}</p>
                </div>
                <div 
                    className={activeCategory === 'account' && !appliedSearch ? styles.topicCardActive : styles.topicCard}
                    onClick={() => handleCategoryClick('account')}
                >
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>account_circle</span>
                    <h3>{t('help.catAccount', 'Account Info')}</h3>
                    <p>{t('help.catAccountDesc', 'Managing profile, Password, Email')}</p>
                </div>
                <div 
                    className={activeCategory === 'payment' && !appliedSearch ? styles.topicCardActive : styles.topicCard}
                    onClick={() => handleCategoryClick('payment')}
                >
                    <span className={`material-symbols-outlined ${styles.topicIcon}`}>payments</span>
                    <h3>{t('help.catPayment', 'Payment')}</h3>
                    <p>{t('help.catPaymentDesc', 'Payment methods, Failed transactions')}</p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2 className={styles.faqTitle}>
                    {appliedSearch 
                        ? t('help.searchResult', `Kết quả tìm kiếm cho "${appliedSearch}" (${filteredFaqs.length})`).replace('{query}', appliedSearch).replace('{count}', String(filteredFaqs.length))
                        : t('help.faqTitle', `Câu hỏi thường gặp về {category}`).replace('{category}', getCategoryLabel(activeCategory))
                    }
                </h2>

                {filteredFaqs.length === 0 ? (
                    <div className={styles.noResults}>
                        <span className={`material-symbols-outlined ${styles.noResultsIcon}`}>search_off</span>
                        <p>{t('help.noResultsTitle', 'Không tìm thấy câu hỏi hoặc câu trả lời nào phù hợp với tìm kiếm của bạn.')}</p>
                        <p style={{ fontSize: '13px', marginTop: '8px' }}>{t('help.noResultsDesc', 'Vui lòng thử lại với từ khóa khác hoặc duyệt theo danh mục ở trên.')}</p>
                    </div>
                ) : (
                    <div className={styles.faqList}>
                        {filteredFaqs.map((faq) => (
                            <div 
                                key={faq.id} 
                                className={openFaqId === faq.id ? styles.faqItemActive : styles.faqItem}
                            >
                                <div 
                                    className={styles.faqQuestion} 
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <span>
                                        {appliedSearch && (
                                            <span 
                                                style={{ 
                                                    fontSize: '11px', 
                                                    background: '#e0f2fe', 
                                                    color: '#0369a1', 
                                                    padding: '3px 8px', 
                                                    borderRadius: '12px',
                                                    marginRight: '10px',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {getCategoryLabel(faq.category)}
                                            </span>
                                        )}
                                        {highlightMatches(getFaqQuestion(faq), appliedSearch)}
                                    </span>
                                    <span className={`material-symbols-outlined ${styles.faqToggleIcon}`}>
                                        expand_more
                                    </span>
                                </div>
                                <div className={styles.faqAnswer}>
                                    {highlightMatches(getFaqAnswer(faq), appliedSearch)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpCenter;

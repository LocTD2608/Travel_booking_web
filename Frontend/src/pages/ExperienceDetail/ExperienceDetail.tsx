import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import GuestSelector from '../../components/ui/GuestSelector/GuestSelector';
import type { GuestSelection } from '../../types/search';
import { useLanguage } from '../../context';

// ─── Tour Mock Dataset (Vietnamese) ───────────────────────────────────────────
interface TourDetail {
    id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    ratingText: string;
    reviews: number;
    stars: number;
    description: string;
    inclusions: { name: string; icon: string }[];
    images: string[];
    itinerary: { time: string; title: string; desc: string }[];
    reviewList: { author: string; date: string; score: number; text: string; country: string }[];
}

const TOUR_DETAILS_VI: Record<string, TourDetail> = {
    '1': {
        id: '1',
        name: 'Kỳ nghỉ dưỡng Maldives 4N3Đ - Overwater Villa',
        location: 'Maldives',
        price: 28500000,
        rating: 4.9,
        ratingText: 'Superb',
        reviews: 942,
        stars: 5,
        description: 'Tận hưởng thiên đường hạ giới tại Overwater Villa sang trọng bậc nhất Maldives. Thỏa thích vẫy vùng trong làn nước biển trong vắt như pha lê ngay dưới chân ban công của bạn, thưởng thức ẩm thực chuẩn quốc tế, tham gia lặn ngắm rặng san hô tự nhiên và thư giãn với dịch vụ quản gia 24/7 chuyên nghiệp.',
        inclusions: [
            { name: 'Khứ hồi Tàu cao tốc', icon: 'directions_boat' },
            { name: 'Overwater Villa hạng sang', icon: 'holiday_village' },
            { name: 'Ăn uống trọn gói (All-Inclusive)', icon: 'restaurant' },
            { name: 'Dụng cụ lặn ngắm san hô', icon: 'scuba' },
            { name: 'WiFi tốc độ cao miễn phí', icon: 'wifi' },
            { name: 'Quản gia riêng 24/7', icon: 'support_agent' },
        ],
        images: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: 'Ngày 1', title: 'Đón sân bay - Nhận phòng Overwater Villa & Tiệc đón hoàng hôn', desc: 'Tàu cao tốc đón quý khách từ sân bay Malé về resort nghỉ dưỡng. Làm thủ tục nhận phòng nổi trên mặt nước độc đáo, tự do khám phá và thưởng thức cocktail nhẹ bên bờ biển lúc hoàng hôn.' },
            { time: 'Ngày 2', title: 'Lặn biển ngắm Cá cúi & Tiệc nướng BBQ bãi biển riêng tư', desc: 'Tham gia tour lặn biển có hướng dẫn viên đi kèm để chiêm ngưỡng rạn san hô nguyên sơ, cá rùa và các sinh vật biển kỳ thú. Buổi tối thưởng thức tiệc BBQ hải sản tươi ngon ngay trên bãi cát mịn.' },
            { time: 'Ngày 3', title: 'Trị liệu Spa trên nước, Chèo thuyền Kayak & Bữa tối tại nhà hàng dưới đại dương', desc: 'Thư giãn hoàn toàn với 60 phút massage tại spa chuyên nghiệp. Trải nghiệm chèo thuyền kayak trong suốt và khép lại ngày dài bằng bữa tối lãng mạn dưới lòng đại dương sâu thẳm.' },
            { time: 'Ngày 4', title: 'Yoga đón bình minh, Bữa sáng trôi nổi & Tạm biệt thiên đường', desc: 'Tham gia lớp yoga thư giãn đón ánh bình minh rạng rỡ. Thưởng thức Floating Breakfast độc đáo tại hồ bơi riêng. Xe tàu cao tốc đưa quý khách trở lại sân bay làm thủ tục về nước.' },
        ],
        reviewList: [
            { author: 'Elena Rodriguez', date: 'Tháng 10, 2024', score: 10, text: 'Thật sự kỳ diệu và khó quên! Việc mở cửa ra là thấy ngay đàn cá bơi lội dưới chân mình là một trải nghiệm tuyệt vời nhất đời tôi. Dịch vụ chăm sóc khách hàng vô cùng chu đáo.', country: 'Tây Ban Nha' },
            { author: 'Linh Nguyễn', date: 'Tháng 08, 2024', score: 9.8, text: 'Mọi thứ từ cảnh quan, phòng ốc tới chất lượng ẩm thực đều hoàn hảo. Rất đáng đồng tiền bát gạo cho một kỳ nghỉ dưỡng trọn vẹn tại Maldives.', country: 'Việt Nam' },
        ],
    },
    '2': {
        id: '2',
        name: 'Tour Nhật Bản mùa Hoa Anh Đào - Ngắm núi Phú Sĩ',
        location: 'Tokyo - Kyoto - Phú Sĩ, Nhật Bản',
        price: 24900000,
        rating: 4.8,
        ratingText: 'Excellent',
        reviews: 1420,
        stars: 5,
        description: 'Chiêm ngưỡng vẻ đẹp lay động lòng người của xứ sở Phù Tang vào mùa hoa anh đào (Sakura) nở rộ. Hành trình đưa quý khách khám phá thủ đô Tokyo hiện đại, thưởng ngoạn cảnh sắc núi Phú Sĩ hùng vĩ soi bóng bên hồ Ashi thơ mộng và trải nghiệm nét cổ kính, trang nghiêm tại cố đô Kyoto thanh bình.',
        inclusions: [
            { name: 'Vé tàu cao tốc Shinkansen', icon: 'train' },
            { name: 'Khách sạn tiêu chuẩn 4 sao', icon: 'hotel' },
            { name: 'Hướng dẫn viên tiếng Việt', icon: 'badge' },
            { name: 'Toàn bộ vé tham quan', icon: 'confirmation_number' },
            { name: 'Bữa ăn Kaiseki truyền thống', icon: 'restaurant' },
            { name: 'Cục phát WiFi du lịch', icon: 'wifi' },
        ],
        images: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1490761902450-9a6a6f95e672?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: 'Ngày 1', title: 'Hạ cánh Tokyo - Khám phá phố đêm Shinjuku sầm uất', desc: 'Hướng dẫn viên đón đoàn tại sân bay Narita/Haneda, di chuyển về nhận phòng khách sạn tại trung tâm Tokyo. Tối tự do dạo phố ẩm thực Omoide Yokocho và ngắm nhìn ánh đèn neon đặc trưng của Shinjuku.' },
            { time: 'Ngày 2', title: 'Đền cổ Asakusa Senso-ji, Ngắm hoa anh đào công viên Ueno & Shibuya Sky', desc: 'Viếng ngôi đền cổ kính Asakusa linh thiêng. Sau đó hòa mình vào sắc hồng rực rỡ của hàng nghìn cây anh đào nở rộ tại công viên Ueno. Chiều muộn, ngắm toàn cảnh Tokyo từ đài quan sát Shibuya Sky.' },
            { time: 'Ngày 3', title: 'Khám phá Núi Phú Sĩ - Du thuyền Hồ Ashi & Trải nghiệm tắm Onsen cổ truyền', desc: 'Di chuyển đến trạm số 5 núi Phú Sĩ ngắm tuyết trắng. Lên du thuyền thưởng ngoạn phong cảnh hồ Ashi thơ mộng. Tối thư giãn tắm khoáng nóng Onsen phục hồi sức khỏe tại resort Hakone.' },
            { time: 'Ngày 4', title: 'Trải nghiệm tàu Shinkansen - Cố đô Kyoto: Đền Fushimi Inari & Rừng trúc Arashiyama', desc: 'Trải nghiệm tốc độ vượt trội của tàu điện đầu đạn Shinkansen đến Kyoto. Ghé thăm ngôi đền ngàn cổng Torii đỏ rực Fushimi Inari và dạo bước thanh tịnh trong rừng trúc xanh mướt Arashiyama trước khi kết thúc tour.' },
        ],
        reviewList: [
            { author: 'Marcus Chen', date: 'Tháng 10, 2024', score: 9.5, text: 'Chuyến đi được tổ chức cực kỳ chuyên nghiệp. Hoa anh đào nở rộ rất đẹp và thời tiết tại núi Phú Sĩ vô cùng ủng hộ. Cảm ơn hướng dẫn viên rất nhiều.', country: 'Singapore' },
            { author: 'Minh Trần', date: 'Tháng 09, 2024', score: 10, text: 'Ẩm thực Nhật Bản tuyệt vời, khách sạn đẹp và nằm gần ga tàu nên đi lại thuận tiện. Rất hài lòng về chất lượng dịch vụ!', country: 'Việt Nam' },
        ],
    },
    '3': {
        id: '3',
        name: 'Khám phá thủ đô Tokyo phồn hoa về đêm',
        location: 'Tokyo, Nhật Bản',
        price: 12500000,
        rating: 4.7,
        ratingText: 'Very Good',
        reviews: 680,
        stars: 4,
        description: 'Hòa mình vào nhịp sống về đêm náo nhiệt và đầy cuốn hút của Tokyo. Trải nghiệm đi bộ qua ngã tư Shibuya đông đúc bậc nhất hành tinh, len lỏi qua các con hẻm Izakaya nhỏ hẹp nhuốm màu thời gian để thưởng thức bia lạnh và xiên nướng Yakitori thơm phức, và thưởng ngoạn Tokyo từ một góc nhìn lung linh đầy chất nghệ thuật từ quầy bar trên tầng thượng.',
        inclusions: [
            { name: 'Hướng dẫn viên bản địa', icon: 'hail' },
            { name: 'Bữa tối Izakaya & Đồ uống', icon: 'local_bar' },
            { name: 'Tour chụp ảnh đêm nghệ thuật', icon: 'photo_camera' },
            { name: 'Vé vào cửa Rooftop Bar', icon: 'view_in_ar' },
            { name: 'Vé phương tiện công cộng', icon: 'subway' },
            { name: 'Nhóm nhỏ (Tối đa 8 người)', icon: 'groups' },
        ],
        images: [
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: '18:00', title: 'Tập trung tại Shibuya - Trải nghiệm ngã tư huyền thoại', desc: 'Gặp gỡ hướng dẫn viên bản địa tại tượng đài chú chó Hachiko huyền thoại. Đi bộ qua ngã tư Shibuya nhộn nhịp và ghé thăm một quán đứng (Tachinomi) đậm chất đường phố để thưởng thức ly bia đầu tiên.' },
            { time: '19:30', title: 'Len lỏi con hẻm Omoide Yokocho thưởng thức Yakitori truyền thống', desc: 'Di chuyển sang Shinjuku, khám phá con hẻm nhỏ Omoide Yokocho mang đậm ký ức thời Showa. Ngồi bên quầy nướng ấm cúng, nhâm nhi những xiên thịt nướng thơm lừng cùng ly rượu sake hảo hạng.' },
            { time: '21:00', title: 'Dạo quanh khu phố đèn màu Kabukicho & Check-in Golden Gai cổ điển', desc: 'Tản bộ qua thiên đường giải trí Kabukicho nổi tiếng với những bảng hiệu neon khổng lồ. Khám phá khu phố Golden Gai với hàng trăm quán bar mini độc đáo nằm san sát nhau.' },
            { time: '22:30', title: 'Ngắm cảnh đêm tại Rooftop Bar đẳng cấp & Kết thúc hành trình', desc: 'Trải nghiệm ngắm toàn cảnh thành phố lung linh từ trên cao tại một rooftop bar sang trọng. Hướng dẫn viên chia sẻ các tips du lịch ban đêm và kết thúc tour vô cùng trọn vẹn.' },
        ],
        reviewList: [
            { author: 'James Wilson', date: 'Tháng 10, 2024', score: 10, text: 'Quá sức tuyệt vời! Nếu tự đi, tôi chắc chắn sẽ không bao giờ tìm thấy những quán ăn nhỏ trong ngõ hẹp ấm cúng như thế này. Đồ ăn siêu ngon và hướng dẫn viên rất vui vẻ nhiệt tình.', country: 'Úc' },
        ],
    },
};

// ─── Tour Mock Dataset (English) ──────────────────────────────────────────────
const TOUR_DETAILS_EN: Record<string, TourDetail> = {
    '1': {
        id: '1',
        name: 'Maldives 4D3N Vacation - Overwater Villa',
        location: 'Maldives',
        price: 28500000,
        rating: 4.9,
        ratingText: 'Superb',
        reviews: 942,
        stars: 5,
        description: 'Enjoy a slice of paradise at the most luxurious Overwater Villa in Maldives. Immerse yourself in the crystal-clear turquoise waters right below your balcony, savor world-class dining, snorkel in vibrant coral reefs, and enjoy 24/7 butler service.',
        inclusions: [
            { name: 'Round-trip Speedboat', icon: 'directions_boat' },
            { name: 'Luxury Overwater Villa', icon: 'holiday_village' },
            { name: 'All-Inclusive Dining', icon: 'restaurant' },
            { name: 'Snorkeling Gear', icon: 'scuba' },
            { name: 'Free High-Speed WiFi', icon: 'wifi' },
            { name: '24/7 Private Butler', icon: 'support_agent' },
        ],
        images: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: 'Day 1', title: 'Airport Pick-up - Overwater Villa Check-in & Sunset Welcome Party', desc: 'Speedboat pick-up from Malé Airport to the resort. Check into your unique overwater villa, explore, and enjoy light cocktails by the beach at sunset.' },
            { time: 'Day 2', title: 'Dugong Snorkeling & Private Beach BBQ Party', desc: 'Join a guided snorkeling tour to admire pristine coral reefs, sea turtles, and exotic marine life. In the evening, enjoy a fresh seafood BBQ dinner right on the fine sand.' },
            { time: 'Day 3', title: 'Overwater Spa Treatment, Kayaking & Undersea Restaurant Dinner', desc: 'Relax completely with a 60-minute massage at the professional spa. Experience transparent kayaking and close out the day with a romantic dinner beneath the deep ocean.' },
            { time: 'Day 4', title: 'Sunrise Yoga, Floating Breakfast & Farewell Paradise', desc: 'Join a relaxing yoga class to welcome the radiant sunrise. Savor a unique Floating Breakfast in your private pool. Speedboat transfers you back to the airport for your flight home.' },
        ],
        reviewList: [
            { author: 'Elena Rodriguez', date: 'October, 2024', score: 10, text: 'Truly magical and unforgettable! Stepping right out of the villa to see schools of fish swimming beneath my feet was one of the best experiences of my life. The customer service was incredibly attentive.', country: 'Spain' },
            { author: 'Linh Nguyen', date: 'August, 2024', score: 9.8, text: 'Everything from the landscape, rooms to food quality was perfect. Totally worth every penny for a complete getaway in Maldives.', country: 'Vietnam' },
        ],
    },
    '2': {
        id: '2',
        name: 'Japan Cherry Blossom Tour - Mt. Fuji Sightseeing',
        location: 'Tokyo - Kyoto - Mt. Fuji, Japan',
        price: 24900000,
        rating: 4.8,
        ratingText: 'Excellent',
        reviews: 1420,
        stars: 5,
        description: 'Witness the breathtaking beauty of the Land of the Rising Sun during the cherry blossom (Sakura) peak bloom. The journey takes you to explore the modern capital of Tokyo, admire the majestic Mt. Fuji reflecting on the romantic Lake Ashi, and experience the ancient, solemn Kyoto.',
        inclusions: [
            { name: 'Shinkansen Bullet Train Ticket', icon: 'train' },
            { name: '4-Star Standard Hotel', icon: 'hotel' },
            { name: 'English-speaking Guide', icon: 'badge' },
            { name: 'All Admission Tickets', icon: 'confirmation_number' },
            { name: 'Traditional Kaiseki Dinner', icon: 'restaurant' },
            { name: 'Pocket WiFi Device', icon: 'wifi' },
        ],
        images: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1490761902450-9a6a6f95e672?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: 'Day 1', title: 'Tokyo Arrival - Shinjuku Night Exploration', desc: 'Guide welcomes you at Narita/Haneda airport, transfer to hotel in downtown Tokyo. Free evening to stroll through Omoide Yokocho food alley and see Shinjuku\'s signature neon lights.' },
            { time: 'Day 2', title: 'Asakusa Senso-ji Temple, Ueno Park Cherry Blossom & Shibuya Sky', desc: 'Visit the sacred, ancient Asakusa temple. Immerse yourself in the brilliant pink of thousands of cherry trees blooming at Ueno Park. Late afternoon, take in Tokyo panoramic views from Shibuya Sky observatory.' },
            { time: 'Day 3', title: 'Mt. Fuji Exploration - Lake Ashi Cruise & Traditional Onsen Bathing', desc: 'Travel to Mt. Fuji Station 5 to admire white snow. Board a cruise to take in Lake Ashi scenery. Relax in the evening with a hot Onsen spring bath at a Hakone resort.' },
            { time: 'Day 4', title: 'Shinkansen Bullet Train Experience - Kyoto: Fushimi Inari & Arashiyama Bamboo Forest', desc: 'Experience the outstanding speed of the Shinkansen bullet train to Kyoto. Visit the Fushimi Inari shrine with thousands of red Torii gates and take a peaceful walk in Arashiyama bamboo forest before the tour ends.' },
        ],
        reviewList: [
            { author: 'Marcus Chen', date: 'October, 2024', score: 9.5, text: 'Excellently organized trip. Cherry blossoms were beautiful and weather at Mt. Fuji was very supportive. Thank you to the guide.', country: 'Singapore' },
            { author: 'Minh Tran', date: 'September, 2024', score: 10, text: 'Japanese cuisine is amazing, hotel was nice and close to the train station. Very satisfied with service quality!', country: 'Vietnam' },
        ],
    },
    '3': {
        id: '3',
        name: 'Explore Bustling Tokyo Capital at Night',
        location: 'Tokyo, Japan',
        price: 12500000,
        rating: 4.7,
        ratingText: 'Very Good',
        reviews: 680,
        stars: 4,
        description: 'Immerse yourself in Tokyo\'s bustling and fascinating nightlife. Walk through the busiest Shibuya crossing on the planet, wander through narrow Izakaya alleys to enjoy cold beer and aromatic grilled Yakitori skewers, and admire a sparkling, artistic Tokyo from a rooftop bar.',
        inclusions: [
            { name: 'Local English-speaking Guide', icon: 'hail' },
            { name: 'Izakaya Dinner & Drinks', icon: 'local_bar' },
            { name: 'Night Photography Tour', icon: 'photo_camera' },
            { name: 'Rooftop Bar Entrance Ticket', icon: 'view_in_ar' },
            { name: 'Public Transportation Ticket', icon: 'subway' },
            { name: 'Small Group (Max 8 people)', icon: 'groups' },
        ],
        images: [
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        ],
        itinerary: [
            { time: '18:00', title: 'Meet at Shibuya - Legendary Crossing Experience', desc: 'Meet local guide at the Hachiko statue. Walk through the busy Shibuya crossing and visit a street-style standing bar (Tachinomi) for your first beer.' },
            { time: '19:30', title: 'Explore Omoide Yokocho Alley for Traditional Yakitori', desc: 'Transfer to Shinjuku, explore the narrow Omoide Yokocho alley full of Showa era memories. Sit at a cozy grill counter, enjoy delicious skewers and fine sake.' },
            { time: '21:00', title: 'Stroll around Kabukicho Red-light District & Check-in Golden Gai', desc: 'Walk through the famous Kabukicho entertainment district with giant neon signs. Explore Golden Gai with hundreds of unique mini bars lined side by side.' },
            { time: '22:30', title: 'Rooftop Bar Night Views & Tour End', desc: 'Experience the sparkling skyline from a luxury rooftop bar. Guide shares night travel tips and concludes the tour beautifully.' },
        ],
        reviewList: [
            { author: 'James Wilson', date: 'October, 2024', score: 10, text: 'Absolutely amazing! I would have never found those cozy back alley restaurants on my own. Super tasty food and very friendly guide.', country: 'Australia' },
        ],
    },
};

// ─── Default Fallback Dataset (Vietnamese) ───────────────────────────────────
const getFallbackTour = (id: string, name: string, price: number, desc: string, location: string): TourDetail => ({
    id,
    name: name || 'Tour du lịch trải nghiệm',
    location: location || 'Điểm tham quan',
    price,
    rating: 4.7,
    ratingText: 'Very Good',
    reviews: 124,
    stars: 4,
    description: desc || 'Khám phá những trải nghiệm độc đáo, hòa mình vào thiên nhiên và văn hóa bản địa tuyệt vời tại điểm đến du lịch của bạn.',
    inclusions: [
        { name: 'Xe du lịch máy lạnh đưa đón', icon: 'directions_bus' },
        { name: 'Nước uống khoáng chai miễn phí', icon: 'water_drop' },
        { name: 'Hướng dẫn viên tận tình suốt tuyến', icon: 'hail' },
        { name: 'Toàn bộ vé tham quan thắng cảnh', icon: 'confirmation_number' },
        { name: 'Bữa ăn trưa theo chương trình', icon: 'restaurant' },
    ],
    images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=600&q=80',
    ],
    itinerary: [
        { time: 'Buổi sáng', title: 'Đón khách di chuyển & Tham quan địa điểm thứ nhất', desc: 'Xe và hướng dẫn viên đón quý khách tại điểm hẹn hoặc khách sạn. Di chuyển đến điểm tham quan đầu tiên, bắt đầu hành trình khám phá đầy hào hứng.' },
        { time: 'Buổi trưa', title: 'Thưởng thức ẩm thực địa phương đặc sản & Nghỉ ngơi', desc: 'Dùng bữa trưa thịnh soạn tại nhà hàng truyền thống với các món ăn đặc trưng đậm đà hương vị bản địa. Tự do nghỉ ngơi chụp hình phong cảnh.' },
        { time: 'Buổi chiều', title: 'Tham quan mua sắm đặc sản làm quà & Trở về điểm đón ban đầu', desc: 'Tham quan địa điểm nổi bật tiếp theo, mua sắm đồ lưu niệm. Lên xe di chuyển an toàn quay trở về khách sạn hoặc điểm hẹn ban đầu. Chào tạm biệt đoàn.' },
    ],
    reviewList: [
        { author: 'Khách du lịch', date: 'Tháng 10, 2024', score: 9.0, text: 'Chuyến đi rất thú vị, cảnh quan thiên nhiên đẹp và đồ ăn ngon miệng. Phục vụ chu đáo chuyên nghiệp.', country: 'Việt Nam' }
    ]
});

// ─── Default Fallback Dataset (English) ───────────────────────────────────────
const getFallbackTourEn = (id: string, name: string, price: number, desc: string, location: string): TourDetail => ({
    id,
    name: name || 'Experiential Tour Packages',
    location: location || 'Sightseeing Attraction',
    price,
    rating: 4.7,
    ratingText: 'Very Good',
    reviews: 124,
    stars: 4,
    description: desc || 'Explore unique experiences, immerse yourself in nature and wonderful local culture at your travel destination.',
    inclusions: [
        { name: 'Air-conditioned tourist shuttle', icon: 'directions_bus' },
        { name: 'Free bottled mineral water', icon: 'water_drop' },
        { name: 'Attentive tour guide throughout', icon: 'hail' },
        { name: 'All sightseeing admission tickets', icon: 'confirmation_number' },
        { name: 'Lunch included in program', icon: 'restaurant' },
    ],
    images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=600&q=80',
    ],
    itinerary: [
        { time: 'Morning', title: 'Pick-up, transfer & visit the first location', desc: 'Shuttle bus and tour guide pick you up at the hotel or meeting point. Move to the first attraction, starting the exciting journey.' },
        { time: 'Noon', title: 'Savor local culinary specialties & rest', desc: 'Enjoy a rich lunch at a traditional restaurant with characteristic local flavors. Free time for photos and relaxation.' },
        { time: 'Afternoon', title: 'Explore, shop for souvenirs & return to original point', desc: 'Visit the next famous highlight, shop for local specialties. Move back safely to your hotel or meeting point. Say goodbye.' },
    ],
    reviewList: [
        { author: 'Traveler', date: 'October, 2024', score: 9.0, text: 'Very interesting trip, beautiful scenery, and delicious food. Professional and thoughtful service.', country: 'Vietnam' }
    ]
});

const fmt = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ExperienceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { t, language, translateRating } = useLanguage();

    // Booking states
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState<GuestSelection>({ adults: 1, children: 0, rooms: 1 });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);

    // Read details from params or fallback
    const urlName = searchParams.get('attraction') || '';
    const urlPrice = Number(searchParams.get('price')) || 1500000;
    const urlDesc = searchParams.get('desc') || '';
    const urlPickup = searchParams.get('pickup') || '';

    const tour = useMemo(() => {
        const detailsSource = language === 'en' ? TOUR_DETAILS_EN : TOUR_DETAILS_VI;
        const fallbackFn = language === 'en' ? getFallbackTourEn : getFallbackTour;

        if (id && detailsSource[id]) {
            const mockTour = detailsSource[id];
            // Chỉ sử dụng dữ liệu cứng nếu tên tour trùng khớp (tránh đè ID với database)
            if (!urlName || mockTour.name.toLowerCase().includes(urlName.toLowerCase()) || urlName.toLowerCase().includes(mockTour.name.toLowerCase())) {
                return mockTour;
            }
        }
        return fallbackFn(id || 'default', urlName, urlPrice, urlDesc, urlPickup);
    }, [id, urlName, urlPrice, urlDesc, urlPickup, language]);

    // Total Calculation
    const totalPeople = guests.adults + guests.children;
    const totalPrice = useMemo(() => {
        return tour.price ? tour.price * totalPeople : urlPrice * totalPeople;
    }, [tour.price, urlPrice, totalPeople]);

    // Handle Book Now
    const handleBookNow = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
        } else {
            const params = new URLSearchParams({
                type: 'tour',
                name: tour.name,
                image: tour.images[0],
                price: String(tour.price),
                quantity: '1',
                detail1: tour.location,
                detail2: t('detail.packageTour', 'Trải nghiệm du lịch trọn gói'),
                detail3: `${totalPeople} ${t('detail.guestUnit', 'Khách du lịch')}`,
                detail4: selectedDate ? selectedDate.format('DD/MM/YYYY') : t('detail.chooseDateLater', 'Chọn ngày sau'),
            });
            navigate(`/booking?${params.toString()}`);
        }
    };

    // Disable past dates
    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <div className="bg-[#f5f7fa] min-h-screen font-['Plus_Jakarta_Sans']">
            {/* ── Image Gallery ── */}
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-[1200px] mx-auto px-4">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#005CE6] font-semibold text-sm mb-4 hover:opacity-80 transition"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        {t('detail.backToResults', 'Quay lại kết quả')}
                    </button>

                    {/* Image grid */}
                    <div
                        className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => setShowAllImages(true)}
                    >
                        {/* Main image */}
                        <div className="col-span-2 row-span-2 relative">
                            <img
                                src={tour.images[0]}
                                alt={tour.name}
                                className="w-full h-full object-cover hover:brightness-90 transition-all"
                            />
                        </div>
                        {/* Side images */}
                        {tour.images.slice(1, 5).map((img, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <img
                                    src={img}
                                    alt={`Tour view ${i + 2}`}
                                    className="w-full h-full object-cover hover:brightness-90 transition-all"
                                />
                                {i === 3 && tour.images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                        {t('detail.moreImages', '+{count} Ảnh').replace('{count}', String(tour.images.length - 5))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Left Column */}
                <div className="flex-1 min-w-0">
                    {/* Tour Header Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: tour.stars }).map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>
                            ))}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2">{tour.name}</h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {tour.location}
                            <span className="text-[#005CE6] ml-2 font-semibold cursor-pointer hover:underline">{t('detail.showMap', '— Xem bản đồ')}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#005CE6] text-white font-black px-3 py-1.5 rounded-lg text-base">
                                {tour.rating.toFixed(1)}
                            </span>
                            <div>
                                <div className="font-bold text-gray-900">{translateRating(tour.ratingText)}</div>
                                <div className="text-sm text-gray-500">{t('detail.basedOnReviews', 'Dựa trên {count} lượt đánh giá').replace('{count}', tour.reviews.toLocaleString())}</div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
                    </div>

                    {/* Highlights & Inclusions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">{t('detail.inclusions', 'Dịch vụ đi kèm & Tiện ích')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4">
                            {tour.inclusions.map(inc => (
                                <div key={inc.name} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="material-symbols-outlined text-[20px] text-[#005CE6] flex-shrink-0">
                                        {inc.icon}
                                    </span>
                                    <span>{inc.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Itinerary / Timeline */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-bold text-lg text-gray-900 mb-6">{t('detail.itinerary', 'Lịch trình chi tiết')}</h2>
                        <div className="relative border-l border-gray-200 ml-3 pl-6 space-y-8">
                            {tour.itinerary.map((step, idx) => (
                                <div key={idx} className="relative">
                                    {/* Circle marker */}
                                    <span className="absolute -left-[31px] top-0.5 bg-[#005CE6] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <span className="inline-block bg-blue-50 text-[#005CE6] text-xs font-bold px-2 py-0.5 rounded mb-1">
                                            {step.time}
                                        </span>
                                        <h3 className="font-bold text-gray-900 text-base mb-1">{step.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl text-gray-900">{t('detail.customerReviews', 'Đánh giá thực tế từ khách hàng')}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">{translateRating(tour.ratingText)}</span>
                                <span className="bg-[#005CE6] text-white font-black px-3 py-1 rounded-lg">
                                    {tour.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {tour.reviewList.map((review, i) => (
                                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005CE6] to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                                {review.author[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{review.author}</div>
                                                <div className="text-xs text-gray-400">{review.country} · {review.date}</div>
                                            </div>
                                        </div>
                                        <span className="bg-[#005CE6] text-white font-bold text-sm px-2 py-0.5 rounded">
                                            {review.score}/10
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-12">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sticky Card */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-[#005CE6] shadow-lg p-5 sticky top-24">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">{t('detail.priceFrom', 'Giá chỉ từ')}</div>
                        <div className="text-3xl font-black text-[#005CE6] mb-1">
                            {tour.price ? tour.price.toLocaleString() : urlPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">{t('detail.perGuest', 'VNĐ / khách · Đã gồm thuế')}</div>

                        <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 inline-block">
                            {t('detail.bestPriceCommit', '✓ Cam kết giá tốt nhất')}
                        </div>

                        {/* Interactive Picker Details */}
                        <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
                            {/* Date Picker */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('detail.departureDate', 'Ngày khởi hành')}</label>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    disabledDate={disabledDate}
                                    format="DD/MM/YYYY"
                                    placeholder={t('detail.dateTourPlaceholder', 'Chọn ngày đi')}
                                    style={{ width: '100%' }}
                                    size="large"
                                    className="border-gray-200 rounded-lg hover:border-[#005CE6] focus:border-[#005CE6]"
                                />
                            </div>

                            {/* Guest Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('detail.numGuests', 'Số lượng khách')}</label>
                                <GuestSelector value={guests} onChange={setGuests} simpleMode={true} />
                            </div>
                        </div>

                        {/* Cost breakdown */}
                        <div className="mt-4 border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>{totalPeople} {t('detail.guestUnit', 'Khách du lịch')}</span>
                                <span className="font-bold text-gray-800">{fmt(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('detail.taxServiceFee', 'Thuế & Phí dịch vụ')}</span>
                                <span className="font-bold text-green-600">{t('detail.free', 'Miễn phí')}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
                                <span>{t('detail.total', 'Tổng cộng:')}</span>
                                <span className="text-[#005CE6]">{fmt(totalPrice)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBookNow}
                            className="w-full mt-5 bg-[#005CE6] text-white py-3 rounded-xl font-bold text-base hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">local_activity</span>
                            {t('detail.bookNowTour', 'Đặt Ngay')}
                        </button>

                        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-green-500 flex-shrink-0 mt-0.5">verified</span>
                            <span>{t('detail.trustPartnerNote', 'Đối tác bảo mật của Booking Travel · Đáng tin cậy cho 3M+ khách du lịch toàn cầu')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
            {showAllImages && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center"
                    onClick={() => setShowAllImages(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition"
                        onClick={() => setShowAllImages(false)}
                    >
                        ✕
                    </button>
                    <div className="max-w-3xl w-full px-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={tour.images[selectedImageIdx]}
                            alt="Tour Details"
                            className="w-full h-auto max-h-[70vh] object-contain rounded-xl mb-4"
                        />
                        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                            {tour.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    onClick={() => setSelectedImageIdx(i)}
                                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 ${
                                        i === selectedImageIdx
                                            ? 'border-[#005CE6]'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </div>
    );
};

export default ExperienceDetail;

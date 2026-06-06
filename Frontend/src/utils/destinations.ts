export interface DestinationItem {
    city: string;
    detail: string;
    isInternational?: boolean;
}

export const ALL_DESTINATIONS: DestinationItem[] = [
    // Vietnam domestic
    { city: 'Hanoi', detail: 'Hanoi, Vietnam (HAN - Noi Bai Intl.)' },
    { city: 'Ho Chi Minh City', detail: 'Ho Chi Minh City, Vietnam (SGN - Tan Son Nhat Intl.)' },
    { city: 'Da Nang', detail: 'Da Nang, Vietnam (DAD - Da Nang Intl.)' },
    { city: 'Nha Trang', detail: 'Nha Trang, Vietnam (CXR - Cam Ranh Intl.)' },
    { city: 'Phu Quoc', detail: 'Phu Quoc, Vietnam (PQC - Phu Quoc Airport)' },
    { city: 'Da Lat', detail: 'Da Lat, Vietnam (DLI - Lien Khuong Airport)' },
    { city: 'Hue', detail: 'Hue, Vietnam (HUI - Phu Bai Airport)' },
    { city: 'Hoi An', detail: 'Hoi An, Quang Nam, Vietnam' },
    { city: 'Ha Long Bay', detail: 'Ha Long Bay, Quang Ninh, Vietnam' },
    { city: 'Sapa', detail: 'Sapa, Lao Cai, Vietnam' },
    { city: 'Vung Tau', detail: 'Vung Tau, Ba Ria - Vung Tau, Vietnam' },
    { city: 'Can Tho', detail: 'Can Tho, Vietnam (VCA - Can Tho Intl.)' },
    { city: 'Quy Nhon', detail: 'Quy Nhon, Vietnam (UIH - Phu Cat Airport)' },
    { city: 'Phu Yen', detail: 'Phu Yen, Vietnam (TBB - Tuy Hoa Airport)' },
    { city: 'Con Dao', detail: 'Con Dao, Vietnam (VCS - Con Dao Airport)' },
    { city: 'Buon Ma Thuot', detail: 'Buon Ma Thuot, Vietnam (BMV - Buon Ma Thuot Airport)' },
    { city: 'Pleiku', detail: 'Pleiku, Vietnam (PXU - Pleiku Airport)' },
    { city: 'Rach Gia', detail: 'Rach Gia, Vietnam (VKG - Rach Gia Airport)' },
    { city: 'Ca Mau', detail: 'Ca Mau, Vietnam (CAH - Ca Mau Airport)' },
    { city: 'Vinh', detail: 'Vinh, Vietnam (VII - Vinh Airport)' },
    { city: 'Hai Phong', detail: 'Hai Phong, Vietnam (HPH - Cat Bi Intl.)' },
    { city: 'Dong Hoi', detail: 'Dong Hoi, Vietnam (VDH - Dong Hoi Airport)' },
    { city: 'Thanh Hoa', detail: 'Thanh Hoa, Vietnam (THD - Tho Xuan Airport)' },
    
    // International
    { city: 'Bangkok', detail: 'Bangkok, Thailand (BKK - Suvarnabhumi Airport)', isInternational: true },
    { city: 'Singapore', detail: 'Singapore (SIN - Changi Airport)', isInternational: true },
    { city: 'Seoul', detail: 'Seoul, South Korea (ICN - Incheon Intl.)', isInternational: true },
    { city: 'Tokyo', detail: 'Tokyo, Japan (NRT - Narita Airport / HND - Haneda Airport)', isInternational: true },
    { city: 'Kuala Lumpur', detail: 'Kuala Lumpur, Malaysia (KUL - Kuala Lumpur Intl.)', isInternational: true },
    { city: 'Taipei', detail: 'Taipei, Taiwan (TPE - Taoyuan Airport)', isInternational: true },
    { city: 'Bali', detail: 'Bali, Indonesia (DPS - Ngurah Rai Intl.)', isInternational: true },
    { city: 'Hong Kong', detail: 'Hong Kong (HKG - Hong Kong Intl.)', isInternational: true },
    { city: 'Siem Reap', detail: 'Siem Reap, Cambodia (SAI - Siem Reap–Angkor Airport)', isInternational: true },
    { city: 'Paris', detail: 'Paris, France (CDG - Charles de Gaulle Airport)', isInternational: true },
    { city: 'London', detail: 'London, United Kingdom (LHR - Heathrow Airport)', isInternational: true },
    { city: 'New York', detail: 'New York, USA (JFK - John F. Kennedy Airport)', isInternational: true },
    { city: 'Sydney', detail: 'Sydney, Australia (SYD - Sydney Kingsford Smith Airport)', isInternational: true }
];

// Normalize text by converting to lowercase and stripping Vietnamese accents
const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
};

export const filterDestinations = (query: string): DestinationItem[] => {
    const cleanQuery = normalizeText(query);
    if (!cleanQuery) {
        // Return a mix of domestic and international destinations by default
        const domestic = ALL_DESTINATIONS.filter(d => !d.isInternational).slice(0, 4);
        const international = ALL_DESTINATIONS.filter(d => d.isInternational).slice(0, 4);
        return [...domestic, ...international];
    }
    
    return ALL_DESTINATIONS.filter(item => {
        const cleanCity = normalizeText(item.city);
        const cleanDetail = normalizeText(item.detail);
        return cleanCity.includes(cleanQuery) || cleanDetail.includes(cleanQuery);
    });
};

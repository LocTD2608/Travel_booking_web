import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlFilters {
    // Query chung
    query?: string;
    // Filters
    from?: string;
    to?: string;
    destination?: string;
    date?: string;
    returnDate?: string;
    checkIn?: string;
    checkOut?: string;
    passengers?: string;
    adults?: string;
    children?: string;
    rooms?: string;
    priceMin?: string;
    priceMax?: string;
    rating?: string;
    sortBy?: string;
    sortOrder?: string;
    // Pagination
    page?: string;
    pageSize?: string;
}

/**
 * Hook dùng chung để đọc/ghi filters + pagination vào URL.
 * 
 * Cách dùng:
 *   const { filters, setFilter, setPage, resetFilters } = useUrlFilters();
 */
export function useUrlFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Đọc tất cả filters từ URL thành object
    const filters: UrlFilters = {
        query: searchParams.get('query') ?? undefined,
        from: searchParams.get('from') ?? undefined,
        to: searchParams.get('to') ?? undefined,
        destination: searchParams.get('destination') ?? undefined,
        date: searchParams.get('date') ?? undefined,
        returnDate: searchParams.get('returnDate') ?? undefined,
        checkIn: searchParams.get('checkIn') ?? undefined,
        checkOut: searchParams.get('checkOut') ?? undefined,
        passengers: searchParams.get('passengers') ?? undefined,
        adults: searchParams.get('adults') ?? undefined,
        children: searchParams.get('children') ?? undefined,
        rooms: searchParams.get('rooms') ?? undefined,
        priceMin: searchParams.get('priceMin') ?? undefined,
        priceMax: searchParams.get('priceMax') ?? undefined,
        rating: searchParams.get('rating') ?? undefined,
        sortBy: searchParams.get('sortBy') ?? undefined,
        sortOrder: searchParams.get('sortOrder') ?? undefined,
        page: searchParams.get('page') ?? '1',
        pageSize: searchParams.get('pageSize') ?? '10',
    };

    /** Cập nhật một hoặc nhiều filter, tự reset về trang 1 */
    const setFilter = useCallback((newFilters: Partial<UrlFilters>) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            // Reset về trang 1 khi đổi filter (trừ khi đang set page)
            if (!('page' in newFilters)) {
                next.set('page', '1');
            }
            return next;
        });
    }, [setSearchParams]);

    /** Chuyển trang (chỉ đổi page, giữ nguyên các filter khác) */
    const setPage = useCallback((page: number) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('page', String(page));
            return next;
        });
    }, [setSearchParams]);

    /** Xóa toàn bộ filters, về trang 1 */
    const resetFilters = useCallback(() => {
        setSearchParams({});
    }, [setSearchParams]);

    // Helper: lấy page number dưới dạng số
    const currentPage = Number(filters.page) || 1;
    const currentPageSize = Number(filters.pageSize) || 10;

    return {
        filters,
        setFilter,
        setPage,
        resetFilters,
        currentPage,
        currentPageSize,
    };
}

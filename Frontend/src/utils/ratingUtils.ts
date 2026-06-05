/**
 * Tạo số sao (1-5) từ MaDV
 * Sử dụng MaDV làm seed để tạo giá trị nhất quán
 * @param maDV - ID của tour
 * @returns Số sao từ 1-5
 */
export function generateStarsFromId(maDV: number): number {
  // Dùng hash đơn giản từ MaDV để tạo số sao
  const hash = Math.abs(maDV * 2654435761) % 100;
  if (hash < 20) return 5;
  if (hash < 40) return 4;
  if (hash < 60) return 3;
  if (hash < 80) return 4;
  return 5;
}

/**
 * Chuyển đổi số sao (1-5) thành giá trị rating hiển thị
 * Công thức:
 * - 5 sao -> trả về từ 4.5-5.0 sao
 * - 4 sao -> trả về từ 3.5-4.4 sao
 * - 3 sao -> trả về từ 2.5-3.4 sao
 * - 2 sao -> trả về từ 1.5-2.4 sao
 * - 1 sao -> trả về từ 0.5-1.4 sao
 * @param stars - Số sao thực (1-5)
 * @param seed - Seed để tính toán giá trị random (để đảm bảo cùng ID có cùng rating)
 * @returns Giá trị rating hiển thị
 */
export function calculateDisplayRating(stars: number, seed: number = 0): number {
  const clampedStars = Math.max(1, Math.min(5, Math.round(stars)));
  
  // Hàm pseudo-random dựa trên seed để đảm bảo cùng ID có cùng rating
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const randomValue = random(seed);
  
  let min: number, max: number;
  
  switch (clampedStars) {
    case 5:
      min = 4.5;
      max = 5.0;
      break;
    case 4:
      min = 3.5;
      max = 4.4;
      break;
    case 3:
      min = 2.5;
      max = 3.4;
      break;
    case 2:
      min = 1.5;
      max = 2.4;
      break;
    case 1:
    default:
      min = 0.5;
      max = 1.4;
  }
  
  const displayRating = min + (max - min) * randomValue;
  return Math.round(displayRating * 10) / 10; // Làm tròn đến 1 chữ số thập phân
}

/**
 * Trả về text mô tả rating
 * @param rating - Giá trị rating hiển thị
 * @returns Text mô tả
 */
export function getRatingText(rating: number): string {
  if (rating >= 4.5) return 'Tuyệt vời';
  if (rating >= 4.0) return 'Rất tốt';
  if (rating >= 3.5) return 'Tốt';
  if (rating >= 3.0) return 'Khá tốt';
  if (rating >= 2.0) return 'Được chấp nhận';
  return 'Cần cải thiện';
}

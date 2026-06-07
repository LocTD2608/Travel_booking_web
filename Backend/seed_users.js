require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/models');

const ADMINS = [
  { Ho: 'Nguyen Van', Ten: 'Hai', Email: 'admin_van@gmail.com', SDT: '0910000001', CCCD: '100100100101', Role: 'ADMIN', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Tran Thi', Ten: 'Lan', Email: 'admin_thi@gmail.com', SDT: '0910000002', CCCD: '100100100102', Role: 'ADMIN', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Le Hoang', Ten: 'Nam', Email: 'admin_hoang@gmail.com', SDT: '0910000003', CCCD: '100100100103', Role: 'ADMIN', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' }
];

const USERS = [
  { Ho: 'Nguyen Dinh', Ten: 'Hoang', Email: 'hoangnguyen@gmail.com', SDT: '0920000001', CCCD: '200200200201', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Tran Minh', Ten: 'Khoa', Email: 'khoatran@gmail.com', SDT: '0920000002', CCCD: '200200200202', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Le Thanh', Ten: 'Hai', Email: 'haile@gmail.com', SDT: '0920000003', CCCD: '200200200203', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Pham Quoc', Ten: 'Bao', Email: 'baopham@gmail.com', SDT: '0920000004', CCCD: '200200200204', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Hoang Khanh', Ten: 'Chi', Email: 'chihoang@gmail.com', SDT: '0920000005', CCCD: '200200200205', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Vu Thuy', Ten: 'Linh', Email: 'linhvu@gmail.com', SDT: '0920000006', CCCD: '200200200206', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Phan Anh', Ten: 'Tuan', Email: 'tuanphan@gmail.com', SDT: '0920000007', CCCD: '200200200207', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Do Thu', Ten: 'Ha', Email: 'hado@gmail.com', SDT: '0920000008', CCCD: '200200200208', Role: 'USER', TrangThai: 'INACTIVE', TinhTrangXacMinh: 'UNVERIFIED' },
  { Ho: 'Bui Tien', Ten: 'Dung', Email: 'dungbui@gmail.com', SDT: '0920000009', CCCD: '200200200209', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Huynh Minh', Ten: 'Triet', Email: 'triethuynh@gmail.com', SDT: '0920000010', CCCD: '200200200210', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Trinh Cong', Ten: 'Son', Email: 'sontrinh@gmail.com', SDT: '0920000011', CCCD: '200200200211', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Dang Thu', Ten: 'Thao', Email: 'thaodang@gmail.com', SDT: '0920000012', CCCD: '200200200212', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'UNVERIFIED' },
  { Ho: 'Mai Phuong', Ten: 'Thuy', Email: 'thuymai@gmail.com', SDT: '0920000013', CCCD: '200200200213', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Ngo Bao', Ten: 'Chau', Email: 'chaungo@gmail.com', SDT: '0920000014', CCCD: '200200200214', Role: 'USER', TrangThai: 'BANNED', TinhTrangXacMinh: 'UNVERIFIED' },
  { Ho: 'Duong Trung', Ten: 'Quoc', Email: 'quocduong@gmail.com', SDT: '0920000015', CCCD: '200200200215', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Ly Thuong', Ten: 'Kiet', Email: 'kietly@gmail.com', SDT: '0920000016', CCCD: '200200200216', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Vo Nguyen', Ten: 'Giap', Email: 'giapvo@gmail.com', SDT: '0920000017', CCCD: '200200200217', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Phan Chau', Ten: 'Trinh', Email: 'trinhphan@gmail.com', SDT: '0920000018', CCCD: '200200200218', Role: 'USER', TrangThai: 'INACTIVE', TinhTrangXacMinh: 'UNVERIFIED' },
  { Ho: 'Nguyen', Ten: 'Hue', Email: 'huenguyen@gmail.com', SDT: '0920000019', CCCD: '200200200219', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' },
  { Ho: 'Dinh Bo', Ten: 'Linh', Email: 'linhdinh@gmail.com', SDT: '0920000020', CCCD: '200200200220', Role: 'USER', TrangThai: 'ACTIVE', TinhTrangXacMinh: 'VERIFIED' }
];

const OLD_EMAILS = [
  'user_a@gmail.com', 'user_b@gmail.com', 'user_c@gmail.com', 'user_d@gmail.com', 'user_e@gmail.com',
  'user_f@gmail.com', 'user_g@gmail.com', 'user_h@gmail.com', 'user_i@gmail.com', 'user_k@gmail.com',
  'user_l@gmail.com', 'user_m@gmail.com', 'user_n@gmail.com', 'user_o@gmail.com', 'user_p@gmail.com',
  'user_q@gmail.com', 'user_r@gmail.com', 'user_s@gmail.com', 'user_t@gmail.com', 'user_u@gmail.com'
];

async function seed() {
  try {
    console.log('🔄 Connecting to database...');
    await db.sequelize.authenticate();
    console.log('✅ Connected.');

    console.log('🧹 Cleaning up old A/B/C mock user accounts...');
    await db.User.destroy({
      where: {
        Email: OLD_EMAILS
      }
    });

    const defaultPasswordHash = await bcrypt.hash('password123', 10);
    let createdCount = 0;

    // Seed Admins
    console.log('🌱 Seeding admins...');
    for (const admin of ADMINS) {
      const [record, created] = await db.User.findOrCreate({
        where: { Email: admin.Email },
        defaults: {
          ...admin,
          Password: defaultPasswordHash
        }
      });
      if (created) {
        createdCount++;
      } else {
        // Update names if the admin already exists (so old admin_van has new real names)
        record.Ho = admin.Ho;
        record.Ten = admin.Ten;
        await record.save();
      }
    }

    // Seed Users
    console.log('🌱 Seeding users...');
    for (const user of USERS) {
      const [record, created] = await db.User.findOrCreate({
        where: { Email: user.Email },
        defaults: {
          ...user,
          Password: defaultPasswordHash
        }
      });
      if (created) {
        createdCount++;
      } else {
        record.Ho = user.Ho;
        record.Ten = user.Ten;
        await record.save();
      }
    }

    console.log(`🎉 Seeding complete. Successfully seeded ${createdCount} users/admins.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

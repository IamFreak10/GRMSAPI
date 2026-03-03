import db from '../../config/db';

const getAdminStats = async () => {
  // ১. আর্নিং স্ট্যাটাস (booking_date ব্যবহার করে)
  const earningsQuery = `
    SELECT 
        COALESCE(SUM(total_amount), 0) as total_earning,
        COALESCE(SUM(CASE WHEN booking_date::date = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today_earning,
        COALESCE(SUM(CASE WHEN booking_date >= date_trunc('week', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as this_week_earning,
        COALESCE(SUM(CASE WHEN booking_date >= date_trunc('month', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as this_month_earning,
        COALESCE(SUM(CASE WHEN booking_date >= date_trunc('year', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as this_year_earning
    FROM bookings 
    WHERE payment_status = 'paid';
  `;

  // ২. আপকামিং আর্নিং ও পেন্ডিং গেস্ট
  const upcomingQuery = `
    SELECT 
        COUNT(id) as upcoming_guest_count,
        COALESCE(SUM(total_amount), 0) as upcoming_potential_earning
    FROM bookings 
    WHERE status = 'pending' AND payment_status = 'pending';
  `;

  // ৩. ইউজার স্ট্যাটাস (is_active ব্যবহার করে)
  const userStatsQuery = `
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
    FROM users 
    WHERE role = 'user';
  `;

  // ৪. রুম ও ব্রাঞ্চ ডিস্ট্রিবিউশন
  const roomStatsQuery = `
    SELECT 
        branch,
        COUNT(id) as branch_room_count
    FROM rooms
    GROUP BY branch;
  `;

  const [earnings, upcoming, users, rooms] = await Promise.all([
    db.query(earningsQuery),
    db.query(upcomingQuery),
    db.query(userStatsQuery),
    db.query(roomStatsQuery),
  ]);

  return {
    revenue: earnings.rows[0],
    upcoming: upcoming.rows[0],
    users: users.rows[0],
    inventory: {
      total_rooms: rooms.rows.reduce(
        (acc, curr) => acc + parseInt(curr.branch_room_count),
        0
      ),
      byBranch: rooms.rows,
    },
  };
};
export const adminStatsService = { getAdminStats };

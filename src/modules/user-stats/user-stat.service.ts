import db from '../../config/db';

const getUserAnalytics = async (userId: string) => {
  const query = `
    SELECT 
      -- Total Count of Bookings
      (SELECT COUNT(*) FROM bookings WHERE user_id = $1) as total_bookings,
      
      -- Total Revenue/Spent (Sum of total_amount)
      (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE user_id = $1) as total_spent,
      
      -- Document Status (If document_url exists)
      (SELECT CASE WHEN document_url IS NULL THEN 'Pending' ELSE 'Verified' END 
       FROM users WHERE id = $1) as doc_status,

      -- Monthly Booking Trend (For the Area Chart)
      (SELECT json_agg(t) FROM (
         SELECT TO_CHAR(booking_date, 'Mon') as month, COUNT(*) as count 
         FROM bookings 
         WHERE user_id = $1 
         GROUP BY month 
         LIMIT 6
      ) t) as booking_trend
  `;
  
  const result = await db.query(query, [userId]);
  return result.rows[0];
};

export const userStatService = {
  getUserAnalytics
};
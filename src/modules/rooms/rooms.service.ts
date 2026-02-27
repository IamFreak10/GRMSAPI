import db from '../../config/db';


// Room create
const createRoom = async (payload: any) => {
  const { roomNo, branch, type, totalBeds, price } = payload;

  // ১. রুমে ডাটা ইনসার্ট
  const roomResult = await db.query(
    `INSERT INTO rooms (room_no, branch, type, total_beds, price_per_day) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [roomNo, branch, type, totalBeds, price]
  );

  const newRoom = roomResult.rows[0];

  // ২. বেড জেনারেট করা
  for (let i = 1; i <= totalBeds; i++) {
    const bedLabel = `B${i}`;
    await db.query(
      `INSERT INTO beds (room_id, bed_label) VALUES ($1, $2)`,
      [newRoom.id, bedLabel]
    );
  }

  return newRoom; 
};
const getRoomStatus = async (date: any, branch: any) => {
  let query = `
    SELECT 
      r.*, 
      (SELECT json_agg(b.*) FROM beds b WHERE b.room_id = r.id) AS all_beds,
      (
        SELECT COALESCE(json_agg(rds_sub), '[]'::json)
        FROM (
          SELECT rds.booking_date, json_agg(rds.bed_id) AS booked_bed_ids, MAX(rds.assigned_gender) AS gender_lock
          FROM room_daily_status rds
          WHERE rds.room_id = r.id
          ${date ? "AND rds.booking_date = $1" : ""}
          GROUP BY rds.booking_date
        ) rds_sub
      ) AS daily_occupancy
    FROM rooms r
    WHERE 1=1
  `;

  const params = [];
  if (date) params.push(date);

  if (branch && branch !== 'All') {
    params.push(branch);
    query += ` AND r.branch = $${params.length}`;
  }

  const result = await db.query(query, params);
  return result.rows;
};
export const roomService = {
  createRoom,
  getRoomStatus
};
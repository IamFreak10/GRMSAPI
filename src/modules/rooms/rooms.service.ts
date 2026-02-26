import db from '../../config/db';

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

export const roomService = {
  createRoom,
};
import express, { Request, Response } from 'express';
import config from './config';
import app from './app';
import db from './config/db';

const port = config.port;




// async function testDB() {
//   try {
//     const client = await db.connect();
//     console.log('✅ Database connected successfully');
//     client.release();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//   }
// }

// testDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

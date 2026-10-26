import mysql2 from "mysql2/promise";

let pool;

export const connectDB = async () => {
  try {
    pool = mysql2.createPool({
      host: process.env.HOST,
      port: process.env.DBPORT,
      user: process.env.USER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
    });
    const connection = await pool.getConnection();
    console.log("Database Connected");
    connection.release();
  } catch (err) {
    console.log("Something Went Wrong ", err);
    process.exit(1);
  }
};

export const makePool = () => pool;

import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT || '5432'),
	database: process.env.POSTGRES_DB
});

// Test the connection
export const testConnection = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.error('Error connecting to PostgreSQL database:', err.message);
			return;
		}
		console.log('Connected to PostgreSQL database successfully');
		release();
	});
};

export default pool;

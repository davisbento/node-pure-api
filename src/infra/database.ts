import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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

// Create a file-based flag to track initialization across restarts
export const DB_INIT_FLAG_PATH = path.join(__dirname, '../../.db_initialized');

// Check if the database has been initialized in this server session
const isDbInitialized = () => {
	try {
		return fs.existsSync(DB_INIT_FLAG_PATH);
	} catch (err) {
		return false;
	}
};

// Mark the database as initialized
const markDbInitialized = () => {
	try {
		fs.writeFileSync(DB_INIT_FLAG_PATH, new Date().toISOString());
	} catch (err) {
		console.warn('Could not write db initialization flag file:', (err as Error).message);
	}
};

// Test the connection
export const testConnection = async (): Promise<boolean> => {
	if (isDbInitialized()) {
		console.log('Database connection already established.');
		return true;
	}

	try {
		const client = await pool.connect();
		console.log('Connected to PostgreSQL database successfully');
		client.release();
		return true;
	} catch (err) {
		console.error('Error connecting to PostgreSQL database:', (err as Error).message);
		return false;
	}
};

// Create users table if it doesn't exist
export const createUsersTable = async (): Promise<void> => {
	if (isDbInitialized()) {
		console.log('Database already initialized, skipping table creation.');
		return;
	}

	try {
		const client = await pool.connect();
		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				username VARCHAR(50) UNIQUE NOT NULL,
				email VARCHAR(100) UNIQUE NOT NULL,
				password VARCHAR(255) NULL
			)
		`);
		console.log('Users table created or already exists');
		client.release();
		markDbInitialized();
	} catch (err) {
		console.error('Error creating users table:', (err as Error).message);
		throw err;
	}
};

export default pool;

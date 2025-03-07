import bcrypt from 'bcryptjs';
import pool from '../infra/database';
import { getCache, setCache } from '../infra/redis';
import type { LoginDto, LoginResponse, SignupDto, UserProfileDto, UserResponse } from '../types/dto';
import { generateToken } from '../utils/jwt';

export class UserService {
	/**
	 * Register a new user
	 */
	async signup(userData: SignupDto): Promise<UserResponse> {
		const { username, email, password } = userData;

		// Check if user already exists
		const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

		if (existingUser.rows.length > 0) {
			throw new Error('User already exists');
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert user into database
		const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [
			username,
			email,
			hashedPassword
		]);
		const user = newUser.rows[0];

		return {
			success: true,
			message: 'User registered successfully',
			user: {
				id: user.id,
				username: user.username,
				email: user.email
			}
		};
	}

	/**
	 * Authenticate a user
	 */
	async login(credentials: LoginDto): Promise<LoginResponse> {
		const { email, password } = credentials;

		// Check if user exists
		const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

		if (user.rows.length === 0) {
			throw new Error('Invalid credentials');
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

		if (!isPasswordValid) {
			throw new Error('Invalid credentials');
		}

		// Generate JWT token
		const token = generateToken(user.rows[0].id);

		return {
			success: true,
			message: 'Login successful',
			token,
			user: {
				id: user.rows[0].id,
				username: user.rows[0].username,
				email: user.rows[0].email
			}
		};
	}

	/**
	 * Get current user profile
	 */
	async getCurrentUser(userId: number): Promise<UserProfileDto> {
		// Fetch user from database
		const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

		if (user.rows.length === 0) {
			throw new Error('User not found');
		}

		const cacheKey = `user:${userId}`;

		const cachedUser = await getCache(cacheKey);

		if (cachedUser) {
			return JSON.parse(cachedUser);
		}

		const response: UserProfileDto = {
			id: user.rows[0].id,
			username: user.rows[0].username,
			email: user.rows[0].email
		};

		await setCache(cacheKey, JSON.stringify(response), 60);

		return response;
	}
}

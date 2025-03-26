import bcrypt from 'bcryptjs';
import { getCache, setCache } from '../infra/redis';
import { UserModel } from '../models/userModel';
import type { LoginDto, LoginResponse, SignupDto, UserProfileDto, UserResponse } from '../types/dto';
import { generateToken } from '../utils/jwt';

export class UserService {
	private userModel: UserModel;

	constructor() {
		this.userModel = new UserModel();
	}

	/**
	 * Register a new user */
	async signup(userData: SignupDto): Promise<UserResponse> {
		const { username, email, password } = userData;

		// Check if user already exists
		const existingUser = await this.userModel.hasAnyUserWithEmailOrUsername(email, username);

		if (existingUser) {
			throw new Error('User already exists');
		}

		const newUser = await this.userModel.persistUser({
			username,
			email,
			password
		});

		if (!newUser) {
			throw new Error('Failed to create user');
		}

		return {
			success: true,
			message: 'User registered successfully',
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email
			}
		};
	}

	/**
	 * Authenticate a user
	 */
	async login(credentials: LoginDto): Promise<LoginResponse> {
		const { email, password } = credentials;

		// Check if user exists
		const user = await this.userModel.getUserByEmail(email);

		if (!user) {
			throw new Error('Invalid credentials');
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new Error('Invalid credentials');
		}

		// Generate JWT token
		const token = generateToken(user.id);

		return {
			success: true,
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email
			}
		};
	}

	/**
	 * Get current user profile
	 */
	async getCurrentUser(userId: number): Promise<UserProfileDto> {
		const cacheKey = `user:${userId}`;
		const cachedUser = await getCache(cacheKey);

		if (cachedUser) {
			return JSON.parse(cachedUser);
		}

		// Fetch user from database
		const user = await this.userModel.getUserById(userId);

		if (!user) {
			throw new Error('User not found');
		}

		const response: UserProfileDto = {
			id: user.id,
			username: user.username,
			email: user.email
		};

		await setCache(cacheKey, JSON.stringify(response), 60);

		return response;
	}
}

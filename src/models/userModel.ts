import pool from '../infra/database';
import type { SignupDto } from '../types/dto';
import { hashPassword } from '../utils/hashPassword';

export class UserModel {
	private async prepareUserToCreate(user: SignupDto) {
		const hashedPassword = await hashPassword(user.password);
		return {
			username: user.username,
			email: user.email,
			password: hashedPassword
		};
	}

	public async persistUser(user: SignupDto) {
		try {
			const preparedUser = await this.prepareUserToCreate(user);

			const newUserCreatedRows = await pool.query(
				'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
				[preparedUser.username, preparedUser.email, preparedUser.password]
			);

			const newUser = newUserCreatedRows.rows[0];

			return newUser;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public async getUserByEmail(email: string) {
		const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

		return user.rows[0];
	}

	public async hasAnyUserWithEmailOrUsername(email: string, username: string): Promise<boolean> {
		const user = await pool.query('SELECT count(*) FROM users WHERE email = $1 OR username = $2', [email, username]);

		return user.rows[0].count > 0;
	}
}

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { LoginDto, SignupDto } from '../types/dto';

import { validateUserTokenAndReturnUserId } from '../services/tokenService';
import { UserService } from '../services/userService';
import { parseJsonBody } from '../utils/bodyParser';

const userService = new UserService();

export async function handleSignup(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const userData: SignupDto = await parseJsonBody<SignupDto>(req);
		const result = await userService.signup(userData);

		res.writeHead(201);
		res.end(JSON.stringify(result));
	} catch (error) {
		res.writeHead(400);
		res.end(
			JSON.stringify({
				success: false,
				message: error instanceof Error ? error.message : 'Error processing request'
			})
		);
	}
}

export async function handleLogin(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const credentials: LoginDto = await parseJsonBody<LoginDto>(req);
		const result = await userService.login(credentials);

		res.writeHead(200);
		res.end(JSON.stringify(result));
	} catch (error) {
		res.writeHead(400);
		res.end(
			JSON.stringify({
				success: false,
				message: error instanceof Error ? error.message : 'Error processing request'
			})
		);
	}
}

export async function handleGetMe(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const userId = validateUserTokenAndReturnUserId(req);

		const user = await userService.getCurrentUser(userId);

		res.writeHead(200);
		res.end(JSON.stringify(user));
	} catch (error) {
		res.writeHead(401);
		res.end(
			JSON.stringify({
				success: false,
				message: 'Unauthorized'
			})
		);
	}
}

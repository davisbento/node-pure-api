import type { IncomingMessage, ServerResponse } from 'node:http';
import type { LoginDto, SignupDto } from '../types/dto';

import { UnauthorizedException } from '../exceptions/unauthorizedException';
import { validateUserTokenAndReturnUserId } from '../services/tokenService';
import { UserService } from '../services/userService';
import { parseJsonBody } from '../utils/bodyParser';
import { formatError } from '../utils/formartError';
import { sendResponse } from '../utils/server';

const userService = new UserService();

export async function handleSignup(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const userData: SignupDto = await parseJsonBody<SignupDto>(req);

		const result = await userService.signup(userData);

		sendResponse(res, 201, result);
	} catch (error) {
		sendResponse(res, 400, {
			message: error instanceof Error ? error.message : 'Error processing request'
		});
	}
}

export async function handleLogin(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const credentials: LoginDto = await parseJsonBody<LoginDto>(req);
		const result = await userService.login(credentials);

		sendResponse(res, 200, result);
	} catch (error) {
		sendResponse(res, 400, {
			message: error instanceof Error ? error.message : 'Error processing request'
		});
	}
}

export async function handleGetMe(req: IncomingMessage, res: ServerResponse): Promise<void> {
	try {
		const userId = validateUserTokenAndReturnUserId(req);

		if (!userId) {
			throw new UnauthorizedException();
		}

		const user = await userService.getCurrentUser(userId);

		sendResponse(res, 200, user);
	} catch (error) {
		const { message, statusCode } = formatError(error as Error);
		sendResponse(res, statusCode, { message });
	}
}

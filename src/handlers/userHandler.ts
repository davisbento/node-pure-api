import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services/userService';
import { LoginDto, SignupDto } from '../types/dto';
import { parseJsonBody } from '../utils/bodyParser';
import { extractToken } from '../utils/extractToken';
import { verifyToken } from '../utils/jwt';

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
		const token = extractToken(req);

		if (!token) {
			throw new Error('Unauthorized');
		}

		const decodedToken = verifyToken(token);

		if (!decodedToken?.sub) {
			throw new Error('Unauthorized');
		}

		const userId = decodedToken.sub;
		const user = await userService.getCurrentUser(Number(userId));

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

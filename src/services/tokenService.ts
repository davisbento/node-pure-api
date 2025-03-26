import type { IncomingMessage } from 'node:http';
import { extractToken } from '../utils/extractToken';
import { verifyToken } from '../utils/jwt';

export const validateUserTokenAndReturnUserId = (req: IncomingMessage): number => {
	const token = extractToken(req);

	if (!token) {
		throw new Error('Unauthorized');
	}

	const decodedToken = verifyToken(token);

	if (!decodedToken?.sub) {
		throw new Error('Unauthorized');
	}

	const userId = decodedToken.sub;

	return Number(userId);
};

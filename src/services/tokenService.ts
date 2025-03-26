import type { IncomingMessage } from 'node:http';
import { UnauthorizedException } from '../exceptions/unauthorizedException';
import { extractToken } from '../utils/extractToken';
import { verifyToken } from '../utils/jwt';

export const validateUserTokenAndReturnUserId = (req: IncomingMessage): number => {
	const token = extractToken(req);

	if (!token) {
		throw new UnauthorizedException();
	}

	const decodedToken = verifyToken(token);

	if (!decodedToken?.sub) {
		throw new UnauthorizedException();
	}

	const userId = decodedToken.sub;

	return Number(userId);
};

import type { IncomingMessage } from 'node:http';

export const extractToken = (req: IncomingMessage) => {
	const token = req.headers.authorization?.split(' ')[1];
	return token;
};

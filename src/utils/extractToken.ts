import { IncomingMessage } from 'http';

export const extractToken = (req: IncomingMessage) => {
	const token = req.headers.authorization?.split(' ')[1];
	return token;
};

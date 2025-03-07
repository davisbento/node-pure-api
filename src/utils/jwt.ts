import jwt from 'jsonwebtoken';

const jwtSecret = (process.env.JWT_SECRET as string) || 'secret';

export const generateToken = (userId: number) => {
	return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, jwtSecret);
};

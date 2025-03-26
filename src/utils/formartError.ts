import { UnauthorizedException } from '../exceptions/unauthorizedException';

type FormatError = {
	message: string;
	statusCode: number;
};

export const formatError = (error: Error): FormatError => {
	if (error instanceof UnauthorizedException) {
		return { message: error.message, statusCode: 401 };
	}

	return { message: 'Error processing request', statusCode: 400 };
};

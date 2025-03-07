import { IncomingMessage, ServerResponse } from 'http';
import { ApiInfoResponse } from '../types/dto';

export function handleRoot(req: IncomingMessage, res: ServerResponse): void {
	const response: ApiInfoResponse = {
		message: 'Welcome to the API',
		endpoints: [
			{ path: '/', method: 'GET', description: 'API information' },
			{ path: '/users/signup', method: 'POST', description: 'Register a new user' },
			{ path: '/users/login', method: 'POST', description: 'Authenticate a user' },
			{ path: '/users/me', method: 'GET', description: 'Get current user data' }
		]
	};

	res.writeHead(200);
	res.end(JSON.stringify(response));
}

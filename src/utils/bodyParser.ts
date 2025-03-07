import { IncomingMessage } from 'http';

/**
 * Parses the request body as JSON
 */
export async function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
	return new Promise((resolve, reject) => {
		let body = '';

		req.on('data', (chunk) => {
			body += chunk.toString();
		});

		req.on('end', () => {
			try {
				const parsedBody = body ? JSON.parse(body) : {};
				resolve(parsedBody as T);
			} catch (error) {
				reject(new Error('Invalid JSON'));
			}
		});

		req.on('error', (err) => {
			reject(err);
		});
	});
}

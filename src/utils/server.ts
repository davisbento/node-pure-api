import type { ServerResponse } from 'node:http';

export const sendResponse = (res: ServerResponse, statusCode: number, body: unknown) => {
	res.writeHead(statusCode, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(body));
};

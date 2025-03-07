import * as http from 'http';
import { URL } from 'url';
import { handleRoot } from './handlers/rootHandler';
import { handleGetMe, handleLogin, handleSignup } from './handlers/userHandler';

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(async (req, res) => {
	// Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// Handle OPTIONS request for CORS preflight
	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		res.end();
		return;
	}

	// Get the URL path
	const baseURL = `http://${req.headers.host}`;
	const parsedUrl = new URL(req.url || '', baseURL);
	const path = parsedUrl.pathname;

	// Set default response headers
	res.setHeader('Content-Type', 'application/json');

	try {
		// Route handling
		if (path === '/' && req.method === 'GET') {
			await handleRoot(req, res);
		} else if (path === '/users/signup' && req.method === 'POST') {
			await handleSignup(req, res);
		} else if (path === '/users/login' && req.method === 'POST') {
			await handleLogin(req, res);
		} else if (path === '/users/me' && req.method === 'GET') {
			await handleGetMe(req, res);
		} else {
			// Handle 404 Not Found
			res.writeHead(404);
			res.end(JSON.stringify({ success: false, message: 'Route not found' }));
		}
	} catch (error) {
		// Handle unexpected errors
		console.error('Server error:', error);
		res.writeHead(500);
		res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
	}
});

// Start the server
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});

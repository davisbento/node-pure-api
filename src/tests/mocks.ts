import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';

type OptionsToMock = {
	headers?: Record<string, string>;
};

export const mockIncomingMessage = (options: OptionsToMock = {}): IncomingMessage => {
	const req = new IncomingMessage(new Socket());

	if (options.headers) {
		req.headers = options.headers;
	}

	return req;
};

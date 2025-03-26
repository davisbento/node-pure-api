import { mockIncomingMessage } from '../tests/mocks';
import { assert, createSuite } from '../tests/test-utils';
import { extractToken } from './extractToken';

const mockedIncomingMessage = mockIncomingMessage({
	headers: {
		authorization: 'Bearer test-token-12345'
	}
});

export async function runTests() {
	const suite = createSuite('Extract Token');

	suite.test('it should return user ID from valid token', () => {
		assert.strictEqual(extractToken(mockedIncomingMessage), 'test-token-12345');
	});

	return suite.run();
}

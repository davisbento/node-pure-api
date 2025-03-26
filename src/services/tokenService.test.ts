import { UnauthorizedException } from '../exceptions/unauthorizedException';
import { mockIncomingMessage } from '../tests/mocks';
import { assert, createSuite } from '../tests/test-utils';
import { generateToken } from '../utils/jwt';
import { validateUserTokenAndReturnUserId } from './tokenService';

export async function runTests() {
	const suite = createSuite('Token Service');

	suite.test('it should return user ID from valid token', () => {
		const token = generateToken(1);

		const mockedIncomingMessage = mockIncomingMessage({
			headers: {
				authorization: `Bearer ${token}`
			}
		});

		const userId = validateUserTokenAndReturnUserId(mockedIncomingMessage);

		assert.strictEqual(userId, 1);
	});

	suite.test('it should throw an error if no token is provided', () => {
		const mockedIncomingMessage = mockIncomingMessage();

		assert.throws(() => validateUserTokenAndReturnUserId(mockedIncomingMessage), UnauthorizedException);
	});

	return suite.run();
}

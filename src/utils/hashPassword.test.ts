import { assert, createSuite } from '../tests/test-utils';
import { comparePassword, hashPassword } from './hashPassword';

export async function runTests() {
	const suite = createSuite('Hash Password');

	suite.test('it should hash a password', async () => {
		const password = 'test-password';
		const hashedPassword = await hashPassword(password);
		assert.strictEqual(hashedPassword.length, 60);
	});

	suite.test('it should compare a password', async () => {
		const password = 'test-password';
		const hashedPassword = await hashPassword(password);
		const isMatch = await comparePassword(password, hashedPassword);
		assert.strictEqual(isMatch, true);
	});

	// validate against a wrong password
	suite.test('it should not compare a wrong password', async () => {
		const password = 'test-password';
		const hashedPassword = await hashPassword(password);
		const isMatch = await comparePassword('wrong-password', hashedPassword);
		assert.strictEqual(isMatch, false);
	});

	return suite.run();
}

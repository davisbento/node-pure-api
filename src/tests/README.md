# Running Tests

```bash
pnpm run test
```

## Test Structure

Tests are located in the `src/` directory.

Each test file is named like `*.test.ts`.

Each test file exports a `runTests` function.


```ts
import assert from 'node:assert';
import { mockIncomingMessage } from '../tests/mocks';
import { createSuite } from '../tests/test-utils';
import { extractToken } from './extractToken';


export async function runTests() {
	const suite = createSuite('Test Suite Name');

	suite.test('Test Name', () => {
		assert.strictEqual('1', '1');
	});

	return suite.run();
}

```


## Mocking

The testing framework does not include dedicated mocking tools.

For modules that are imported directly, you may need to recreate the functionality with mocks.


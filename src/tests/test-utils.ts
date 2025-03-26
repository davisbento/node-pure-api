import assert from 'node:assert';

// Test function type
type TestFunction = () => void | Promise<void>;

// Test case structure
interface TestCase {
	name: string;
	fn: TestFunction;
	skip?: boolean;
}

// Test result structure
interface TestResult {
	total: number;
	passed: number;
	failed: number;
	skipped: number;
}

/**
 * A simple test suite runner
 */
class TestSuite {
	private tests: TestCase[] = [];
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Add a test case to the suite
	 */
	test(name: string, fn: TestFunction) {
		this.tests.push({ name, fn });
		return this;
	}

	/**
	 * Add a skipped test case to the suite
	 */
	skip(name: string, fn: TestFunction) {
		this.tests.push({ name, fn, skip: true });
		return this;
	}

	/**
	 * Run all tests in the suite
	 */
	async run(): Promise<TestResult> {
		const result: TestResult = {
			total: this.tests.length,
			passed: 0,
			failed: 0,
			skipped: 0
		};

		console.log(`\n>> Suite: ${this.name}`);

		for (const test of this.tests) {
			if (test.skip) {
				console.log(`  SKIP: ${test.name}`);
				result.skipped++;
				continue;
			}

			try {
				await Promise.resolve(test.fn());
				console.log(`  ✓ ${test.name}`);
				result.passed++;
			} catch (error) {
				console.error(`  ✗ ${test.name}`);
				console.error(`    ${error instanceof Error ? error.message : error}`);
				result.failed++;
			}
		}

		return result;
	}
}

/**
 * Create a new test suite
 */
export function createSuite(name: string): TestSuite {
	return new TestSuite(name);
}

// Export assert module for easier use in tests
export { assert };

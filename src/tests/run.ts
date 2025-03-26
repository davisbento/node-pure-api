import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Utility for colors in console output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m'
};

// Stats for test results
const stats = {
	totalTests: 0,
	passed: 0,
	failed: 0,
	skipped: 0
};

// Test runner
async function runTests() {
	console.log(`${colors.blue}=== Starting Tests ===${colors.reset}\n`);

	// Using process.cwd() instead of import.meta
	const testsDir = join(process.cwd(), 'src');

	// Find all test files (ending with .test.ts)
	const testDirs = ['utils', 'services'];

	for (const dir of testDirs) {
		const fullPath = join(testsDir, dir);

		try {
			const files = readdirSync(fullPath);

			for (const file of files) {
				if (file.endsWith('.test.ts')) {
					const testPath = join(fullPath, file);
					console.log(`${colors.yellow}Running ${dir}/${file}${colors.reset}`);

					try {
						// Import and run the test file
						const testModule = await import(testPath);
						if (typeof testModule.runTests === 'function') {
							const result = await testModule.runTests();

							stats.totalTests += result.total;
							stats.passed += result.passed;
							stats.failed += result.failed;
							stats.skipped += result.skipped;

							console.log(
								`  ${result.failed === 0 ? `${colors.green}✓` : `${colors.red}✗`} ${result.passed}/${
									result.total
								} tests passed\n${colors.reset}`
							);
						} else {
							console.log(`  ${colors.red}✗ No runTests function found${colors.reset}\n`);
						}
					} catch (error) {
						console.error(`  ${colors.red}Error running ${file}:${colors.reset}`, error);
						stats.failed++;
					}
				}
			}
		} catch (error) {
			console.error(`  ${colors.red}Error accessing directory ${dir}:${colors.reset}`, error);
		}
	}

	// Print overall results
	console.log(`${colors.blue}=== Test Results ===${colors.reset}`);
	console.log(`Total Tests: ${stats.totalTests}`);
	console.log(`${colors.green}Passed: ${stats.passed}${colors.reset}`);

	if (stats.failed > 0) {
		console.log(`${colors.red}Failed: ${stats.failed}${colors.reset}`);
	} else {
		console.log(`Failed: ${stats.failed}`);
	}

	if (stats.skipped > 0) {
		console.log(`${colors.yellow}Skipped: ${stats.skipped}${colors.reset}`);
	} else {
		console.log(`Skipped: ${stats.skipped}`);
	}

	// Exit with proper code based on test results
	process.exit(stats.failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
	console.error(`${colors.red}Fatal error in test runner:${colors.reset}`, error);
	process.exit(1);
});

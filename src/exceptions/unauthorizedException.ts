export class UnauthorizedException extends Error {
	constructor() {
		super();
		this.name = 'UnauthorizedException';
		this.message = 'Unauthorized';
	}
}

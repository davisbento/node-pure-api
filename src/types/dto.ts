// User-related DTOs
export interface SignupDto {
	username: string;
	email: string;
	password: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface UserDto {
	id: number;
	username: string;
	email: string;
}

export interface UserProfileDto extends UserDto {}

// API response types
export interface ApiResponse {
	success: boolean;
	message?: string;
}

export interface UserResponse extends ApiResponse {
	user: UserDto;
}

export interface LoginResponse extends UserResponse {
	token: string;
}

export interface ApiInfoResponse {
	message: string;
	endpoints: Array<{
		path: string;
		method: string;
		description: string;
	}>;
}

export interface CreateUserDto {
	username: string;
	password: string;
	name: string;
	email?: string;
	phone?: string;
}

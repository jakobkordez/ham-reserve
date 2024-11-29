export interface User {
	_id: string;
	username: string;
	name: string;
	email: string;
	phone: string;
	createdAt: Date;
	isDeleted: boolean;
	roles: string[];
	passwordResetRequired: boolean;
}

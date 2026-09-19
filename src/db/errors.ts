export class InsufficientFundsError extends Error {
	constructor(message = "Insufficient coins balance.") {
		super(message);
		this.name = "InsufficientFundsError";
	}
}

export class UserNotFoundInternalError extends Error {
	constructor(message = "User not found.") {
		super(message);
		this.name = "UserNotFoundInternalError";
	}
}

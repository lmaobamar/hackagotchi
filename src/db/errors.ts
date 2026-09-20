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

export class InvalidItemIdInternalError extends Error {
	constructor(message = "Invalid Item Id") {
		super(message);
		this.name = "InvalidItemIdInternalError";
	}
}

export class OutOfStockError extends Error {
	constructor(message = "Item not in stock.") {
		super(message);
		this.name = "OutOfStockError";
	}
}

export class NotImplementedError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		let msg = '未实现'
		if (message) {
			msg += `：${message}`
		}
		super(msg, options)
	}
}

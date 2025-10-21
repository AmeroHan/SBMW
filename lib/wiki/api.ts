import { MwApiParams, MediaWikiApi as WikiSaikou } from 'wiki-saikou'
import { Config } from './config'

export const commonApiParams = {
	format: 'json',
	formatversion: 2,
} as const

export class WikiApi {
	saikou: WikiSaikou
	auth: { username: string; password: string }
	authenticated: boolean

	constructor(config: Config) {
		this.saikou = new WikiSaikou(config.apiEndpoint)
		this.auth = {
			username: config.username,
			password: config.password,
		}
		this.authenticated = false
	}

	async login() {
		const { username, password } = this.auth
		const result = await this.saikou.login(username, password)
		if (result.result !== 'Success') {
			throw new Error(`登陆失败：${result}`)
		}
		this.authenticated = true
	}

	async ensureAuthenticated() {
		if (this.authenticated) return
		await this.login()
	}

	async query<T = unknown>(params: MwApiParams) {
		return this.saikou.get<{
			query: T
		}>({
			...commonApiParams,
			action: 'query',
			...params,
		})
	}

	async edit(params: MwApiParams) {
		await this.ensureAuthenticated()

		await this.saikou.postWithEditToken({
			...commonApiParams,
			action: 'edit',
			...params,
		})
	}
}

export interface MissingPage {
	ns: number
	title: string
	missing: true
}

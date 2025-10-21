import { Config, ConfigSchema } from './config'
import { WikiApi } from './api'
import { Page } from './page'

export type PageInit = { id: number } | { title: string }

export class Wiki {
	api: WikiApi

	constructor(config: Config) {
		this.api = new WikiApi(config)
	}

	static fromEnv() {
		return new Wiki(
			ConfigSchema.parse({
				apiEndpoint: process.env.WIKI_API_ENDPOINT,
				username: process.env.WIKI_USERNAME,
				password: process.env.WIKI_PASSWORD,
			})
		)
	}

	async login() {
		this.api.login()
	}

	page(options: PageInit) {
		return new Page({ ...options, wiki: this })
	}
}

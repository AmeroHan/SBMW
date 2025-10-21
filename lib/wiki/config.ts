import * as z from 'zod'

export const ConfigSchema = z.object({
	apiEndpoint: z.string().min(1),
	username: z.string().min(1),
	password: z.string().min(1),
})

export type Config = z.infer<typeof ConfigSchema>

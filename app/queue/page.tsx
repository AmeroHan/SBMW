import { Queue } from './_components/queue'
import { AddQueueAction } from './_components/queue-action/add-queue-action'
import { QueueActionHistory } from './_components/queue-action/queue-action-history'

export default function Page() {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 lg:grid-cols-2">
				<QueueActionHistory />
				<AddQueueAction />
			</div>
			<Queue />
		</div>
	)
}

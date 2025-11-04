export default function FormSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="flex items-center space-x-3 mb-6">
				<div className="w-6 h-6 bg-neon-cyan/20 rounded" />
				<div className="h-7 w-48 bg-terminal-light/10 rounded" />
			</div>

			<div className="space-y-4">
				<div>
					<div className="h-4 w-24 bg-terminal-light/10 rounded mb-2" />
					<div className="h-12 w-full bg-terminal-light/10 rounded-lg" />
				</div>

				<div>
					<div className="h-4 w-32 bg-terminal-light/10 rounded mb-2" />
					<div className="h-12 w-full bg-terminal-light/10 rounded-lg" />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="h-4 w-20 bg-terminal-light/10 rounded mb-2" />
						<div className="h-12 w-full bg-terminal-light/10 rounded-lg" />
					</div>
					<div>
						<div className="h-4 w-24 bg-terminal-light/10 rounded mb-2" />
						<div className="h-12 w-full bg-terminal-light/10 rounded-lg" />
					</div>
				</div>
			</div>

			<div className="flex space-x-4 mt-8">
				<div className="h-12 w-32 bg-terminal-light/10 rounded-lg" />
				<div className="h-12 flex-1 bg-neon-cyan/20 rounded-lg" />
			</div>
		</div>
	);
}

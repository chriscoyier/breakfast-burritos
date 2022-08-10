export default function Toggle() {
	return (
		<div>
			<button
				onClick={() => {
					window.grid.dataset.format = 'grid';
				}}
			>
				Grid
			</button>
			<button
				onClick={() => {
					window.grid.dataset.format = 'table';
				}}
			>
				Table
			</button>
		</div>
	);
}

export default function Toggle() {
	return (
		<div>
			<button
				onClick={() => {
					window.grid.dataset.format = 'grid';
				}}
			>
				Elaborate Grid
			</button>
			<button
				onClick={() => {
					window.grid.dataset.format = 'table';
				}}
			>
				Super Quick List
			</button>
		</div>
	);
}

export default function Toggle() {
	return (
		<div className="toggle-area">
			<button
				className="button-grid"
				onClick={() => {
					document.body.dataset.format = 'grid';
				}}
			>
				Elaborate Grid
			</button>
			<button
				className="button-table"
				onClick={() => {
					document.body.dataset.format = 'table';
				}}
			>
				Quick List
			</button>
		</div>
	);
}

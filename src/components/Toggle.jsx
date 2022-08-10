export default function Toggle() {
	return (
		<div>
			<button
				onClick={() => {
					console.log('grid');
					window.grid.classList.toggle('grid table');
				}}
			>
				Grid
			</button>
			<button
				onClick={() => {
					console.log('table');
					window.grid.classList.toggle('grid table');
				}}
			>
				Table
			</button>
		</div>
	);
}

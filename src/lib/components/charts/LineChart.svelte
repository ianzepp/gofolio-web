<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		TimeScale,
		Filler,
		Tooltip,
		Legend
	} from 'chart.js';
	import 'chartjs-adapter-date-fns';

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		TimeScale,
		Filler,
		Tooltip,
		Legend
	);

	interface Props {
		labels: string[];
		data: (number | null)[];
		yLabel?: string;
		color?: string;
		fill?: boolean;
	}

	let { labels, data, yLabel = '', color = '#3b82f6', fill = true }: Props = $props();

	let canvasEl: HTMLCanvasElement;
	let chart: Chart | undefined;

	function createChart() {
		chart?.destroy();
		chart = new Chart(canvasEl, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						data,
						borderColor: color,
						backgroundColor: fill ? `${color}1a` : 'transparent',
						borderWidth: 2,
						fill,
						pointRadius: 0,
						pointHitRadius: 10,
						tension: 0.3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						mode: 'index',
						intersect: false
					}
				},
				scales: {
					x: {
						type: 'time',
						time: { unit: 'month' },
						grid: { display: false },
						ticks: {
							maxTicksLimit: 8
						}
					},
					y: {
						title: yLabel ? { display: true, text: yLabel } : { display: false },
						grid: { color: 'rgba(128,128,128,0.1)' }
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				}
			}
		});
	}

	onMount(() => {
		createChart();
	});

	$effect(() => {
		// Re-create chart when data changes
		if (chart && labels && data) {
			chart.data.labels = labels;
			chart.data.datasets[0].data = data;
			chart.update('none');
		}
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<div class="relative mx-auto w-full" style="aspect-ratio: 16 / 9; max-width: 50rem;">
	<canvas bind:this={canvasEl}></canvas>
</div>

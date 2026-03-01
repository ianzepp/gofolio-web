<script lang="ts">
	interface Props {
		value: number | null | undefined;
		currency?: string;
		locale?: string;
		type?: 'currency' | 'percent' | 'number';
		colorized?: boolean;
		precision?: number;
	}

	let {
		value,
		currency = 'USD',
		locale = 'en-US',
		type = 'currency',
		colorized = false,
		precision = 2
	}: Props = $props();

	let formatted = $derived.by(() => {
		if (value == null || isNaN(value)) return '-';

		if (type === 'percent') {
			return new Intl.NumberFormat(locale, {
				style: 'percent',
				minimumFractionDigits: precision,
				maximumFractionDigits: precision
			}).format(value);
		}

		if (type === 'currency') {
			return new Intl.NumberFormat(locale, {
				style: 'currency',
				currency,
				minimumFractionDigits: precision,
				maximumFractionDigits: precision
			}).format(value);
		}

		return new Intl.NumberFormat(locale, {
			minimumFractionDigits: 0,
			maximumFractionDigits: precision
		}).format(value);
	});

	let colorClass = $derived.by(() => {
		if (!colorized || value == null) return '';
		if (value > 0) return 'text-green-600 dark:text-green-400';
		if (value < 0) return 'text-red-600 dark:text-red-400';
		return '';
	});
</script>

<span class={colorClass}>{formatted}</span>

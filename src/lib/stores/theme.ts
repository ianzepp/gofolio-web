import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const initial: Theme = browser ? ((localStorage.getItem('theme') as Theme) ?? 'light') : 'light';

	const { subscribe, set, update } = writable<Theme>(initial);

	if (browser) {
		subscribe((value) => {
			localStorage.setItem('theme', value);
			document.documentElement.classList.toggle('dark', value === 'dark');
		});
	}

	return {
		subscribe,
		set,
		toggle: () => update((t) => (t === 'light' ? 'dark' : 'light'))
	};
}

export const theme = createThemeStore();

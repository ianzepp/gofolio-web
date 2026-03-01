export interface AuthResponse {
	authToken: string;
}

export interface InfoResponse {
	baseCurrency: string;
	benchmarks: Array<{ dataSource: string; symbol: string }>;
	currencies: string[];
	demoAuthToken: string;
	globalPermissions: string[];
	isReadOnlyMode?: boolean;
	statistics: {
		activeUsers1d: number;
		activeUsers30d: number;
	};
}

export interface UserSettings {
	baseCurrency?: string;
	colorScheme?: 'LIGHT' | 'DARK';
	dateRange?: string;
	locale?: string;
	viewMode?: string;
}

export interface UserResponse {
	id: string;
	permissions: string[];
	settings: UserSettings;
	subscription: {
		type: string;
		expiresAt?: string;
	} | null;
	accounts: Array<{ id: string; name: string; platformId?: string }>;
	tags: Array<{ id: string; name: string }>;
	access: Array<{ alias: string; id: string }>;
}

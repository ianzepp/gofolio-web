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
	isRestrictedView?: boolean;
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

// Portfolio Performance (v2 endpoint)

export interface HistoricalDataItem {
	date: string;
	investmentValueWithCurrencyEffect?: number;
	netPerformance?: number;
	netPerformanceInPercentage?: number;
	netPerformanceInPercentageWithCurrencyEffect?: number;
	netPerformanceWithCurrencyEffect?: number;
	netWorth?: number;
	totalAccountBalance?: number;
	totalInvestment?: number;
	totalInvestmentValueWithCurrencyEffect?: number;
	value?: number;
	valueInPercentage?: number;
}

export interface PortfolioPerformance {
	annualizedPerformancePercent?: number;
	currentNetWorth?: number;
	currentValueInBaseCurrency: number;
	netPerformance: number;
	netPerformancePercentage: number;
	netPerformancePercentageWithCurrencyEffect: number;
	netPerformanceWithCurrencyEffect: number;
	totalInvestment: number;
	totalInvestmentValueWithCurrencyEffect: number;
}

export interface PortfolioPerformanceResponse {
	chart?: HistoricalDataItem[];
	firstOrderDate?: string;
	performance: PortfolioPerformance;
	errors?: Array<{ dataSource: string; symbol: string }>;
}

// Portfolio Holdings

export interface PortfolioPosition {
	allocationInPercentage: number;
	assetClass?: string;
	assetSubClass?: string;
	currency: string;
	exchange?: string;
	grossPerformance: number;
	grossPerformancePercent: number;
	investment: number;
	marketChange?: number;
	marketChangePercent?: number;
	marketPrice: number;
	name: string;
	netPerformance: number;
	netPerformancePercent: number;
	netPerformancePercentWithCurrencyEffect: number;
	netPerformanceWithCurrencyEffect: number;
	quantity: number;
	symbol: string;
	url?: string;
	valueInBaseCurrency?: number;
	valueInPercentage?: number;
	dataSource?: string;
}

export interface PortfolioHoldingsResponse {
	holdings: PortfolioPosition[];
}

// Portfolio Details / Summary

export interface PortfolioSummary {
	activityCount: number;
	annualizedPerformancePercent: number;
	annualizedPerformancePercentWithCurrencyEffect: number;
	cash: number;
	currentNetWorth?: number;
	currentValueInBaseCurrency: number;
	dateOfFirstActivity?: string;
	dividendInBaseCurrency: number;
	emergencyFund?: {
		assets: number;
		cash: number;
		total: number;
	};
	excludedAccountsAndActivities: number;
	fees: number;
	interestInBaseCurrency: number;
	liabilitiesInBaseCurrency: number;
	netPerformance: number;
	netPerformancePercentage: number;
	netPerformancePercentageWithCurrencyEffect: number;
	netPerformanceWithCurrencyEffect: number;
	totalBuy: number;
	totalInvestment: number;
	totalSell: number;
}

export interface PortfolioDetails {
	accounts: Record<
		string,
		{
			balance: number;
			currency: string;
			name: string;
			valueInBaseCurrency: number;
			valueInPercentage?: number;
		}
	>;
	holdings: Record<string, PortfolioPosition>;
	summary?: PortfolioSummary;
	hasError?: boolean;
}

// Accounts

export interface AccountWithValue {
	id: string;
	balance: number;
	currency: string;
	isExcluded: boolean;
	name: string;
	platformId?: string | null;
	comment?: string | null;
	platform?: { id: string; name: string; url?: string };
	activitiesCount: number;
	allocationInPercentage: number;
	balanceInBaseCurrency: number;
	dividendInBaseCurrency: number;
	interestInBaseCurrency: number;
	value: number;
	valueInBaseCurrency: number;
}

export interface AccountsResponse {
	accounts: AccountWithValue[];
	activitiesCount: number;
	totalBalanceInBaseCurrency: number;
	totalValueInBaseCurrency: number;
}

// Watchlist

export type MarketCondition = 'ALL_TIME_HIGH' | 'BEAR_MARKET' | 'NEUTRAL_MARKET';
export type BenchmarkTrend = 'DOWN' | 'NEUTRAL' | 'UNKNOWN' | 'UP';

export interface Benchmark {
	dataSource: string;
	marketCondition: MarketCondition;
	name: string;
	performances: {
		allTimeHigh: {
			date?: string;
			performancePercent: number;
		};
	};
	symbol: string;
	trend50d: BenchmarkTrend;
	trend200d: BenchmarkTrend;
}

export interface WatchlistItem {
	dataSource: string;
	symbol: string;
	marketCondition: MarketCondition;
	name: string;
	performances: Benchmark['performances'];
	trend50d: BenchmarkTrend;
	trend200d: BenchmarkTrend;
}

export interface WatchlistResponse {
	watchlist: WatchlistItem[];
}

export interface BenchmarkResponse {
	benchmarks: Benchmark[];
}

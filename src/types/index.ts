export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  role: 'user' | 'admin';
  preferences: {
    currency: string;
    language: string;
    theme: 'dark' | 'light';
  };
  savedCityIds: string[];
}

export interface Activity {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Entertainment';
  cost: number;
  durationHours: number;
  rating: number;
  description: string;
  coverImage: string;
  location: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  coverImage: string;
  description: string;
  costIndex: '$' | '$$' | '$$$' | '$$$$';
  popularityScore: number;
  averageDailyCost: number;
  tags: string[];
}

export interface TripActivity {
  id: string;
  stopId: string;
  activityId?: string;
  name: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Entertainment' | 'Transport' | 'Stay' | 'Other';
  startTime: string;
  durationHours: number;
  cost: number;
  description?: string;
  coverImage?: string;
  completed?: boolean;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  cityName: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  orderIndex: number;
  activities: TripActivity[];
  stayCost: number;
  transportCost: number;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  coverImage: string;
  status: 'planning' | 'upcoming' | 'completed';
  stops: TripStop[];
  createdAt: string;
  isPublic: boolean;
  shareToken: string;
}

export interface ExpenseSummary {
  totalEstimatedBudget: number;
  totalActualCost: number;
  byCategory: {
    transport: number;
    accommodation: number;
    activities: number;
    meals: number;
    other: number;
  };
  dailyExpenses: {
    date: string;
    dayLabel: string;
    cityName: string;
    amount: number;
    budgetLimit: number;
    isOverBudget: boolean;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  popularCities: { cityName: string; count: number }[];
  popularCategories: { category: string; count: number }[];
  monthlyEngagement: { month: string; activeUsers: number; tripsCreated: number }[];
}

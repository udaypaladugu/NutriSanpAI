export interface NutritionData {
  foodName: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  description: string;
  isFood: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
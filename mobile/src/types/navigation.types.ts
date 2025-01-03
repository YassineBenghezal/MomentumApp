import { Habit } from "./habit.types";
import { Task } from "./task.types";

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Signup: undefined;
    AddTask: undefined;
    AddHabit: undefined;
    Habits: undefined;
    Tasks: undefined;
    MainTabs: { screen?: string };
    EditTask: { task: Task };
    EditHabit: { habit: Habit };
    HabitStats: { habitId: number, onGoBack: () => void };
};
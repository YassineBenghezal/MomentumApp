import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Category } from '../types/habit.types';

export const getCategoryIcon = (category: Category, size: number = 20, color: string = '#fff') => {
    switch (category) {
        case 'ART':
            return  <FontAwesome name="paint-brush" size={size} color={color} />;
        case 'TASK':
            return <FontAwesome name="tasks" size={size} color={color} />;
        case 'MEDITATION':
            return <FontAwesome name="leaf" size={size} color={color} />;
        case 'STUDIES':
            return <FontAwesome name="book" size={size} color={color} />;
        case 'SPORTS':
            return <FontAwesome name="bicycle" size={size} color={color} />;
        case 'ENTERTAINMENT':
            return <FontAwesome name="film" size={size} color={color} />;
        case 'SOCIAL':
            return <FontAwesome name="users" size={size} color={color} />;
        case 'FINANCES':
            return <FontAwesome name="money" size={size} color={color} />;
        case 'HEALTH':
            return <FontAwesome name="heartbeat" size={size} color={color} />;
        case 'WORK':
            return <FontAwesome name="briefcase" size={size} color={color} />;
        case 'FOOD':
            return <FontAwesome name="cutlery" size={size} color={color} />;
        case 'HOME':
            return <FontAwesome name="home" size={size} color={color} />;
        case 'OUTDOORS':
            return <FontAwesome name="tree" size={size} color={color} />;
        default:
            return <FontAwesome name="ellipsis-h" size={size} color={color} />;
    }
};

export const getCategoryColor = (category: Category): string => {
    switch (category) {
        case 'ART':
            return '#FF6F61';
        case 'TASK':
            return '#007BFF';
        case 'MEDITATION':
            return '#9C27B0';
        case 'STUDIES':
            return '#3F51B5';
        case 'SPORTS':
            return '#4CAF50';
        case 'ENTERTAINMENT':
            return '#FFC107';
        case 'SOCIAL':
            return '#FF9800';
        case 'FINANCES':
            return '#8BC34A';
        case 'HEALTH':
            return '#E91E63';
        case 'WORK':
            return '#9E9E9E';
        case 'FOOD':
            return '#FF5722';
        case 'HOME':
            return '#795548';
        case 'OUTDOORS':
            return '#4CAF50';
        default:
            return '#607D8B';
    }
};

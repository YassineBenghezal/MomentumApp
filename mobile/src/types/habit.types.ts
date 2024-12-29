export type Category = 'WORK' | 'PERSONAL' | 'HEALTH' | 'FINANCE' | 'OTHER';
export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export type Habit = {
    id: number; // Identifiant unique
    name: string; // Nom de l'habitude
    description?: string; // Description optionnelle
    category: Category; // Catégorie
    frequency: Frequency; // Fréquence
    occurrences?: number; // Nombre d'occurrences prévues (CUSTOM)
    period?: 'week' | 'month' | 'year'; // Période (CUSTOM)
    daysOfWeek?: string[]; // Jours spécifiques de la semaine (ex. ["0", "2", "4"] pour Dim, Mar, Jeu)
    daysOfMonth?: string[]; // Jours spécifiques du mois (ex. ["1", "15", "Dernier"])
    daysOfYear?: { month: number; day: number }[]; // Jours spécifiques de l'année
    startDate: string; // Date de début (format ISO)
    endDate?: string | null; // Date de fin (optionnelle)
    completionMode: 'BINARY' | 'NUMERIC'; // Mode de complétion (Oui/Non ou Quantifiable)
    unit?: string; // Unité de référence pour le mode numérique
    createdAt: string; // Date de création (format ISO)
    updatedAt: string; // Dernière mise à jour (format ISO)
    userId: number; // Référence à l'utilisateur propriétaire
};

export type Category = 'ART' | 'TASK' | 'MEDITATION' | 'STUDIES' | 'SPORTS' | 'ENTERTAINMENT' | 'SOCIAL' | 'FINANCES' | 'HEALTH' | 'WORK' | 'FOOD' | 'HOME' | 'OUTDOORS' | 'OTHER';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Task = {
    id: number; // Identifiant unique
    title: string; // Titre de la tâche
    description?: string; // Description optionnelle
    category: Category; // Catégorie
    priority: Priority; // Priorité
    deadline: string; // Date limite (format ISO)
    completed: boolean; // Indicateur si la tâche est complétée
    completedAt?: string; // Date de complétion (format ISO)
    archived: boolean; // Indicateur si la tâche est archivée
    createdAt: string; // Date de création (format ISO)
    updatedAt: string; // Dernière mise à jour (format ISO)
    userId: number; // Référence à l'utilisateur propriétaire
};

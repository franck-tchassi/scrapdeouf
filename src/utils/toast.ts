// Fonction utilitaire pour afficher des notifications de succès
export const showSuccess = (message: string) => {
    // Pour l'instant, on utilise console.log
    // Plus tard, vous pourrez intégrer une vraie bibliothèque de toast comme react-hot-toast ou sonner
    console.log(`✅ ${message}`);
    alert(message); // Solution temporaire pour l'affichage
};

export const showError = (message: string) => {
    console.error(`❌ ${message}`);
    alert(`Erreur: ${message}`);
};




































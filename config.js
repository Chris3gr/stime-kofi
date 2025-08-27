// Configuration pour l'application Café avec Kofi
// Compatible avec déploiement statique (Apache, Nginx, GitHub Pages, etc.)

window.KOFI_CONFIG = {
    // Mode de base de données
    database: {
        type: 'memory', // 'memory' pour localStorage + RAM
        persistence: 'localStorage', // Sauvegarde dans le navigateur
        autoSeed: true // Ajouter des données de test automatiquement
    },
    
    // Configuration de l'application
    app: {
        name: 'Café avec Kofi',
        version: '2.0.0',
        environment: 'static', // 'static' pour déploiement HTML pur
        debug: false // Mettre à true pour plus de logs
    },
    
    // URLs et chemins
    paths: {
        css: './css/',
        js: './js/',
        images: './images/'
    },
    
    // Configuration des fonctionnalités
    features: {
        notifications: true,
        animations: true,
        easterEggs: true,
        autoSave: true,
        offlineMode: true
    },
    
    // Données par défaut
    defaults: {
        appointmentStatus: 'pending',
        maxAppointmentsDisplay: 50,
        autoRefreshInterval: 30000, // 30 secondes
        animationDuration: 300
    },
    
    // Messages et textes
    messages: {
        welcomeConsole: `
    ☕ ═══════════════════════════════════════ ☕
      Bienvenue dans l'app Café avec Kofi !
      🗄️ Base de données en mémoire active
      📱 Mode statique - Fonctionne partout !
      Développé avec ❤️ et beaucoup de caféine
    ☕ ═══════════════════════════════════════ ☕
        `,
        dbReady: '✅ Base de données initialisée avec succès',
        dbError: '❌ Erreur de base de données',
        saveSuccess: '💾 Données sauvegardées',
        loadError: '⚠️ Impossible de charger les données'
    }
};

// Fonction utilitaire pour les logs
window.kofiLog = function(message, type = 'info') {
    if (!window.KOFI_CONFIG.app.debug && type === 'debug') return;
    
    const emoji = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        debug: '🔧'
    };
    
    console.log(`${emoji[type]} ${message}`);
};

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.KOFI_CONFIG;
}

kofiLog('Configuration chargée - Mode statique activé', 'success');
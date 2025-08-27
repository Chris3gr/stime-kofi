// Base de données en mémoire pour l'application Café avec Kofi
// Compatible avec serveurs HTML statiques (Apache, Nginx, etc.)

class MemoryDatabase {
    constructor() {
        this.tables = {};
        this.initializeStorage();
        this.loadFromLocalStorage();
    }

    initializeStorage() {
        // Initialiser avec le schéma des appointments
        this.tables.appointments = {
            schema: {
                id: { type: 'text', required: true },
                name: { type: 'text', required: true },
                date: { type: 'text', required: true },
                time: { type: 'text', required: true },
                location: { type: 'text', required: true },
                otherLocation: { type: 'text', required: false },
                coffeeType: { type: 'text', required: true },
                mood: { type: 'text', required: true },
                message: { type: 'text', required: false },
                status: { type: 'text', required: true, default: 'pending' },
                kofi_response: { type: 'text', required: false },
                created_at: { type: 'number', required: true },
                updated_at: { type: 'number', required: true }
            },
            data: []
        };
    }

    // Sauvegarder dans le localStorage du navigateur
    saveToLocalStorage() {
        try {
            localStorage.setItem('kofi_cafe_db', JSON.stringify(this.tables));
        } catch (error) {
            console.warn('Impossible de sauvegarder en localStorage:', error);
        }
    }

    // Charger depuis le localStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('kofi_cafe_db');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Fusionner les données sauvées avec la structure par défaut
                if (parsed.appointments && parsed.appointments.data) {
                    this.tables.appointments.data = parsed.appointments.data;
                }
            }
        } catch (error) {
            console.warn('Impossible de charger depuis localStorage:', error);
        }
    }

    // Générer un UUID simple
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Créer un enregistrement
    create(tableName, data) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        const table = this.tables[tableName];
        const now = Date.now();
        
        // Ajouter les champs système
        const record = {
            id: this.generateId(),
            ...data,
            gs_project_id: 'kofi-cafe-app',
            gs_table_name: tableName,
            created_at: now,
            updated_at: now
        };

        // Valider les champs requis
        for (const [field, config] of Object.entries(table.schema)) {
            if (config.required && !record[field] && !config.default) {
                throw new Error(`Le champ ${field} est requis`);
            }
            if (config.default && !record[field]) {
                record[field] = config.default;
            }
        }

        table.data.push(record);
        this.saveToLocalStorage();
        
        return record;
    }

    // Lister les enregistrements avec pagination
    list(tableName, options = {}) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        const table = this.tables[tableName];
        let data = [...table.data].filter(record => !record.deleted);

        // Recherche
        if (options.search) {
            const searchTerm = options.search.toLowerCase();
            data = data.filter(record => 
                Object.values(record).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                )
            );
        }

        // Tri
        if (options.sort) {
            const sortField = options.sort;
            data.sort((a, b) => {
                if (a[sortField] < b[sortField]) return -1;
                if (a[sortField] > b[sortField]) return 1;
                return 0;
            });
        }

        // Pagination
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 100;
        const offset = (page - 1) * limit;
        const paginatedData = data.slice(offset, offset + limit);

        return {
            data: paginatedData,
            total: data.length,
            page: page,
            limit: limit,
            table: tableName,
            schema: table.schema
        };
    }

    // Obtenir un enregistrement par ID
    findById(tableName, id) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        const record = this.tables[tableName].data.find(r => r.id === id);
        if (!record) {
            throw new Error(`Enregistrement ${id} non trouvé`);
        }
        
        return record;
    }

    // Mettre à jour un enregistrement
    update(tableName, id, data) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        const table = this.tables[tableName];
        const recordIndex = table.data.findIndex(r => r.id === id);
        
        if (recordIndex === -1) {
            throw new Error(`Enregistrement ${id} non trouvé`);
        }

        // Fusionner les données
        table.data[recordIndex] = {
            ...table.data[recordIndex],
            ...data,
            updated_at: Date.now()
        };

        this.saveToLocalStorage();
        return table.data[recordIndex];
    }

    // Supprimer un enregistrement (soft delete)
    delete(tableName, id) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        const table = this.tables[tableName];
        const recordIndex = table.data.findIndex(r => r.id === id);
        
        if (recordIndex === -1) {
            throw new Error(`Enregistrement ${id} non trouvé`);
        }

        // Soft delete
        table.data[recordIndex].deleted = true;
        table.data[recordIndex].updated_at = Date.now();

        this.saveToLocalStorage();
        return true;
    }

    // Vider complètement une table
    clear(tableName) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} n'existe pas`);
        }

        this.tables[tableName].data = [];
        this.saveToLocalStorage();
        return true;
    }

    // Ajouter des données de test
    seedTestData() {
        const testAppointments = [
            {
                name: "Marie Latté",
                date: "2025-08-28",
                time: "10:00",
                location: "central-perk",
                coffeeType: "latte",
                mood: "sociable",
                message: "J'ai hâte de discuter de nos projets autour d'un bon café ! ☕",
                status: "confirmed",
                kofi_response: "Génial ! Kofi trépigne d'impatience ! 🕺"
            },
            {
                name: "Jean Moka",
                date: "2025-08-29",
                time: "14:00",
                location: "starbucks",
                coffeeType: "mocha",
                mood: "energique",
                message: "Prêt à conquérir le monde après ce moka ! 🚀",
                status: "pending",
                kofi_response: "OMG ! Tu as choisi MON café préféré ! Je vais te faire le MEILLEUR moka de ta vie ! 🍫☕✨"
            },
            {
                name: "Sophie Fraise",
                date: "2025-08-30",
                time: "16:00",
                location: "cafe-kofi",
                coffeeType: "chocolat-fraise",
                mood: "rigolo",
                message: "Chocolat + fraises = bonheur absolu ! 🍫🍓",
                status: "confirmed",
                kofi_response: "NO WAY ! Tu connais ma combo secrète ! Chocolat + fraises = paradis absolu ! 🍫🍓🎉"
            },
            {
                name: "Paul Créatif",
                date: "2025-09-01",
                time: "10:00",
                location: "terrasse",
                coffeeType: "fraise-latte",
                mood: "creatif",
                message: "Un latte aux fraises pour stimuler ma créativité ! 🍓☕",
                status: "pending",
                kofi_response: "Waouh ! Ma création signature ! Tu vas adorer ce mélange café-fraise ! 🍓☕💖"
            }
        ];

        // Ajouter seulement s'il n'y a pas déjà de données
        if (this.tables.appointments.data.length === 0) {
            testAppointments.forEach(appointment => {
                this.create('appointments', appointment);
            });
            console.log('✅ Données de test ajoutées !');
        }
    }
}

// API simulée compatible avec l'ancien système
class MockAPI {
    constructor() {
        this.db = new MemoryDatabase();
        // Ajouter des données de test au premier chargement
        this.db.seedTestData();
    }

    // Simuler une requête fetch
    async mockFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = this.handleRequest(url, options);
                    resolve({
                        ok: true,
                        status: result.status || 200,
                        json: () => Promise.resolve(result.data)
                    });
                } catch (error) {
                    resolve({
                        ok: false,
                        status: error.status || 500,
                        json: () => Promise.resolve({ error: error.message })
                    });
                }
            }, Math.random() * 200 + 100); // Simuler une latence réseau
        });
    }

    handleRequest(url, options) {
        const method = options.method || 'GET';
        const urlParts = url.split('/');
        
        // Parse: tables/{table}/{id?}
        if (urlParts[0] === 'tables') {
            const tableName = urlParts[1];
            const recordId = urlParts[2];
            
            switch (method) {
                case 'GET':
                    if (recordId) {
                        return {
                            data: this.db.findById(tableName, recordId),
                            status: 200
                        };
                    } else {
                        // Parse query parameters
                        const queryParams = this.parseQueryString(url);
                        return {
                            data: this.db.list(tableName, queryParams),
                            status: 200
                        };
                    }
                
                case 'POST':
                    const createData = JSON.parse(options.body || '{}');
                    return {
                        data: this.db.create(tableName, createData),
                        status: 201
                    };
                
                case 'PUT':
                    const updateData = JSON.parse(options.body || '{}');
                    return {
                        data: this.db.update(tableName, recordId, updateData),
                        status: 200
                    };
                
                case 'DELETE':
                    this.db.delete(tableName, recordId);
                    return {
                        data: null,
                        status: 204
                    };
                
                default:
                    throw new Error(`Méthode ${method} non supportée`);
            }
        }
        
        throw new Error(`Endpoint ${url} non trouvé`);
    }

    parseQueryString(url) {
        const queryStart = url.indexOf('?');
        if (queryStart === -1) return {};
        
        const queryString = url.substring(queryStart + 1);
        const params = {};
        
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });
        
        return params;
    }
}

// Instance globale de l'API
window.mockAPI = new MockAPI();

// Remplacer fetch pour les appels vers 'tables/'
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    // Si l'URL commence par 'tables/', utiliser notre API mock
    if (typeof url === 'string' && url.startsWith('tables/')) {
        return window.mockAPI.mockFetch(url, options);
    }
    
    // Sinon, utiliser fetch normal
    return originalFetch.apply(this, arguments);
};

console.log('📦 Base de données en mémoire initialisée !');
console.log('🔧 API mock active pour les URLs commençant par "tables/"');
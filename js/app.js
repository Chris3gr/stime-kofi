// Application Café avec Kofi - JavaScript rigolo ! ☕

class CafeAvecKofi {
    constructor() {
        this.appointments = [];
        this.kofiResponses = [
            "Génial ! Kofi trépigne d'impatience ! 🕺",
            "Wohooo ! Un nouveau compagnon de café ! ☕✨",
            "Kofi fait déjà chauffer la machine ! 🔥",
            "Parfait ! Kofi prépare ses meilleures blagues ! 😄",
            "Excellent choix ! Kofi va sortir sa tasse préférée ! ☕❤️",
            "Super ! Kofi pratique déjà son latte art ! 🎨",
            "Fantastique ! Kofi va préparer une surprise ! 🎁",
            "Merveilleux ! Kofi compte déjà les minutes ! ⏰",
            "Incroyable ! Kofi va mettre sa plus belle chemise ! 👔",
            "Top ! Kofi prépare l'atmosphère parfaite ! 🌟"
        ];
        
        this.kofiSpecialResponses = {
            'mocha': "OMG ! Tu as choisi MON café préféré ! Je vais te faire le MEILLEUR moka de ta vie ! 🍫☕✨",
            'chocolat': "YESSS ! Chocolat chaud, mon péché mignon ! J'ai du chocolat belge qui t'attend ! 🍫😍",
            'fraise-latte': "Waouh ! Ma création signature ! Tu vas adorer ce mélange café-fraise ! 🍓☕💖",
            'chocolat-fraise': "NO WAY ! Tu connais ma combo secrète ! Chocolat + fraises = paradis absolu ! 🍫🍓🎉",
            'fraise-smoothie': "Excellente idée ! J'ai des fraises ultra fraîches qui n'attendent que toi ! 🍓🌟"
        };
        this.funFacts = [
            "💡 Le café était utilisé comme monnaie en Éthiopie !",
            "☕ Les Finlandais boivent le plus de café au monde !",
            "🌍 Le café pousse dans plus de 70 pays !",
            "📈 Plus de 2 milliards de tasses sont bues chaque jour !",
            "🐐 Le café fut découvert par un berger et ses chèvres !",
            "⚡ La caféine met 6 heures à s'éliminer du corps !",
            "🎵 Bach a composé une cantate sur le café !",
            "💰 Le café est la 2ème marchandise la plus échangée !",
            "🌱 Un caféier peut produire du café pendant 100 ans !",
            "🔬 Le café contient plus de 1000 composés chimiques !"
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAppointments();
        this.startFunFactRotation();
        this.setMinDate();
        this.startCoffeeAnimation();
        this.startKofiInteractions();
    }

    setupEventListeners() {
        // Formulaire de rendez-vous
        const form = document.getElementById('appointmentForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Gestion du champ "autre lieu"
        const locationSelect = document.getElementById('location');
        locationSelect.addEventListener('change', (e) => this.toggleOtherLocation(e));

        // Compteur de caractères pour le message
        const messageTextarea = document.getElementById('message');
        messageTextarea.addEventListener('input', (e) => this.updateCharacterCount(e));

        // Bouton de rafraîchissement
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => this.loadAppointments());

        // Fermeture des notifications
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('notification-close')) {
                this.hideNotification();
            }
        });

        // Animation sur les champs du formulaire
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.animateInputFocus(e.target));
            input.addEventListener('blur', (e) => this.animateInputBlur(e.target));
        });
    }

    setMinDate() {
        // Empêcher de prendre rendez-vous dans le passé
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    toggleOtherLocation(event) {
        const otherLocationGroup = document.getElementById('otherLocationGroup');
        const otherLocationInput = document.getElementById('otherLocation');
        
        if (event.target.value === 'autre') {
            otherLocationGroup.style.display = 'block';
            otherLocationInput.required = true;
            // Animation d'apparition
            otherLocationGroup.style.opacity = '0';
            otherLocationGroup.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                otherLocationGroup.style.transition = 'all 0.3s ease';
                otherLocationGroup.style.opacity = '1';
                otherLocationGroup.style.transform = 'translateY(0)';
            }, 10);
        } else {
            otherLocationGroup.style.display = 'none';
            otherLocationInput.required = false;
            otherLocationInput.value = '';
        }
    }

    updateCharacterCount(event) {
        const textarea = event.target;
        const counter = textarea.parentElement.querySelector('.character-count');
        const currentLength = textarea.value.length;
        const maxLength = 200;
        
        counter.textContent = `${currentLength}/${maxLength} caractères`;
        
        // Changement de couleur selon la proximité de la limite
        if (currentLength > maxLength * 0.8) {
            counter.style.color = 'var(--warning-color)';
        } else if (currentLength >= maxLength) {
            counter.style.color = 'var(--error-color)';
        } else {
            counter.style.color = 'var(--secondary-color)';
        }
    }

    animateInputFocus(input) {
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 15px rgba(210, 105, 30, 0.4)';
    }

    animateInputBlur(input) {
        input.style.transform = 'scale(1)';
        input.style.boxShadow = 'none';
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const appointmentData = this.processFormData(formData);
        
        try {
            // Animation du bouton
            const submitBtn = event.target.querySelector('.submit-btn');
            this.animateSubmitButton(submitBtn);
            
            // Ajouter la réponse amusante de Kofi (spéciale si c'est ses boissons préférées)
            appointmentData.kofi_response = this.getRandomKofiResponse(appointmentData.coffeeType);
            appointmentData.status = 'pending';
            
            // Sauvegarder en base
            await this.saveAppointment(appointmentData);
            
            // Afficher une notification de succès
            this.showNotification('success', '🎉 Rendez-vous enregistré ! Kofi va vous contacter bientôt !');
            
            // Réinitialiser le formulaire avec animation
            this.resetFormWithAnimation(event.target);
            
            // Recharger la liste
            setTimeout(() => this.loadAppointments(), 1000);
            
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            this.showNotification('error', '😱 Oups ! Quelque chose a mal tourné. Kofi enquête !');
        }
    }

    processFormData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Utiliser otherLocation si "autre" est sélectionné
        if (data.location === 'autre' && data.otherLocation) {
            data.location = data.otherLocation;
            delete data.otherLocation;
        }
        
        return data;
    }

    getRandomKofiResponse(coffeeType = null) {
        // Réponse spéciale si c'est une des boissons préférées de Kofi
        if (coffeeType && this.kofiSpecialResponses[coffeeType]) {
            return this.kofiSpecialResponses[coffeeType];
        }
        
        // Sinon, réponse aléatoire classique
        return this.kofiResponses[Math.floor(Math.random() * this.kofiResponses.length)];
    }

    animateSubmitButton(button) {
        button.style.transform = 'scale(0.95)';
        button.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Kofi reçoit votre demande...';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.innerHTML = '<i class=\"fas fa-check\"></i> Envoyé ! ✨';
        }, 1500);
        
        setTimeout(() => {
            button.innerHTML = '<i class=\"fas fa-magic\"></i> Réserver ce moment magique ! ✨';
        }, 3000);
    }

    resetFormWithAnimation(form) {
        // Animation de disparition
        form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        form.style.opacity = '0.7';
        form.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            form.reset();
            form.style.opacity = '1';
            form.style.transform = 'scale(1)';
            
            // Remettre les compteurs à zéro
            const characterCount = form.querySelector('.character-count');
            if (characterCount) {
                characterCount.textContent = '0/200 caractères';
                characterCount.style.color = 'var(--secondary-color)';
            }
            
            // Cacher le champ "autre lieu" si affiché
            document.getElementById('otherLocationGroup').style.display = 'none';
            document.getElementById('otherLocation').required = false;
            
        }, 300);
    }

    async saveAppointment(data) {
        const response = await fetch('tables/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
        }
        
        return await response.json();
    }

    async loadAppointments() {
        try {
            // Animation de chargement
            const appointmentsList = document.getElementById('appointmentsList');
            appointmentsList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-coffee fa-spin"></i>
                    <p>Kofi prépare la liste des rendez-vous...</p>
                </div>
            `;
            
            const response = await fetch('tables/appointments?limit=50&sort=created_at');
            const data = await response.json();
            
            setTimeout(() => {
                this.displayAppointments(data.data || []);
            }, 1000); // Petit délai pour l'effet
            
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            this.showNotification('error', '😵 Impossible de charger les rendez-vous. Kofi vérifie sa connexion !');
        }
    }

    displayAppointments(appointments) {
        const appointmentsList = document.getElementById('appointmentsList');
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-calendar-times"></i>
                    <p>Aucun rendez-vous pour le moment.<br>Soyez le premier à inviter Kofi ! ☕</p>
                </div>
            `;
            return;
        }
        
        appointmentsList.innerHTML = appointments
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(appointment => this.createAppointmentCard(appointment))
            .join('');
    }

    createAppointmentCard(appointment) {
        const locationText = this.getLocationText(appointment.location);
        const coffeeText = this.getCoffeeText(appointment.coffeeType);
        const moodText = this.getMoodText(appointment.mood);
        const timeText = this.getTimeText(appointment.time);
        const statusClass = `status-${appointment.status}`;
        const statusText = this.getStatusText(appointment.status);
        
        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-name">
                        <i class="fas fa-user"></i> ${appointment.name}
                    </div>
                    <div class="appointment-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="appointment-details">
                    <div><i class="fas fa-calendar"></i> ${this.formatDate(appointment.date)} à ${timeText}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${locationText}</div>
                    <div><i class="fas fa-coffee"></i> ${coffeeText}</div>
                    <div><i class="fas fa-smile"></i> Humeur : ${moodText}</div>
                    ${appointment.message ? `<div><i class="fas fa-comment"></i> "${appointment.message}"</div>` : ''}
                </div>
                ${appointment.kofi_response ? `
                    <div class="kofi-response">
                        <i class="fas fa-coffee"></i> <strong>Kofi répond :</strong> ${appointment.kofi_response}
                    </div>
                ` : ''}
            </div>
        `;
    }

    getLocationText(location) {
        const locationMap = {
            'central-perk': 'Central Perk (comme dans Friends) ☕',
            'starbucks': 'Starbucks du coin 🌟',
            'cafe-kofi': 'Le Café Secret de Kofi 🤫',
            'bureau': 'Au bureau (avec machine à café) 🏢',
            'terrasse': 'Une jolie terrasse ☀️'
        };
        return locationMap[location] || location;
    }

    getCoffeeText(coffeeType) {
        const coffeeMap = {
            'espresso': 'Espresso - Court et intense ⚡',
            'americano': 'Americano - Classique et fort 🇺🇸',
            'latte': 'Latte - Doux et crémeux 🥛',
            'cappuccino': 'Cappuccino - Mousseux parfait ☁️',
            'macchiato': 'Macchiato - Sophistiqué 🎨',
            'mocha': 'Moka - Café + chocolat, le préféré de Kofi ! 🍫☕',
            'chocolat': 'Chocolat chaud - Comme Kofi l\'adore ! 🍫',
            'fraise-latte': 'Latte aux fraises - Spécialité Kofi ! 🍓☕',
            'chocolat-fraise': 'Chocolat-Fraises - Le combo de Kofi ! 🍫🍓',
            'tea': 'Thé - Team théière 🍵',
            'fraise-smoothie': 'Smoothie aux fraises 🍓',
            'surprise': 'Surprise-moi ! 🎲'
        };
        return coffeeMap[coffeeType] || coffeeType;
    }

    getMoodText(mood) {
        const moodMap = {
            'energique': 'Énergique 🚀',
            'relax': 'Relax 😌',
            'creatif': 'Créatif 💡',
            'sociable': 'Sociable 💬',
            'contemplatif': 'Contemplatif ☁️',
            'rigolo': 'Rigolo 😄'
        };
        return moodMap[mood] || mood;
    }

    getTimeText(time) {
        const timeMap = {
            '08:00': '08h00 - Réveil en douceur ☀️',
            '10:00': '10h00 - Pause matinale 🌅',
            '14:00': '14h00 - Break après-midi 🌞',
            '16:00': '16h00 - L\'heure du goûter ☕',
            '18:00': '18h00 - Décompression du soir 🌆'
        };
        return timeMap[time] || time;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'En attente',
            'confirmed': 'Confirmé',
            'completed': 'Terminé',
            'cancelled': 'Annulé'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showNotification(type, message) {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');
        
        // Définir l'icône selon le type
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        
        icon.className = `notification-icon ${icons[type] || icons.info}`;
        text.textContent = message;
        
        // Appliquer la classe de style
        notification.className = `notification ${type} show`;
        
        // Auto-fermeture après 5 secondes
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.className = 'notification hidden';
    }

    startFunFactRotation() {
        const funFactElement = document.getElementById('funFact');
        let currentFactIndex = 0;
        
        setInterval(() => {
            // Animation de sortie
            funFactElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            funFactElement.style.opacity = '0';
            funFactElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Changer le texte
                currentFactIndex = (currentFactIndex + 1) % this.funFacts.length;
                funFactElement.textContent = this.funFacts[currentFactIndex];
                
                // Animation d'entrée
                funFactElement.style.opacity = '1';
                funFactElement.style.transform = 'translateY(0)';
            }, 500);
        }, 8000); // Changer toutes les 8 secondes
    }

    startCoffeeAnimation() {
        // Animation supplémentaire pour l'icône café dans l'en-tête
        const coffeeIcon = document.querySelector('.coffee-icon');
        
        if (coffeeIcon) {
            setInterval(() => {
                coffeeIcon.style.animation = 'none';
                setTimeout(() => {
                    coffeeIcon.style.animation = 'bounce 2s infinite';
                }, 100);
            }, 10000); // Restart bounce toutes les 10 secondes
        }
        
        // Ajouter des particules de café aléatoires
        this.addRandomCoffeeParticles();
    }

    addRandomCoffeeParticles() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de chance
                this.createCoffeeParticle();
            }
        }, 2000);
    }

    createCoffeeParticle() {
        const coffeeEmojis = ['☕', '🍓', '🍫'];
        const particle = document.createElement('div');
        particle.innerHTML = coffeeEmojis[Math.floor(Math.random() * coffeeEmojis.length)];
        particle.style.position = 'fixed';
        particle.style.fontSize = '20px';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-30px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.animation = 'confetti-fall 4s linear';
        
        document.body.appendChild(particle);
        
        // Supprimer après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }

    createStrawberryChocolateRain() {
        const treats = ['🍓', '🍫', '🍓🍫'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = treats[Math.floor(Math.random() * treats.length)];
                particle.style.position = 'fixed';
                particle.style.fontSize = '25px';
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = '-30px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                particle.style.animation = 'confetti-fall 3s linear';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 150);
        }
    }

    startKofiInteractions() {
        const kofiPhoto = document.querySelector('.kofi-photo');
        const kofiSpeech = document.getElementById('kofiSpeech');
        
        // Messages amusants de Kofi
        const kofiMessages = [
            "Salut ! Prêt pour un café et des fraises ? 🍓☕",
            "Hé ! J'ai du chocolat chaud et des fraises ! 🍫🍓",
            "Coucou ! Café-chocolat-fraises, le trio parfait ! ☕✨",
            "Hello ! Tu as vu mes fraises au chocolat ? 🤓🍓",
            "Salut toi ! Fraises fraîches et chocolat fondant ! 💬",
            "Hé ho ! Le café aux fraises n'attend pas ! ⏰🍓",
            "Ciao ! Ready for chocolate-strawberry magic ? 🎩🍫",
            "Bonjour ! Qui veut des fraises trempées dans le chocolat ? 🌟",
            "Wesh ! Fraises, chocolat et caféine, le combo gagnant ! ⚡",
            "Yo ! Best fraises au chocolat in town ! 🏆🍓🍫",
            "Mmm... Ces fraises au chocolat sont divines ! 😋",
            "J'ai découvert un nouveau café aux notes de fraise ! 🍓",
            "Chocolat noir 70% + fraises de saison = bonheur ! 🍫❤️",
            "Fun fact : les fraises se marient parfaitement au café ! ☕🍓"
        ];

        let messageIndex = 0;

        // Interaction au clic sur la photo
        if (kofiPhoto) {
            kofiPhoto.addEventListener('click', () => {
                // Animation de rebond
                kofiPhoto.style.animation = 'none';
                setTimeout(() => {
                    kofiPhoto.style.animation = 'kofiFloat 3s ease-in-out infinite, bounce 0.6s ease-out';
                }, 10);

                // Changer le message
                messageIndex = (messageIndex + 1) % kofiMessages.length;
                if (kofiSpeech) {
                    kofiSpeech.textContent = kofiMessages[messageIndex];
                }

                // Faire apparaître la bulle temporairement
                const speechBubble = document.querySelector('.kofi-speech-bubble');
                if (speechBubble) {
                    speechBubble.style.animation = 'none';
                    speechBubble.style.opacity = '1';
                    speechBubble.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                    
                    setTimeout(() => {
                        speechBubble.style.animation = 'speechBubble 4s ease-in-out infinite';
                    }, 2500);
                }

                // Créer des particules de joie
                this.createJoyParticles();
            });

            // Animation au survol
            kofiPhoto.addEventListener('mouseenter', () => {
                const speechBubble = document.querySelector('.kofi-speech-bubble');
                if (speechBubble) {
                    speechBubble.style.transition = 'all 0.3s ease';
                    speechBubble.style.opacity = '1';
                    speechBubble.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                }
            });

            kofiPhoto.addEventListener('mouseleave', () => {
                const speechBubble = document.querySelector('.kofi-speech-bubble');
                if (speechBubble) {
                    setTimeout(() => {
                        speechBubble.style.transition = 'all 0.3s ease';
                        speechBubble.style.opacity = '0';
                        speechBubble.style.transform = 'translateX(-50%) translateY(-10px) scale(0.9)';
                    }, 1200);
                }
            });
        }

        // Changer automatiquement le message de Kofi
        setInterval(() => {
            if (kofiSpeech && Math.random() < 0.3) { // 30% de chance
                messageIndex = (messageIndex + 1) % kofiMessages.length;
                kofiSpeech.textContent = kofiMessages[messageIndex];
            }
        }, 10000);

        // Animation de clin d'œil aléatoire
        setInterval(() => {
            if (kofiPhoto && Math.random() < 0.2) { // 20% de chance
                this.kofiWink();
            }
        }, 15000);
    }

    createJoyParticles() {
        const emojis = ['🎉', '✨', '⭐', '💫', '🌟', '☕', '❤️', '🍓', '🍫'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                particle.style.position = 'fixed';
                particle.style.fontSize = '20px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                
                // Position près de la photo de Kofi
                const kofiPhoto = document.querySelector('.kofi-photo');
                if (kofiPhoto) {
                    const rect = kofiPhoto.getBoundingClientRect();
                    particle.style.left = (rect.left + rect.width/2 + (Math.random() - 0.5) * 100) + 'px';
                    particle.style.top = (rect.top + rect.height/2 + (Math.random() - 0.5) * 100) + 'px';
                }
                
                // Animation de dispersion
                particle.style.animation = 'joyParticle 1.5s ease-out forwards';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1500);
            }, i * 100);
        }
    }

    kofiWink() {
        const kofiPhoto = document.querySelector('.kofi-photo');
        if (kofiPhoto) {
            // Effet de clin d'œil avec transform
            kofiPhoto.style.transform = 'scaleX(0.8)';
            setTimeout(() => {
                kofiPhoto.style.transform = 'scaleX(1)';
            }, 150);
        }
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que la base de données soit prête
    if (window.mockAPI) {
        new CafeAvecKofi();
        
        // Message de bienvenue rigolo
        console.log(`
        ☕ ═══════════════════════════════════════ ☕
          Bienvenue dans l'app Café avec Kofi !
          🗄️ Base de données en mémoire active
          Développé avec ❤️ et beaucoup de caféine
        ☕ ═══════════════════════════════════════ ☕
        `);
    } else {
        console.error('❌ Base de données non disponible, rechargement...');
        setTimeout(() => location.reload(), 1000);
    }
});

// Quelques easter eggs pour les développeurs curieux ! 🥚
window.kofiSecrets = {
    makeItRain: () => {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const app = new CafeAvecKofi();
                app.createCoffeeParticle();
            }, i * 100);
        }
    },
    changeCoffeeColor: (color) => {
        document.querySelectorAll('.coffee-icon').forEach(icon => {
            icon.style.color = color;
        });
    },
    partyMode: () => {
        document.body.style.animation = 'rainbow 2s infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    },
    kofiParty: () => {
        const kofiPhoto = document.querySelector('.kofi-photo');
        if (kofiPhoto) {
            kofiPhoto.style.animation = 'kofiFloat 0.5s ease-in-out infinite, rotateBorder 1s linear infinite';
            const app = new CafeAvecKofi();
            for (let i = 0; i < 10; i++) {
                setTimeout(() => app.createJoyParticles(), i * 200);
            }
        }
    },
    kofiWinks: () => {
        const app = new CafeAvecKofi();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => app.kofiWink(), i * 500);
        }
    },
    photoFilter: (filter) => {
        const kofiPhoto = document.querySelector('.kofi-photo');
        if (kofiPhoto) {
            kofiPhoto.style.filter += ` ${filter}`;
        }
    },
    strawberryChocolateRain: () => {
        const app = new CafeAvecKofi();
        app.createStrawberryChocolateRain();
        console.log('🍓🍫 Pluie de délices de Kofi ! 🍫🍓');
    },
    kofiTreats: () => {
        const kofiSpeech = document.getElementById('kofiSpeech');
        if (kofiSpeech) {
            kofiSpeech.textContent = "Mmm... fraises au chocolat ! Mon bonheur absolu ! 🍓🍫😋";
        }
        const app = new CafeAvecKofi();
        app.createStrawberryChocolateRain();
        app.createJoyParticles();
    }
};

console.log('🎮 Easter eggs disponibles : kofiSecrets.makeItRain(), kofiSecrets.kofiParty(), kofiSecrets.strawberryChocolateRain(), kofiSecrets.kofiTreats()');
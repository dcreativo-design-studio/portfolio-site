document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
    const saveCookiePreferences = document.getElementById('saveCookiePreferences');
    const acceptAllCookies = document.getElementById('acceptAllCookies');
    const rejectAllCookies = document.getElementById('rejectAllCookies');
    const analyticsCookies = document.getElementById('analyticsCookies');
    const functionalCookies = document.getElementById('functionalCookies');

    // Verifica se le preferenze dei cookie sono già state impostate
    const cookiePreferences = getCookiePreferences();
    if (cookiePreferences) {
      // Applica le preferenze salvate
      if (cookiePreferences.analytics) {
        analyticsCookies.checked = true;
        // Qui puoi attivare i cookie analitici, ad esempio inizializzando Google Analytics
      }
      if (cookiePreferences.functional) {
        functionalCookies.checked = true;
        // Qui puoi attivare i cookie funzionali
      }

      // Nascondi il banner e mostra il pulsante delle impostazioni
      hideBanner();
    }

    // Event listeners
    saveCookiePreferences.addEventListener('click', function() {
      savePreferences();
      showSuccessMessage("Preferenze cookie salvate!");
    });

    acceptAllCookies.addEventListener('click', function() {
      analyticsCookies.checked = true;
      functionalCookies.checked = true;
      savePreferences();
      showSuccessMessage("Tutti i cookie accettati!");
    });

    rejectAllCookies.addEventListener('click', function() {
      analyticsCookies.checked = false;
      functionalCookies.checked = false;
      savePreferences();
      showSuccessMessage("Cookie opzionali rifiutati!");
    });

    cookieSettingsBtn.addEventListener('click', function() {
      showBanner();
    });

    // Funzioni
    function savePreferences() {
      const preferences = {
        essential: true, // Sempre attivi
        analytics: analyticsCookies.checked,
        functional: functionalCookies.checked,
        date: new Date().toISOString()
      };

      // Salva le preferenze in un cookie
      document.cookie = "cookiePreferences=" + JSON.stringify(preferences) + ";max-age=31536000;path=/;SameSite=Strict";

      // Applica le preferenze
      applyPreferences(preferences);

      // Nascondi il banner e mostra il pulsante delle impostazioni
      hideBanner();
    }
    function applyPreferences(preferences) {
      // Attiva/disattiva i cookie in base alle preferenze
      if (preferences.analytics) {
        // Qui puoi attivare i cookie analitici
        console.log('Cookie analitici attivati');
        // Esempio: inizializzazione di Google Analytics
        initGoogleAnalytics();
      } else {
        // Disattiva i cookie analitici
        console.log('Cookie analitici disattivati');
        // Rimuovi cookie analitici esistenti
        removeCookies(['_ga', '_gat', '_gid']);
      }

      if (preferences.functional) {
        // Qui puoi attivare i cookie funzionali
        console.log('Cookie funzionali attivati');
        // Esempio: attivare cookie di personalizzazione
        enableFunctionalCookies();
      } else {
        // Disattiva i cookie funzionali
        console.log('Cookie funzionali disattivati');
        // Rimuovi cookie funzionali esistenti
        disableFunctionalCookies();
      }
    }

    function hideBanner() {
      cookieConsent.style.animation = 'slideDown 0.5s forwards';
      setTimeout(() => {
        cookieConsent.style.display = 'none';
        cookieSettingsBtn.style.display = 'flex';
      }, 500);
    }

    function showBanner() {
      cookieSettingsBtn.style.display = 'none';
      cookieConsent.style.display = 'block';
      cookieConsent.style.animation = 'slideUp 0.5s forwards';
    }

    function getCookiePreferences() {
      // Ottieni i cookie salvati
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('cookiePreferences=')) {
          try {
            const preferences = JSON.parse(cookie.substring('cookiePreferences='.length, cookie.length));

            // Controlla se le preferenze sono scadute (6 mesi)
            const savedDate = new Date(preferences.date);
            const currentDate = new Date();
            const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;

            if (currentDate - savedDate > sixMonthsInMs) {
              // Le preferenze sono scadute, richiedi il consenso
              return null;
            }

            return preferences;
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    }

    function showSuccessMessage(message) {
      // Crea un elemento per il messaggio di successo
      const successElement = document.createElement('div');
      successElement.className = 'cookie-success';
      successElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
      `;

      // Aggiungi al documento
      document.body.appendChild(successElement);

      // Nascondi il banner
      hideBanner();

      // Rimuovi il messaggio dopo 3 secondi
      setTimeout(() => {
        successElement.style.opacity = '0';
        successElement.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          document.body.removeChild(successElement);
        }, 500);
      }, 3000);
    }

    // Funzioni helper per la gestione dei cookie
    function removeCookies(cookieNames) {
      for (const name of cookieNames) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }

    function initGoogleAnalytics() {
      // Esempio di inizializzazione di Google Analytics
      // In un'implementazione reale, sostituisci con il tuo ID Analytics
      if (typeof window.gtag === 'undefined') {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA-XXXXXXXXX'); // Sostituisci con il tuo ID Analytics

        // Carica lo script di Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXX'; // Sostituisci con il tuo ID Analytics
        document.head.appendChild(script);
      }
    }

    function enableFunctionalCookies() {
      // Esempio di attivazione di cookie funzionali
      // In un'implementazione reale, aggiungi qui la tua logica specifica
      document.cookie = "theme=light; max-age=31536000; path=/; SameSite=Strict";
      document.cookie = "language=it; max-age=31536000; path=/; SameSite=Strict";
    }

    function disableFunctionalCookies() {
      // Esempio di disattivazione di cookie funzionali
      removeCookies(['theme', 'language']);
    }

    // Aggiungi gli header per la policy di sicurezza dei cookie
    function addCookieSecurityHeaders() {
      // In un'applicazione reale, questo andrebbe fatto lato server
      // Qui è solo a scopo dimostrativo
      console.log('Aggiunti header di sicurezza per i cookie');
      // Set-Cookie: HttpOnly; Secure; SameSite=Strict
    }

    // Inizializza le policy legali
    function initLegalModals() {
      // Assicurati che i link nel footer aprano i modali corretti
      document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', function(e) {
          const target = this.getAttribute('data-bs-target');
          if (target) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.querySelector(target));
            modal.show();
          }
        });
      });
    }

    // Chiamata alla funzione di inizializzazione dei modali
    initLegalModals();

    // Verifica la geolocalizzazione per adattare le policy per utenti EU vs non-EU
    // Nota: in un'implementazione reale, questa logica dovrebbe essere gestita lato server
    function checkEULocation() {
      // Controlla se l'utente è nell'UE (esempio semplificato)
      // In un'implementazione reale, utilizzare un servizio di geolocalizzazione
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const europeanTimezones = [
        'Europe/Vienna', 'Europe/Brussels', 'Europe/Sofia', 'Europe/Zagreb',
        'Europe/Nicosia', 'Europe/Prague', 'Europe/Copenhagen', 'Europe/Tallinn',
        'Europe/Helsinki', 'Europe/Paris', 'Europe/Berlin', 'Europe/Athens',
        'Europe/Budapest', 'Europe/Dublin', 'Europe/Rome', 'Europe/Riga',
        'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Malta', 'Europe/Amsterdam',
        'Europe/Warsaw', 'Europe/Lisbon', 'Europe/Bucharest', 'Europe/Bratislava',
        'Europe/Ljubljana', 'Europe/Madrid', 'Europe/Stockholm', 'Europe/London',
        'Europe/Zurich' // Svizzera (non nell'UE ma applica GDPR)
      ];

      return europeanTimezones.includes(timezone);
    }

    // Adatta il comportamento del banner in base alla posizione dell'utente
    function adaptBannerToLocation() {
      const isEU = checkEULocation();

      if (!isEU) {
        // Per utenti non-EU, possiamo avere un approccio opt-out invece di opt-in
        // Ma manteniamo comunque la trasparenza
        console.log('Utente non-EU rilevato, applicando approccio opt-out');
        // Qui puoi personalizzare il messaggio o il comportamento del banner
      } else {
        console.log('Utente EU rilevato, applicando GDPR completo');
      }
    }

    // Chiamare questa funzione all'inizializzazione
    adaptBannerToLocation();
  });

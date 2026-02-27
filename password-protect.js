/**
 * Simple Password Protection for Schreinerei Nowak Website
 * This creates an overlay that blocks access until correct password is entered
 */

(function() {
    'use strict';

    // Configuration
    const CORRECT_PASSWORD = 'nowak2024';
    const SESSION_KEY = 'schreinerei_nowak_auth';

    // Check if already authenticated in this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
        return; // Already authenticated, do nothing
    }

    // Create password overlay
    const overlay = document.createElement('div');
    overlay.id = 'password-overlay';
    overlay.innerHTML = `
        <style>
            #password-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #8E6C4B 0%, #645749 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            #password-box {
                background: white;
                padding: 50px 40px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
                text-align: center;
            }

            #password-box h1 {
                margin: 0 0 10px 0;
                font-family: 'Playfair Display', serif;
                font-size: 32px;
                color: #2c2c2c;
            }

            #password-box p {
                margin: 0 0 30px 0;
                color: #666;
                font-size: 16px;
            }

            #password-input {
                width: 100%;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 16px;
                margin-bottom: 15px;
                box-sizing: border-box;
                font-family: 'Manrope', sans-serif;
                transition: border-color 0.3s;
            }

            #password-input:focus {
                outline: none;
                border-color: #8E6C4B;
            }

            #password-submit {
                width: 100%;
                padding: 15px;
                background: #8E6C4B;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s;
                font-family: 'Manrope', sans-serif;
            }

            #password-submit:hover {
                background: #7f5a35;
            }

            #password-error {
                color: #d32f2f;
                font-size: 14px;
                margin-top: 10px;
                min-height: 20px;
            }

            .password-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 20px;
                background: #f5f5f5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
            }
        </style>

        <div id="password-box">
            <div class="password-icon">🔒</div>
            <h1>Schreinerei Nowak</h1>
            <p>Diese Seite ist passwortgeschützt.<br>Bitte geben Sie das Passwort ein.</p>
            <form id="password-form">
                <input
                    type="password"
                    id="password-input"
                    placeholder="Passwort eingeben..."
                    autocomplete="off"
                    autofocus
                />
                <button type="submit" id="password-submit">Zugang erhalten</button>
                <div id="password-error"></div>
            </form>
        </div>
    `;

    // Add overlay to page
    document.body.appendChild(overlay);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Handle form submission
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const errorDiv = document.getElementById('password-error');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const enteredPassword = input.value;

        if (enteredPassword === CORRECT_PASSWORD) {
            // Correct password - store in session and remove overlay
            sessionStorage.setItem(SESSION_KEY, 'true');

            // Fade out animation
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';

            setTimeout(function() {
                overlay.remove();
                document.body.style.overflow = '';
            }, 500);
        } else {
            // Wrong password - show error
            errorDiv.textContent = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
            input.value = '';
            input.focus();

            // Shake animation
            const box = document.getElementById('password-box');
            box.style.animation = 'shake 0.5s';
            setTimeout(function() {
                box.style.animation = '';
            }, 500);
        }
    });

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

})();

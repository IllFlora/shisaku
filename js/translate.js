/*
 * On-page translation for Grand Trading.
 * The Japanese pages are the single source of truth. The header "JP | EN" switch
 * drives Google's website translator, and the choice is kept in the `googtrans`
 * cookie so it persists while navigating between pages.
 */
(function () {
    'use strict';

    function setCookie(value) {
        var host = location.hostname;
        var targets = ['', ';domain=' + host];
        if (host.indexOf('.') > -1) targets.push(';domain=.' + host);
        targets.forEach(function (suffix) {
            document.cookie = 'googtrans=' + value + ';path=/' + suffix;
        });
    }

    function clearCookie() {
        var host = location.hostname;
        var expired = ';expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        var targets = ['', ';domain=' + host];
        if (host.indexOf('.') > -1) targets.push(';domain=.' + host);
        targets.forEach(function (suffix) {
            document.cookie = 'googtrans=' + expired + suffix;
        });
    }

    function currentLang() {
        var m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
        return m ? decodeURIComponent(m[1]) : 'ja';
    }

    // Switch language (reload so the choice applies cleanly and persists).
    window.gtTranslate = function (lang) {
        if (!lang || lang === 'ja') {
            clearCookie();
        } else {
            setCookie('/ja/' + lang);
        }
        window.location.reload();
    };

    // Called by Google's element.js once it loads.
    window.googleTranslateElementInit = function () {
        if (!document.getElementById('google_translate_element')) {
            var holder = document.createElement('div');
            holder.id = 'google_translate_element';
            holder.style.display = 'none';
            document.body.appendChild(holder);
        }
        /* global google */
        new google.translate.TranslateElement({
            pageLanguage: 'ja',
            includedLanguages: 'en',
            autoDisplay: false
        }, 'google_translate_element');
    };

    document.addEventListener('DOMContentLoaded', function () {
        var lang = currentLang();

        // Reflect the active language in the JP | EN switch and wire up clicks.
        document.querySelectorAll('.lang-switch [data-lang]').forEach(function (link) {
            var isActive = link.getAttribute('data-lang') === (lang === 'ja' ? 'ja' : 'en');
            link.classList.toggle('active', isActive);
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.gtTranslate(link.getAttribute('data-lang'));
            });
        });

        // Only pull in Google's translator when a non-Japanese language is active.
        if (lang && lang !== 'ja') {
            var holder = document.getElementById('google_translate_element');
            if (!holder) {
                holder = document.createElement('div');
                holder.id = 'google_translate_element';
                holder.style.display = 'none';
                document.body.appendChild(holder);
            }
            var s = document.createElement('script');
            s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.head.appendChild(s);
        }
    });
})();

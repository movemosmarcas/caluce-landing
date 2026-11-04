// Landing comparativa Calucé
(function () {
    'use strict';

    // Mismo Apps Script que index.html (main.js), para que los leads lleguen a la misma hoja.
    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyLURkc8z_KQ6VQrvx0bXarpJi5FAUWD-cElD9gVxXQ-abSU8F6sWpbtOuExsmOUBULjg/exec';

    // Tasas aproximadas usadas en index.html (TRM $4.010 y EUR $4.400).
    var RATES = { COP: 1, USD: 4010, EUR: 4400 };
    var body = document.body;

    // ---------- Gracias en línea para el formulario de mitad de página ----------
    function inlineThanks() {
        var gate = document.getElementById('gate');
        if (!gate) return;
        gate.classList.add('is-done');
        var bar = gate.querySelector('.gate-progress span');
        if (bar) bar.style.width = '100%';
        var eyebrow = gate.querySelector('.eyebrow');
        if (eyebrow) eyebrow.textContent = '¡Recibimos tus datos!';
        var title = gate.querySelector('.gate-title');
        if (title) title.textContent = 'Gracias, un asesor de Calucé te contactará muy pronto';
        var r6 = document.getElementById('razon-6');
        if (r6) setTimeout(function () { r6.scrollIntoView({ behavior: 'smooth' }); }, 1200);
    }

    // ---------- Envío de formularios ----------
    function sendLead(form) {
        var data = new FormData(form);
        var qs = new URLSearchParams(window.location.search);
        var params = new URLSearchParams();
        params.append('nombre', data.get('nombre') || '');
        params.append('celular', data.get('celular') || '');
        params.append('email', data.get('email') || '');
        params.append('para_quien', 'No especificado');
        params.append('sede', data.get('sede') || '');
        params.append('servicio', data.get('servicio') || 'No especificado');
        params.append('datos', data.get('politica') ? 'Sí' : 'No');
        params.append('fuente_lead', form.dataset.source || 'Landing Comparativa Caluce');
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
            params.append(k, qs.get(k) || '');
        });
        params.append('url_origen', window.location.href);

        return fetch(ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
    }

    document.querySelectorAll('[data-lead-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var original = btn.textContent;
            var err = form.querySelector('.form-error');
            if (err) err.remove();
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            sendLead(form).then(function () {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'lead_submit',
                    form_source: form.dataset.source,
                    sede: new FormData(form).get('sede') || ''
                });
                btn.textContent = '¡Enviado!';
                if (form.dataset.mode === 'inline') {
                    inlineThanks();
                } else {
                    setTimeout(function () { window.location.href = 'gracias.html'; }, 600);
                }
            }).catch(function () {
                btn.disabled = false;
                btn.textContent = original;
                var p = document.createElement('p');
                p.className = 'form-error';
                p.setAttribute('role', 'alert');
                p.textContent = 'No pudimos enviar tus datos. Revisa tu conexión e inténtalo de nuevo.';
                btn.insertAdjacentElement('afterend', p);
            });
        });
    });

    // ---------- Modales ----------
    var lastFocus = null;
    function openModal(id) {
        var m = document.getElementById(id);
        if (!m) return;
        lastFocus = document.activeElement;
        m.hidden = false;
        body.style.overflow = 'hidden';
        var first = m.querySelector('input, button:not(.modal-close), a');
        if (first) setTimeout(function () { first.focus(); }, 50);
    }
    function closeModal(m) {
        m.hidden = true;
        body.style.overflow = '';
        var iframe = m.querySelector('iframe');
        if (iframe) iframe.src = '';
        if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.modal').forEach(function (m) {
        m.addEventListener('click', function (e) {
            if (e.target === m || e.target.hasAttribute('data-close')) closeModal(m);
        });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
    });

    document.querySelectorAll('[data-open-form]').forEach(function (el) {
        el.addEventListener('click', function () {
            var sede = el.getAttribute('data-open-form');
            var modal = document.getElementById('form-modal');
            if (sede) {
                var radio = modal.querySelector('input[name="sede"][value="' + sede + '"]');
                if (radio) radio.checked = true;
            }
            openModal('form-modal');
        });
    });
    document.querySelectorAll('[data-open-wa]').forEach(function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); openModal('wa-modal'); });
    });
    document.querySelectorAll('[data-youtube]').forEach(function (el) {
        el.addEventListener('click', function () {
            var m = document.getElementById('video-modal');
            m.querySelector('iframe').src = 'https://www.youtube.com/embed/' + el.dataset.youtube + '?autoplay=1&rel=0';
            openModal('video-modal');
        });
    });

    // ---------- Selector de moneda ----------
    function fmt(value, cur) {
        if (cur === 'COP') return '$' + Math.round(value).toLocaleString('es-CO');
        var n = Math.round(value / RATES[cur] / 10) * 10;
        return (cur === 'USD' ? 'USD ' : '€ ') + n.toLocaleString('es-CO');
    }
    var note = document.querySelector('[data-fx-note]');
    document.querySelectorAll('[data-currency]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cur = btn.dataset.currency;
            document.querySelectorAll('[data-currency]').forEach(function (b) {
                b.classList.toggle('is-active', b === btn);
            });
            document.querySelectorAll('[data-cop]').forEach(function (el) {
                el.textContent = fmt(Number(el.dataset.cop), cur);
            });
            if (note) {
                note.textContent = cur === 'COP'
                    ? 'Precios mensuales de referencia en pesos colombianos.'
                    : 'Valores aproximados en ' + cur + ' con tasa de $' + RATES[cur].toLocaleString('es-CO') + ' por ' + cur + '. El valor se factura en pesos colombianos.';
            }
        });
    });

    // ---------- CTA flotante en móvil ----------
    var sticky = document.querySelector('.sticky-cta');
    if (sticky) {
        var onScroll = function () {
            sticky.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
})();

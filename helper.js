/**
 * helper.js – Reusable utilities for the portfolio.
 * - Touchable: hover hints (data-touchable-hint, or API for custom triggers)
 * - Modal: show/hide overlay elements
 * - Dialog: reusable dialogue window (name + text); use from room, outside, etc.
 * - getSceneScale: read scale from the scene transform (for coordinate math)
 */
(function () {
    'use strict';

    const Helpers = {};

    // -------------------------------------------------------------------------
    // Touchable: show a hint when the pointer is over an element.
    // Use class "touchable" + data-touchable-hint="Your hint text".
    // For custom triggers (e.g. grass), use TouchableHint.show(container, text) / .hide(container).
    // -------------------------------------------------------------------------
    (function () {
        function getHintEl(container) {
            return container && container.querySelector('.touchable-hint');
        }

        function show(container, text) {
            const hint = getHintEl(container);
            if (hint) {
                hint.textContent = text || '';
                hint.classList.add('show');
            }
        }

        function hide(container) {
            const hint = getHintEl(container);
            if (hint) hint.classList.remove('show');
        }

        function ensureHintElement(container) {
            let hint = getHintEl(container);
            if (!hint) {
                hint = document.createElement('div');
                hint.className = 'touchable-hint';
                hint.setAttribute('aria-live', 'polite');
                container.appendChild(hint);
            }
            return hint;
        }

        function initTouchables() {
            document.querySelectorAll('.touchable').forEach(function (el) {
                if (el.hasAttribute('data-touchable-messages')) return;
                const hintText = el.getAttribute('data-touchable-hint');
                if (!hintText) return;
                ensureHintElement(el);
                el.addEventListener('mouseenter', function () { show(el, hintText); });
                el.addEventListener('mouseleave', function () { hide(el); });
            });
        }

        Helpers.TouchableHint = { show: show, hide: hide, getHintEl: getHintEl };
        window.TouchableHint = Helpers.TouchableHint; // backward compatibility
        window.addEventListener('DOMContentLoaded', initTouchables);
    })();

    // -------------------------------------------------------------------------
    // Modal: show or hide an overlay element (e.g. modals, dialogs).
    // -------------------------------------------------------------------------
    Helpers.Modal = {
        show: function (el) {
            if (el) el.style.display = 'flex';
        },
        hide: function (el) {
            if (el) el.style.display = 'none';
        },
        toggle: function (el, show) {
            if (el) el.style.display = show ? 'flex' : 'none';
        }
    };

    // -------------------------------------------------------------------------
    // Dialog: reusable dialogue overlay. Show with name + text; click overlay to close.
    // -------------------------------------------------------------------------
    (function () {
        var overlayId = 'dialog-overlay';
        var nameId = 'dialog-name';
        var textId = 'dialog-text';

        function getOverlay() { return document.getElementById(overlayId); }
        function getNameEl() { return document.getElementById(nameId); }
        function getTextEl() { return document.getElementById(textId); }

        function show(name, text) {
            var el = getOverlay();
            var nameEl = getNameEl();
            var textEl = getTextEl();
            if (nameEl) nameEl.textContent = name || '';
            if (textEl) textEl.textContent = text || '';
            if (el) el.style.display = 'flex';
        }

        function hide() {
            var el = getOverlay();
            if (el) el.style.display = 'none';
        }

        function initDialog() {
            var el = getOverlay();
            if (el) el.addEventListener('click', function () { hide(); });
        }

        Helpers.Dialog = { show: show, hide: hide };
        window.addEventListener('DOMContentLoaded', initDialog);
    })();

    // -------------------------------------------------------------------------
    // getSceneScale: parse scale from the scene element's transform (for coordinate math).
    // -------------------------------------------------------------------------
    Helpers.getSceneScale = function (sceneElement) {
        if (!sceneElement || !sceneElement.style) return 1;
        const t = sceneElement.style.transform || '';
        const m = t.match(/scale\s*\(\s*([\d.]+)/);
        return m ? parseFloat(m[1]) : 1;
    };

    window.Helpers = Helpers;
})();

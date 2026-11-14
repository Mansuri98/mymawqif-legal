/* Shows one language at a time. The app opens #ar or #en; section links start
   with ar- or en-. Without scripts, both languages stay on the page. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  function fromHash() {
    var h = (location.hash || '').slice(1);
    if (/^en(-|$)/.test(h)) return 'en';
    if (/^ar(-|$)/.test(h)) return 'ar';
    return null;
  }
  function stored() {
    try { return localStorage.getItem('mymawqif-lang'); } catch (e) { return null; }
  }
  function browser() {
    var l = (navigator.languages && navigator.languages[0]) || navigator.language || 'ar';
    return /^ar/i.test(l) ? 'ar' : 'en';
  }
  function set(lang, remember) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
    if (remember) { try { localStorage.setItem('mymawqif-lang', lang); } catch (e) { /* private mode */ } }
  }

  // Runs in <head> so the page never flashes both languages; the switch
  // buttons get their state once the page has loaded.
  var linked = fromHash();
  set(linked || stored() || browser(), Boolean(linked));
  document.addEventListener('DOMContentLoaded', function () { set(root.lang, false); });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-set-lang]');
    if (!b) return;
    var lang = b.getAttribute('data-set-lang');
    set(lang, true);
    if (history.replaceState) history.replaceState(null, '', '#' + lang);
    window.scrollTo(0, 0);
  });
  window.addEventListener('hashchange', function () {
    var lang = fromHash();
    if (lang) set(lang, true);
  });
})();

(function () {
  'use strict';
  var root = document.documentElement;
  var BOOKING = 'https://www.doctolib.de/orthopadie/jena/birger-haeckel?utm_campaign=website-button';

  /* Kopfzeile bekommt beim Scrollen eine Fläche */
  var top = document.querySelector('.top');
  var sentinel = document.querySelector('.sentinel');
  if (top && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      top.classList.toggle('is-scrolled', !e[0].isIntersecting);
    }).observe(sentinel);
  }

  /* Aktionsleiste auf dem Handy erst, wenn die Terminwahl aus dem Bild ist */
  var bar = document.querySelector('.actionbar');
  var booker = document.querySelector('.booker');
  if (bar && booker && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      bar.classList.toggle('is-on', !e[0].isIntersecting && e[0].boundingClientRect.top < 0);
    }, { rootMargin: '-64px 0px 0px 0px' }).observe(booker);
  }

  /* Terminwahl: Hinweis passt sich der Auswahl an */
  var hint = document.getElementById('booker-hint');
  var select = document.getElementById('anliegen');
  var DEFAULT_HINT = hint ? hint.innerHTML : '';
  var TOPIC = {
    knie: ['Arthrose, Meniskus, Kreuzband, Knorpel.', 'knie.html', 'Mehr zum Knie'],
    schulter: ['Kalk, Sehnenriss, Schultersteife.', 'schulter.html', 'Mehr zur Schulter'],
    huefte: ['Arthrose, Arthroskopie, künstliches Gelenk.', 'huefte.html', 'Mehr zur Hüfte'],
    hand: ['Tennisarm, Karpaltunnel, Überbein.', 'weitere-gelenke.html', 'Mehr dazu'],
    fuss: ['Bandinstabilität, Achillessehne, Hallux valgus.', 'weitere-gelenke.html', 'Mehr dazu'],
    ruecken: ['Bei ausstrahlenden Schmerzen kommt die PRT infrage.', 'prt.html', 'Mehr zur PRT'],
    sport: ['Verletzungen, Überlastung, Leistungstests.', 'sportmedizin.html', 'Mehr zur Sportmedizin'],
    anderes: ['Schreiben Sie uns oder rufen Sie an.', 'kontakt.html', 'Zum Kontakt']
  };
  function updateHint() {
    if (!hint) return;
    var t = select && TOPIC[select.value];
    hint.innerHTML = t ? t[0] + ' <a href="' + t[1] + '">' + t[2] + '</a>' : DEFAULT_HINT;
  }
  if (select) select.addEventListener('change', updateHint);
  if (booker) {
    booker.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var w = window.open(BOOKING, '_blank', 'noopener');
      if (!w) window.location.href = BOOKING;
    });
  }

  /* Bewegung */
  function ready() { root.classList.add('is-ready'); }
  var motion = root.classList.contains('motion');
  window.addEventListener('load', function () {
    if (!motion || !window.gsap || root.classList.contains('no-intro')) { ready(); setProgress(); return; }
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    var ease = 'expo.out';

    var tl = gsap.timeline({ defaults: { ease: ease } });
    tl.fromTo('.hero__title .line > span', { yPercent: 108 }, { yPercent: 0, duration: 1.25, stagger: .12, clearProps: 'transform' }, 0)
      .fromTo('.hero__lead', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, clearProps: 'all' }, .35)
      .fromTo('.booker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, clearProps: 'all' }, .5)
      .fromTo('.frame__media', { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.5, stagger: .1, ease: 'expo.inOut', clearProps: 'clipPath' }, .55)
      .fromTo('.frame__media img', { scale: 1.18 }, { scale: 1, duration: 1.9, stagger: .1 }, .55)
      .fromTo('.frame figcaption', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .8, stagger: .1, clearProps: 'all' }, 1.4);
    ready();

    if (!window.ScrollTrigger) { setProgress(); return; }

    /* Bilder gleiten leicht gegen die Scrollrichtung */
    gsap.utils.toArray('.frame').forEach(function (f, i) {
      gsap.to(f, { yPercent: [-6, -12, -4][i] || -6, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top 70%', end: 'bottom top', scrub: .6 } });
    });

    /* Der Weg füllt sich beim Scrollen */
    var steps = document.querySelector('.steps');
    var items = gsap.utils.toArray('.step');
    if (steps) {
      steps.style.setProperty('--progress', 0);
      window.ScrollTrigger.create({
        trigger: steps, start: 'top 78%', end: 'bottom 55%', scrub: .5,
        onUpdate: function (st) {
          steps.style.setProperty('--progress', st.progress.toFixed(3));
          items.forEach(function (it, i) { it.classList.toggle('is-on', st.progress >= i / items.length + .02); });
        }
      });
      gsap.from(items, { opacity: 0, y: 24, duration: 1, stagger: .12, ease: ease, scrollTrigger: { trigger: steps, start: 'top 80%' } });
      gsap.from('.weg__intro > *', { opacity: 0, y: 30, duration: 1.1, stagger: .1, ease: ease, scrollTrigger: { trigger: '.weg', start: 'top 70%' } });
    }

    /* Gelenk-Liste baut sich Zeile für Zeile auf */
    gsap.from('.index li', { opacity: 0, y: 26, duration: 1, stagger: .09, ease: ease, scrollTrigger: { trigger: '.index', start: 'top 82%' } });
  });

  function setProgress() {
    var steps = document.querySelector('.steps');
    if (steps) { steps.style.setProperty('--progress', 1); document.querySelectorAll('.step').forEach(function (s) { s.classList.add('is-on'); }); }
  }
})();

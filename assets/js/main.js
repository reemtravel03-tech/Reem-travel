/* Reem Travel — interactions, i18n (AR/EN) and contact form */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  /* ---------------- i18n ----------------
     Arabic lives in the HTML (default + SEO). English is below.
     Arabic strings are cached from the DOM before the first switch. */
  const EN = {
    'nav.home': 'Home', 'nav.about': 'Why Us', 'nav.services': 'Services', 'nav.destinations': 'Destinations',
    'nav.contact': 'Contact', 'nav.contactUs': 'Contact Us', 'nav.tagline': 'Travel & Tourism',
    'nav.aboutPage': 'About us', 'nav.faq': 'FAQ', 'nav.videos': 'Videos',

    // Videos page
    'vid.badge': 'Reem Travel films', 'vid.title': 'Explore the world', 'vid.titleAccent': 'before you travel',
    'vid.lead': 'Real footage from places we love, so you can choose your next trip after seeing it with your own eyes.',
    'vid.watch': 'Watch the film', 'vid.all': 'All videos', 'vid.now': 'Now playing',
    'vid.featBadge': 'Featured film', 'vid.featTitle': 'Fly over jungles and temples',
    'vid.reelsBadge': 'The library', 'vid.reelsTitle': 'Moments from our trips',
    'vid.reelsLead': 'Hover to preview, click to watch in full screen.',
    'vid.v1': 'Tropical escape', 'vid.v1place': 'Bali, Indonesia',
    'vid.v2': 'Lakes & mountains', 'vid.v2place': 'Breathtaking nature',
    'vid.v3': 'Galata Tower', 'vid.v3place': 'Istanbul, Turkey',
    'vid.ctaTitle': 'Love the view? Let us take you there',
    'vid.ctaLead': 'Tell us your destination and we will arrange your tickets, visa and stay.',

    // About page
    'ab.crumbHome': 'Home', 'ab.crumb': 'About us',
    'ab.heroTitle': 'Every journey starts', 'ab.heroAccent': 'with us',
    'ab.heroLead': 'Get to know Reem Travel: who we are, how we work, and answers to the questions our clients ask most.',
    'ab.storyBadge': 'Our story',
    'ab.storyTitle': 'A travel office from the heart of Tripoli, opening the world to you',
    'ab.story1': 'Reem Travel serves families, students and business travellers from its office in Jabal Al-Badawi, Tripoli, with one goal: to make travel easier and closer for everyone in our community.',
    'ab.story2': 'We stay with you from the first question until you are safely back: flight tickets, visa files, Umrah and holiday programs, insurance, university admissions, official invitations and OMT services, all under one roof.',
    'ab.chip': 'Happy clients',
    'ab.missionT': 'Our mission',
    'ab.missionD': 'To make your journeys easier and clear the obstacles in your way, saving you time and effort with expertise you can trust.',
    'ab.visionT': 'Our vision',
    'ab.visionD': 'To be your trusted local bridge to the world, with fast service, fair prices and follow-up that never stops.',
    'ab.valuesBadge': 'Our values', 'ab.valuesTitle': 'Travel smart, safe and comfortable',
    'ab.v1t': 'Safe', 'ab.v1d': 'We work with trusted airlines and partners so you can travel with peace of mind.',
    'ab.v2t': 'Smart', 'ab.v2d': 'We compare options to find you the best route, timing and price.',
    'ab.v3t': 'Comfortable', 'ab.v3d': 'We take care of the details and paperwork, so you can focus on your trip.',
    'ab.v4t': 'Always there', 'ab.v4d': 'Our team follows your trip step by step and answers you 24/7.',
    'ab.stepsBadge': 'How we work', 'ab.stepsTitle': 'From your first message to your safe return',
    'ab.s1t': 'Contact us', 'ab.s1d': 'On WhatsApp, by phone, through the website form, or by visiting our office in Jabal Al-Badawi.',
    'ab.s2t': 'We understand your needs', 'ab.s2d': 'We listen to the details of your trip and suggest the best options and prices.',
    'ab.s3t': 'We prepare everything', 'ab.s3d': 'Bookings, visa files and the required documents, prepared professionally.',
    'ab.s4t': 'Travel with confidence', 'ab.s4d': 'We follow up with you step by step until you are back home, 24/7.',
    'ab.faqBadge': 'FAQ', 'ab.faqTitle': 'Frequently asked questions',
    'ab.faqLead': 'Quick answers to what our clients ask most. Can\'t find yours? Message us directly.',
    'ab.faqSearch': 'Search the questions...', 'ab.faqEmpty': 'No matching question. Send us your question on WhatsApp and we will answer right away.',
    'ab.helpT': 'Still have a question?', 'ab.helpD': 'Our team answers quickly on WhatsApp or by phone.',
    'faq.q1': 'What services does Reem Travel offer?',
    'faq.a1': 'Flight bookings, visa services, Umrah and holiday trips, travel insurance, university admissions abroad, official invitations, and OMT money transfer services.',
    'faq.q2': 'Who do you help obtain visas?',
    'faq.a2': 'We have special experience with visa applications for Palestinians, Syrians and Lebanese to many destinations.',
    'faq.q3': 'Which visas can you prepare?',
    'faq.a3': 'We prepare files for Schengen visas, Gulf visas and other destinations. Contact us with your destination and we will guide you.',
    'faq.q4': 'Which documents do I need for a visa?',
    'faq.a4': 'It depends on the country and the type of visa. Send us your destination and travel purpose, and we will give you the exact list of documents.',
    'faq.q5': 'How do I book a flight or a trip with you?',
    'faq.a5': 'Message us on WhatsApp, call us, fill in the contact form on the website, or visit our office. We will suggest the best options and handle the booking.',
    'faq.q6': 'How much do your services cost?',
    'faq.a6': 'Prices depend on the destination, dates and service. We always look for the best offers. Contact us and we will send you a clear quote.',
    'faq.q7': 'Do you organize Umrah trips?',
    'faq.a7': 'Yes. We organize complete Umrah programs and holiday trips, and we follow up with you throughout the journey.',
    'faq.q8': 'Can you help me get a university admission abroad?',
    'faq.a8': 'Yes. We guide students toward educational opportunities abroad and assist them with university admission and visa application procedures.',
    'faq.q9': 'Do you offer travel insurance?',
    'faq.a9': 'Yes. We offer travel insurance and other insurance types, with comprehensive coverage for your peace of mind.',
    'faq.q10': 'Can I send or receive money at your office?',
    'faq.a10': 'Yes. We provide fast and reliable money transfer and withdrawal services through the OMT network.',
    'faq.q11': 'Are you available outside office hours?',
    'faq.a11': 'Our team follows up with clients 24/7. You can message us on WhatsApp any time and we will reply as soon as possible.',
    'faq.q12': 'Where is your office?',
    'faq.a12': 'Tripoli, Jabal Al-Badawi, Main Road, Al-Ahbash Street Junction, Near Dana Cooperative.',

    'hero.badge': 'Reem Travel & Tourism Office',
    'hero.title': 'Your local bridge', 'hero.titleHighlight': 'to the world',
    'hero.description': 'Travel smart, safe, and comfortable. Plan your next trip with us and enjoy an unforgettable experience.',
    'hero.discoverServices': 'Discover our services', 'hero.bookNow': 'Book now',
    'hero.locationValue': 'Tripoli, Jabal Al-Badawi', 'hero.serviceValue': '24/7 follow-up',

    'quick.title': 'Talk to a travel expert', 'quick.sub': 'Fast replies, 24/7',
    'quick.label': 'How can we help you?',
    'quick.flights': 'Book a flight', 'quick.visa': 'Ask about a visa', 'quick.umrah': 'Umrah & holiday trips',
    'quick.wa': 'WhatsApp', 'quick.call': 'Call now',

    'stats.clients': 'Happy clients', 'stats.years': 'Years of experience',
    'stats.destinations': 'Destinations', 'stats.support': 'Ongoing support',

    'whyUs.badge': 'Why us',
    'whyUs.title': 'More than just a travel agency',
    'whyUs.description': 'We are your partners in every journey. We understand your needs because we are part of you. Plan your next trip with us and enjoy an unforgettable experience.',
    'whyUs.f1.title': '24/7 follow-up',
    'whyUs.f1.desc': 'Reach us anytime. Our team is always available to answer your questions and follow your trip step by step.',
    'whyUs.f2.title': 'Affordable prices',
    'whyUs.f2.desc': 'Guaranteed travel at a fair price. We always look for the best offers and the most economical options.',
    'whyUs.f3.title': 'Visa expertise',
    'whyUs.f3.desc': 'Special experience with visa applications for Palestinians, Syrians and Lebanese to many destinations.',

    'services.badge': 'Complete package', 'services.title': 'Discover our services',
    'services.description': 'A wide range of services covering all your travel and official paperwork needs, under one roof.',
    'svc.ask': 'Ask now',
    's.flights.t': 'Flight bookings', 's.flights.d': 'The best local and international fares on all trusted airlines.',
    's.visas.t': 'Visa services', 's.visas.d': 'Professional preparation of your embassy files (Schengen, Gulf and more).',
    's.trips.t': 'Trips & Umrah', 's.trips.d': 'Complete holiday programs and organized tours, plus easy, well-planned Umrah trips.',
    's.insurance.t': 'Insurance', 's.insurance.d': 'Travel, property and more. Full coverage for peace of mind wherever you go.',
    's.university.t': 'University admissions', 's.university.d': 'We guide students to study opportunities abroad and help them secure admission.',
    's.invitations.t': 'Official invitations', 's.invitations.d': 'Official invitations for family or business visits to ease your travel procedures.',
    's.omt.t': 'OMT services', 's.omt.d': 'Fast, reliable money transfers and withdrawals through the OMT network.',

    'dest.badge': 'Featured destinations', 'dest.title': 'Where will your next trip take you?', 'dest.ask': 'Ask about this trip',
    'dest.istanbul': 'Istanbul', 'dest.dubai': 'Dubai', 'dest.santorini': 'Santorini', 'dest.paris': 'Paris', 
    'dest.makkah': 'Umrah & Madinah', 'dest.cappadocia': 'Cappadocia', 'dest.maldives': 'Maldives', 'dest.rome': 'Rome',
    'dest.tag.umrah': 'Umrah', 'dest.tag.turkey': 'Turkey', 'dest.tag.uae': 'UAE', 'dest.tag.france': 'France',
    'dest.tag.maldives': 'Maldives', 'dest.tag.italy': 'Italy', 'dest.tag.greece': 'Greece',
    

    'quote.text': 'Making your journeys easier and clearing the obstacles in your way is the heart of our mission. Our long experience in travel and visas, especially for our community, is our guarantee to save you time and effort. Your trust is an honour we cherish.',
    'quote.author': 'General Manager, Reem Travel', 'quote.role': 'Mohammad Dawoud',

    'contact.badge': 'We are here for you', 'contact.title': 'Get in touch',
    'contact.contactInfo': 'Contact information', 'contact.address': 'Address',
    'contact.addressValue': 'Tripoli, Jabal Al-Badawi<br>Main Road, Al-Ahbash Street Junction, Near Dana Cooperative.',
    'contact.phone': 'Phone', 'contact.email': 'Email',
    'contact.qrTitle': 'Scan & contact us', 'contact.qrDesc': 'Scan the code to reach us directly on WhatsApp.',
    'contact.sendMessage': 'Send us a message', 'contact.formHint': 'Fill in the form and our team will get back to you shortly.',

    'form.name': 'Full name', 'form.namePh': 'Your name', 'form.nameRequired': 'Name is required',
    'form.phone': 'Phone number', 'form.email': 'Email', 'form.emailInvalid': 'Please enter a valid email',
    'form.service': 'Service needed', 'form.serviceAny': 'Choose a service (optional)',
    'form.message': 'Message', 'form.messagePh': 'How can we help you?', 'form.messageRequired': 'Message is required',
    'form.send': 'Send message',

    'footer.ctaTitle': 'Your next journey starts with a message', 'footer.ctaBtn': 'Chat with us on WhatsApp',
    'footer.tagline': 'Travel smart, safe, and comfortable', 'footer.links': 'Quick links', 'footer.reach': 'Contact',
    'footer.home': 'Home', 'footer.about': 'About', 'footer.services': 'Services', 'footer.contact': 'Contact us',
    'footer.copyright': 'All rights reserved',
  };

  const MSG = {
    ar: {
      sending: 'جاري الإرسال...',
      ok: 'شكراً لتواصلك معنا! تم استلام رسالتك وسنرد عليك قريباً.',
      fail: 'تعذّر إرسال الرسالة. يرجى المحاولة مجدداً أو التواصل معنا عبر <a href="https://wa.me/96181821751" target="_blank" rel="noopener">واتساب</a>.',
      rate: 'يرجى الانتظار قليلاً قبل إرسال رسالة أخرى.',
      invalid: 'يرجى التحقق من الحقول المطلوبة.',
      trip: d => `مرحباً، أرغب بالاستفسار عن رحلة إلى ${d}.`,
      service: s => `مرحباً، أرغب بالاستفسار عن ${s}.`,
    },
    en: {
      sending: 'Sending...',
      ok: 'Thank you! Your message has been received and we will get back to you soon.',
      fail: 'We could not send your message. Please try again or reach us on <a href="https://wa.me/96181821751" target="_blank" rel="noopener">WhatsApp</a>.',
      rate: 'Please wait a moment before sending another message.',
      invalid: 'Please check the required fields.',
      trip: d => `Hello, I would like to ask about a trip to ${d}.`,
      service: s => `Hello, I would like to ask about ${s.toLowerCase()}.`,
    },
  };

  const html = document.documentElement;
  const TITLE_AR = document.title;
  const AR = {}, AR_PH = {};
  let lang = 'ar';
  const t = key => (lang === 'ar' ? AR : EN)[key] ?? '';

  function cacheArabic() {
    $$('[data-i18n]').forEach(el => { AR[el.dataset.i18n] ??= el.innerHTML; });
    $$('[data-i18n-ph]').forEach(el => { AR_PH[el.dataset.i18nPh] ??= el.placeholder; });
  }

  function applyLang(next) {
    lang = next;
    html.lang = next;
    html.dir = next === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => {
      const v = (next === 'ar' ? AR : EN)[el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    $$('[data-i18n-ph]').forEach(el => {
      const v = (next === 'ar' ? AR_PH : EN)[el.dataset.i18nPh];
      if (v != null) el.placeholder = v;
    });
    document.title = next === 'ar' ? TITLE_AR : (html.dataset.titleEn || TITLE_AR);
    $('#langLabel').textContent = next === 'ar' ? 'English' : 'العربية';
    if ($('#formLang')) $('#formLang').value = next;
    splitQuote();
    if (faqSearch) filterFaq();
    store.set('reem-lang', next);
  }

  function setLang(next) {
    if (reduceMotion) return applyLang(next);
    const parts = [$('main'), $('.footer'), $('.nav__inner')];
    const fadeOut = parts.map(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
    fadeOut[0].onfinish = () => {
      applyLang(next);
      fadeOut.forEach(a => a.cancel());
      parts.forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' }));
      onScroll();
    };
  }

  /* ---------------- Quote: words light up while scrolling ---------------- */
  let quoteWords = [];
  function splitQuote() {
    const p = $('#quoteText');
    if (!p) return;
    p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    quoteWords = $$('.w', p);
    if (reduceMotion) quoteWords.forEach(w => w.classList.add('on'));
  }

  /* ---------------- Hero slideshow ---------------- */
  const slides = $$('.hero__slides img');
  const dots = $$('.hero__dots button');
  let slide = 0, slideTimer;
  function showSlide(i) {
    if (slides.length < 2 || !dots.length) return;
    slide =(i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === slide));
    dots.forEach((d, n) => {
      d.classList.toggle('is-active', n === slide);
      d.setAttribute('aria-selected', String(n === slide));
    });
    // restart the progress bar animation
    const bar = $('i', dots[slide]);
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    clearTimeout(slideTimer);
    if (!reduceMotion) slideTimer = setTimeout(() => showSlide(slide + 1), 6000);
  }
  dots.forEach((d, n) => d.addEventListener('click', () => showSlide(n)));

  /* ---------------- Scroll-driven effects ---------------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const parallax = $$('.parallax');
  const quote = $('#quote');
  const steps = $('.steps');
  const expand = $('.expand');
  const kinetic = $('.kinetic');
  const mmenu = $('#mmenu');
  let lastY = 0, ticking = false;

  function onScroll() {
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle('is-solid', y > vh * 0.75);
    nav.classList.toggle('is-hidden', y > lastY + 2 && y > vh && !mmenu.classList.contains('is-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;

    if (!reduceMotion) {
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * -(+el.dataset.speed || .06) - 20}px, 0)`;
      });
      if (quoteWords.length && quote) {
        const r = quote.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height * 0.7)));
        const n = Math.round(p * quoteWords.length);
        quoteWords.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    }

    // "How we work" line fills as the section scrolls past
    if (steps) {
      const r = steps.getBoundingClientRect();
      const p = reduceMotion ? 1 : Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      steps.style.setProperty('--progress', p.toFixed(3));
      $$('.step', steps).forEach((s, i, all) => s.classList.toggle('is-on', p >= i / all.length + 0.02));
    }

    // Videos page: feature video grows to full screen while its section scrolls
    if (expand) {
      const r = expand.getBoundingClientRect();
      const p = reduceMotion ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      expand.style.setProperty('--p', p.toFixed(3));
    }
    // Videos page: big destination words slide sideways with the scroll
    if (kinetic && !reduceMotion) {
      const r = kinetic.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const x = (r.top - vh / 2) * 0.45;
        $$('.kinetic__row', kinetic).forEach(row => {
          row.style.transform = `translate3d(calc(-25% + ${x * (+row.dataset.speed)}px), 0, 0)`;
        });
      }
    }

    // highlight the nav link of the section in view (homepage only)
    if (document.getElementById('services')) {
      const ids = ['contact', 'destinations', 'services', 'about'];
      const current = ids.find(id => document.getElementById(id)?.getBoundingClientRect().top < vh * 0.4) || 'top';
      $$('.nav__links a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------------- Reveal on view + counters ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const siblings = $$(':scope > .reveal-up', el.parentElement);
      el.style.setProperty('--d', `${Math.max(0, Math.min(siblings.indexOf(el), 5)) * 0.08}s`);
      el.classList.add('in');
      $$('.count', el).forEach(countUp);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal-up').forEach(el => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const start = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- Destinations carousel ---------------- */
  const track = $('#destTrack');
  if (track) {
  const stepSize = () => ($('.dcard', track).offsetWidth + 20) * (html.dir === 'rtl' ? -1 : 1);
  $('#destNext').addEventListener('click', () => track.scrollBy({ left: stepSize() }));
  $('#destPrev').addEventListener('click', () => track.scrollBy({ left: -stepSize() }));

  // drag to scroll with the mouse (touch already scrolls natively)
  let drag = null;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) { drag.moved = true; track.classList.add('is-dragging'); }
    track.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    track.classList.remove('is-dragging');
    if (moved) track.addEventListener('click', ev => ev.preventDefault(), { capture: true, once: true });
  });
  }

  /* ---------------- FAQ: accordion + live search ---------------- */
  const faqItems = $$('.faq__item');
  const faqSearch = $('#faqSearch');
  faqItems.forEach(item => {
    const btn = $('.faq__q', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        $('.faq__q', other).setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  function filterFaq() {
    const q = faqSearch.value.trim().toLowerCase();
    let shown = 0;
    faqItems.forEach(item => {
      const match = !q || item.textContent.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) shown++;
    });
    $('#faqEmpty').hidden = shown > 0;
  }
  faqSearch?.addEventListener('input', filterFaq);

  /* ---------------- Pre-fill the contact form ---------------- */
  const form = $('#contactForm');
  if (form) {
  const msgField = $('#f-message');
  const serviceSelect = $('#f-service');
  function prefill({ serviceKey, text }) {
    if (serviceKey) {
      const opt = $$('option', serviceSelect).find(o => o.dataset.i18n === serviceKey);
      if (opt) serviceSelect.value = opt.value;
    }
    if (text && !msgField.value.trim()) msgField.value = text;
    document.getElementById('contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), 700);
  }

  $$('.svc__link, .quick__row').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    prefill({ serviceKey: a.dataset.service, text: MSG[lang].service(t(a.dataset.service)) });
  }));
  $$('.dcard').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    prefill({ serviceKey: 's.trips.t', text: MSG[lang].trip(t(a.dataset.dest)) });
  }));

  /* ---------------- Contact form → contact.php ---------------- */
  const statusEl = $('#formStatus');
  const submitBtn = $('#submitBtn');
  $('#formTs').value = Date.now();

  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  function validate() {
    let ok = true;
    [
      ['f-name', v => v.trim().length > 0],
      ['f-email', v => emailOk(v.trim())],
      ['f-message', v => v.trim().length > 0],
    ].forEach(([id, fn]) => {
      const input = document.getElementById(id);
      const good = fn(input.value);
      input.closest('.field').classList.toggle('has-error', !good);
      if (!good && ok) { input.focus(); ok = false; }
    });
    return ok;
  }
  $$('input, textarea', form).forEach(i => i.addEventListener('input', () => i.closest('.field')?.classList.remove('has-error')));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.className = 'form-status';
    statusEl.textContent = '';
    if (!validate()) { statusEl.classList.add('err'); statusEl.textContent = MSG[lang].invalid; return; }

    const label = $('.btn__label', submitBtn);
    submitBtn.classList.add('is-loading');
    label.textContent = MSG[lang].sending;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'fetch' },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        statusEl.classList.add('ok');
        statusEl.textContent = MSG[lang].ok;
        form.reset();
        $('#formTs').value = Date.now();
        $('#formLang').value = lang;
      } else {
        statusEl.classList.add('err');
        statusEl.innerHTML = res.status === 429 ? MSG[lang].rate : res.status === 422 ? MSG[lang].invalid : MSG[lang].fail;
      }
    } catch {
      statusEl.classList.add('err');
      statusEl.innerHTML = MSG[lang].fail;
    } finally {
      submitBtn.classList.remove('is-loading');
      label.textContent = t('form.send');
    }
  });

  // Result of a no-JS form post (contact.php redirects to ?sent=1|0)
  const sent = new URLSearchParams(location.search).get('sent');
  if (sent !== null) {
    statusEl.classList.add(sent === '1' ? 'ok' : 'err');
    statusEl.innerHTML = MSG[lang][sent === '1' ? 'ok' : 'fail'];
    history.replaceState(null, '', location.pathname + location.hash);
  }
  }

  /* ---------------- Videos page ---------------- */
  const vcards = $$('.vcard');
  const canHover = matchMedia('(hover: hover)').matches;
  const safePlay = v => { const p = v.play(); if (p) p.catch(() => {}); };

  // background / feature videos only play while visible (saves battery and CPU)
  const vio = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduceMotion) safePlay(v); else v.pause();
  }), { threshold: 0.25 });
  $$('video[data-inview], .vhero__bg').forEach(v => vio.observe(v));

  vcards.forEach(card => {
    const v = $('video', card);
    v.addEventListener('playing', () => card.classList.add('is-playing'));
    v.addEventListener('pause', () => card.classList.remove('is-playing'));
    v.addEventListener('timeupdate', () => {
      if (v.duration) card.style.setProperty('--t', (v.currentTime / v.duration).toFixed(3));
    });
    if (canHover) {
      card.addEventListener('pointerenter', () => safePlay(v));
      card.addEventListener('pointerleave', () => v.pause());
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    } else {
      vio.observe(v); // touch screens: preview plays when the card scrolls into view
    }
  });

  // full-screen player
  const lb = $('#lightbox');
  if (lb) {
    const lbVideo = $('#lbVideo');
    const items = vcards.map(card => ({
      src: $('video', card).getAttribute('src'),
      poster: $('video', card).getAttribute('poster'),
      title: $('h3', card).dataset.i18n,
      place: $('.tag [data-i18n]', card).dataset.i18n,
    }));
    let current = 0, lastFocus = null;
    const show = i => {
      current = (i + items.length) % items.length;
      const it = items[current];
      lbVideo.src = it.src;
      lbVideo.poster = it.poster;
      $('#lbTitle').textContent = t(it.title);
      $('#lbPlace').textContent = t(it.place);
      $('#lbCount').textContent = `${current + 1} / ${items.length}`;
      safePlay(lbVideo);
    };
    const open = i => {
      lastFocus = document.activeElement;
      $$('video').forEach(v => v !== lbVideo && v.pause());
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      show(i);
      $('.lightbox__close', lb).focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      lbVideo.pause();
      lbVideo.removeAttribute('src');
      lbVideo.load();
      $$('video[data-inview], .vhero__bg').forEach(v => { vio.unobserve(v); vio.observe(v); });
      lastFocus?.focus();
    };
    $$('[data-open]').forEach(el => {
      el.addEventListener('click', () => open(+el.dataset.open));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+el.dataset.open); } });
    });
    $$('[data-step]', lb).forEach(b => b.addEventListener('click', () => show(current + +b.dataset.step)));
    $('[data-close]', lb).addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      const rtl = html.dir === 'rtl';
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(current + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(current + (rtl ? 1 : -1));
    });
  }

  /* ---------------- Mobile menu ---------------- */
  const burger = $('#burger');
  const toggleMenu = open => {
    mmenu.classList.toggle('is-open', open);
    mmenu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => toggleMenu(true));
  $('#mmenuClose').addEventListener('click', () => toggleMenu(false));
  $$('a', mmenu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  /* ---------------- Init ---------------- */
  $('#year').textContent = new Date().getFullYear();
  cacheArabic();
  if (store.get('reem-lang') === 'en') applyLang('en'); else splitQuote();
  $('#langBtn').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));

  let started = false;
  const ready = () => {
    if (started) return;
    started = true;
    document.body.classList.add('is-loaded');
    showSlide(0);
    onScroll();
  };
  if (document.readyState === 'complete') setTimeout(ready, 200);
  else addEventListener('load', () => setTimeout(ready, 200));
  setTimeout(ready, 2500); // never wait too long on slow images
})();

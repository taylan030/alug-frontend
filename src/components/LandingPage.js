import React, { useState, useEffect } from 'react';

// ─── Translations ────────────────────────────────────────────────────────────
const COPY = {
  de: {
    badge: 'Affiliate Marketplace',
    h1Line1: 'Dein Link.',
    h1Line2: 'Dein Geld.',
    sub: 'Generiere Affiliate-Links für geprüfte Produkte, teile sie — und verdiene automatisch bei jedem Kauf. Kein Risiko. Null Kosten.',
    cta1: 'Kostenlos registrieren',
    cta2: 'Bereits registriert? Einloggen',
    f1: 'Einstiegskosten',
    f2: 'Attribution',
    f3: 'Transparent',
    howLabel: 'So funktioniert\'s',
    s1h: 'Registrieren', s1t: 'Account in 30 Sekunden erstellen — kostenlos, kein Risiko.',
    s2h: 'Generieren',   s2t: 'Produkt auswählen, deinen persönlichen Affiliate-Link erstellen.',
    s3h: 'Kassieren',    s3t: 'Jeder Kauf über deinen Link bringt dir automatisch deine Provision.',
    ctah1: 'Bereit?', ctah2: 'Starte heute.',
    ctaSub: 'Schließ dich Affiliates an, die bereits verdienen.',
    ctaBtn: 'Kostenlosen Account erstellen →',
    ctaNote: 'Keine Kreditkarte nötig',
    loginLink: 'Einloggen',
    navBtn: 'Jetzt starten',
    tick: ['Registrieren', 'Link generieren', 'Kassieren', 'Wiederholen', 'Provision tracken', 'Auszahlung anfordern'],
  },
  en: {
    badge: 'Affiliate Marketplace',
    h1Line1: 'One link.',
    h1Line2: 'Real income.',
    sub: 'Pick a product, share your link, and earn a commission on every sale — automatically, with zero upfront cost.',
    cta1: 'Start for free',
    cta2: 'Already have an account? Log in',
    f1: 'To get started',
    f2: 'Attribution window',
    f3: 'Transparent',
    howLabel: 'How it works',
    s1h: 'Join',   s1t: 'Create your free account in seconds — no credit card, no commitment.',
    s2h: 'Share',  s2t: 'Choose a product and get your personal affiliate link instantly.',
    s3h: 'Earn',   s3t: 'Every sale through your link earns you a commission. Automatically.',
    ctah1: 'Ready?', ctah2: 'Start today.',
    ctaSub: 'Join affiliates already making money with alug.',
    ctaBtn: 'Create free account →',
    ctaNote: 'No credit card required',
    loginLink: 'Log in',
    navBtn: 'Get started',
    tick: ['Join free', 'Get your link', 'Share it', 'Earn on every sale', 'Track in real time', 'Request payout'],
  },
  es: {
    badge: 'Marketplace de Afiliados',
    h1Line1: 'Tu enlace.',
    h1Line2: 'Tus ingresos.',
    sub: 'Genera links de afiliado para productos verificados, compártelos — y gana comisión automática en cada venta.',
    cta1: 'Registrarse gratis',
    cta2: '¿Ya tienes cuenta? Inicia sesión',
    f1: 'Sin coste inicial',
    f2: 'Ventana de atribución',
    f3: 'Transparente',
    howLabel: 'Cómo funciona',
    s1h: 'Regístrate', s1t: 'Crea tu cuenta gratis en segundos. Sin tarjeta, sin riesgos.',
    s2h: 'Genera',    s2t: 'Elige un producto y obtén tu enlace de afiliado al instante.',
    s3h: 'Cobra',     s3t: 'Cada venta a través de tu enlace te genera comisión automáticamente.',
    ctah1: '¿Listo?', ctah2: 'Empieza hoy.',
    ctaSub: 'Únete a los afiliados que ya generan ingresos con alug.',
    ctaBtn: 'Crear cuenta gratis →',
    ctaNote: 'Sin tarjeta de crédito',
    loginLink: 'Iniciar sesión',
    navBtn: 'Empezar',
    tick: ['Regístrate', 'Genera tu enlace', 'Comparte', 'Gana por cada venta', 'Sigue tus stats', 'Solicita tu pago'],
  },
  fr: {
    badge: "Marketplace d'Affiliation",
    h1Line1: 'Ton lien.',
    h1Line2: 'Tes revenus.',
    sub: "Génère des liens d'affiliation pour des produits vérifiés, partage-les — et touche tes commissions automatiquement.",
    cta1: 'S\'inscrire gratuitement',
    cta2: 'Déjà inscrit ? Se connecter',
    f1: "Sans frais d'entrée",
    f2: "Fenêtre d'attribution",
    f3: 'Transparent',
    howLabel: 'Comment ça marche',
    s1h: 'Rejoins',  s1t: "Crée ton compte gratuit en quelques secondes — sans engagement.",
    s2h: 'Génère',   s2t: "Choisis un produit et obtiens ton lien d'affiliation personnalisé.",
    s3h: 'Encaisse', s3t: "Chaque vente via ton lien te rapporte une commission automatiquement.",
    ctah1: 'Prêt ?', ctah2: 'Lance-toi maintenant.',
    ctaSub: 'Rejoins les affiliés qui génèrent déjà des revenus sur alug.',
    ctaBtn: 'Créer un compte gratuit →',
    ctaNote: 'Aucune carte bancaire requise',
    loginLink: 'Se connecter',
    navBtn: 'Commencer',
    tick: ['Rejoins alug', 'Génère ton lien', 'Partage', 'Touche tes commissions', 'Suis tes stats', 'Demande ton virement'],
  },
  tr: {
    badge: 'Affiliate Pazaryeri',
    h1Line1: 'Linkin.',
    h1Line2: 'Paran.',
    sub: 'Onaylı ürünler için affiliate linkleri oluştur, paylaş — ve her satıştan otomatik komisyon kazan.',
    cta1: 'Ücretsiz kayıt ol',
    cta2: 'Zaten hesabın var mı? Giriş yap',
    f1: 'Başlangıç ücreti yok',
    f2: 'Atıf süresi',
    f3: 'Şeffaf',
    howLabel: 'Nasıl çalışır',
    s1h: 'Kaydol',   s1t: 'Saniyeler içinde ücretsiz hesap oluştur — kredi kartı gerekmez.',
    s2h: 'Oluştur',  s2t: 'Bir ürün seç, kişisel affiliate linkini anında al.',
    s3h: 'Kazan',    s3t: 'Linkin üzerinden yapılan her satış otomatik olarak komisyon getirir.',
    ctah1: 'Hazır mısın?', ctah2: 'Bugün başla.',
    ctaSub: "Alug'da zaten kazanan affiliate'lere katıl.",
    ctaBtn: 'Ücretsiz hesap oluştur →',
    ctaNote: 'Kredi kartı gerekmez',
    loginLink: 'Giriş yap',
    navBtn: 'Başla',
    tick: ['Kaydol', 'Link oluştur', 'Paylaş', 'Her satıştan kazan', 'Gerçek zamanlı takip', 'Ödeme talep et'],
  },
};

const LANGS = ['de', 'en', 'es', 'fr', 'tr'];

function detectLang() {
  const browser = (navigator.language || 'en').toLowerCase().slice(0, 2);
  return LANGS.includes(browser) ? browser : 'en';
}

// ─── Styles (injected once) ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

.lp-root {
  background: #04040a;
  font-family: 'DM Sans', sans-serif;
  color: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Lang bar */
.lp-langs { display:flex; gap:6px; padding:10px 36px; background:rgba(255,255,255,.02); border-bottom:1px solid rgba(255,255,255,.05); }
.lp-lb {
  background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.35);
  padding:4px 14px; border-radius:20px; font-size:12px; cursor:pointer;
  font-family:inherit; letter-spacing:.3px; transition:all .15s;
}
.lp-lb:hover { border-color:rgba(191,90,242,.3); color:rgba(191,90,242,.7); }
.lp-lb.lp-on { background:rgba(191,90,242,.15); border-color:rgba(191,90,242,.45); color:#bf5af2; }

/* Nav */
.lp-nav { display:flex; justify-content:space-between; align-items:center; padding:20px 36px; position:relative; z-index:10; }
.lp-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:22px; letter-spacing:-0.5px; }
.lp-logo-g { background:linear-gradient(135deg,#bf5af2,#ff2d78); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.lp-nav-r { display:flex; gap:20px; align-items:center; }
.lp-nav-login { font-size:13px; color:rgba(255,255,255,.4); cursor:pointer; background:none; border:none; font-family:inherit; }
.lp-nav-login:hover { color:rgba(255,255,255,.7); }
.lp-nav-btn {
  background:transparent; border:1px solid rgba(191,90,242,.45); color:#bf5af2;
  padding:8px 22px; border-radius:40px; font-size:13px; cursor:pointer; font-family:inherit;
  transition:all .15s;
}
.lp-nav-btn:hover { background:rgba(191,90,242,.12); }

/* Hero */
.lp-hero { position:relative; padding:52px 36px 0; overflow:hidden; }
.lp-hero-bg {
  position:absolute; top:-10px; right:-24px;
  font-family:'Syne',sans-serif; font-weight:800; font-size:210px; line-height:1;
  color:transparent; -webkit-text-stroke:1px rgba(191,90,242,.065);
  white-space:nowrap; pointer-events:none; user-select:none; letter-spacing:-4px;
}
.lp-orb {
  position:absolute; top:-60px; right:80px; width:280px; height:280px;
  background:radial-gradient(circle at 40% 40%,rgba(191,90,242,.22),rgba(255,45,120,.08) 60%,transparent 80%);
  border-radius:50%; pointer-events:none;
}
.lp-hero-inner { display:grid; grid-template-columns:1fr auto; gap:0; align-items:flex-end; position:relative; z-index:2; }

.lp-pill {
  display:inline-flex; align-items:center; gap:7px;
  background:rgba(191,90,242,.12); border:1px solid rgba(191,90,242,.25);
  border-radius:40px; padding:5px 14px 5px 8px; margin-bottom:26px;
}
.lp-pill-dot { width:6px; height:6px; background:#bf5af2; border-radius:50%; }
.lp-pill-txt { font-size:11px; color:#bf5af2; letter-spacing:1.5px; text-transform:uppercase; }

.lp-h1 { font-family:'Syne',sans-serif; font-weight:800; font-size:52px; line-height:1.0; margin-bottom:20px; letter-spacing:-1px; }
.lp-h1-grad { display:block; background:linear-gradient(130deg,#bf5af2 0%,#ff2d78 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:64px; line-height:.95; }
.lp-sub { font-size:15px; color:rgba(255,255,255,.43); max-width:390px; line-height:1.65; margin-bottom:32px; font-weight:300; }

.lp-btns { display:flex; flex-direction:column; gap:10px; align-items:flex-start; }
.lp-btn-main {
  background:linear-gradient(135deg,#bf5af2,#ff2d78); color:#fff; border:none;
  padding:13px 30px; border-radius:8px; font-size:15px; font-weight:500;
  cursor:pointer; font-family:inherit; transition:opacity .15s;
}
.lp-btn-main:hover { opacity:.9; }
.lp-btn-ghost {
  background:transparent; border:none; color:rgba(255,255,255,.35);
  padding:4px 0; font-size:13px; cursor:pointer; font-family:inherit;
  text-decoration:underline; text-underline-offset:3px; transition:color .15s;
}
.lp-btn-ghost:hover { color:rgba(255,255,255,.6); }

/* Float cards */
.lp-cards { display:flex; flex-direction:column; gap:10px; align-items:flex-end; padding-bottom:8px; }
.lp-card {
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
  border-radius:12px; padding:14px 20px; text-align:right; min-width:116px;
}
.lp-card.lp-card-hl { background:rgba(191,90,242,.08); border-color:rgba(191,90,242,.2); margin-right:-16px; }
.lp-card-n { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; background:linear-gradient(135deg,#bf5af2,#ff2d78); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
.lp-card-l { font-size:11px; color:rgba(255,255,255,.3); margin-top:3px; }

/* Ticker */
.lp-ticker-wrap {
  overflow:hidden; border-top:1px solid rgba(255,255,255,.05); border-bottom:1px solid rgba(255,255,255,.05);
  padding:9px 0; background:rgba(191,90,242,.03); margin-top:40px;
}
.lp-ticker { display:flex; white-space:nowrap; animation:lp-tick 24s linear infinite; }
@keyframes lp-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.lp-tick-item { font-family:'Syne',sans-serif; font-size:11px; color:rgba(255,255,255,.2); letter-spacing:2px; padding:0 26px; text-transform:uppercase; }
.lp-tick-sep { font-size:11px; color:rgba(191,90,242,.3); padding:0 4px; }

/* How */
.lp-how { padding:40px 36px 32px; }
.lp-how-label {
  font-size:10px; letter-spacing:3px; color:rgba(255,255,255,.18); text-transform:uppercase;
  margin-bottom:30px; display:flex; align-items:center; gap:12px;
}
.lp-how-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.05); }
.lp-steps { display:grid; grid-template-columns:1fr 1fr 1fr; position:relative; }
.lp-steps::before {
  content:''; position:absolute; top:33px; left:16%; right:16%; height:1px;
  background:linear-gradient(90deg,transparent,rgba(191,90,242,.28),rgba(255,45,120,.28),transparent);
}
.lp-step { padding:20px 16px 20px 0; position:relative; }
.lp-step:nth-child(2) { padding-top:46px; }
.lp-step:nth-child(3) { padding-top:70px; }
.lp-step-num {
  width:30px; height:30px; border-radius:50%;
  background:linear-gradient(135deg,#bf5af2,#ff2d78);
  display:flex; align-items:center; justify-content:center;
  font-family:'Syne',sans-serif; font-size:12px; font-weight:800;
  margin-bottom:12px; position:relative; z-index:2;
}
.lp-step-h { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; margin-bottom:6px; }
.lp-step-t { font-size:12px; color:rgba(255,255,255,.35); line-height:1.6; }

/* CTA */
.lp-cta-wrap { padding:0 36px 48px; }
.lp-cta-box {
  background:linear-gradient(125deg,rgba(191,90,242,.12),rgba(255,45,120,.06));
  border:1px solid rgba(191,90,242,.18); border-radius:20px; padding:40px;
  display:grid; grid-template-columns:1fr auto; gap:28px; align-items:center;
  position:relative; overflow:hidden;
}
.lp-cta-box::after {
  content:'alug'; position:absolute; right:-12px; bottom:-38px;
  font-family:'Syne',sans-serif; font-size:130px; font-weight:800;
  color:rgba(191,90,242,.05); line-height:1; pointer-events:none; letter-spacing:-3px;
}
.lp-cta-h { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; line-height:1.1; margin-bottom:8px; }
.lp-cta-h-g { background:linear-gradient(135deg,#bf5af2,#ff2d78); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.lp-cta-sub { font-size:13px; color:rgba(255,255,255,.35); font-weight:300; }
.lp-cta-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
.lp-cta-note { font-size:11px; color:rgba(255,255,255,.2); }

/* Responsive */
@media (max-width: 640px) {
  .lp-langs { padding:10px 16px; flex-wrap:wrap; }
  .lp-nav { padding:16px 20px; }
  .lp-hero { padding:36px 20px 0; }
  .lp-hero-inner { grid-template-columns:1fr; }
  .lp-h1 { font-size:38px; }
  .lp-h1-grad { font-size:48px; }
  .lp-cards { display:none; }
  .lp-hero-bg { font-size:130px; opacity:.5; }
  .lp-how { padding:32px 20px; }
  .lp-steps { grid-template-columns:1fr; }
  .lp-step:nth-child(2),
  .lp-step:nth-child(3) { padding-top:20px; }
  .lp-steps::before { display:none; }
  .lp-cta-wrap { padding:0 20px 36px; }
  .lp-cta-box { grid-template-columns:1fr; padding:28px 24px; }
  .lp-cta-right { align-items:stretch; }
  .lp-btn-main { width:100%; text-align:center; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage({ onRegisterClick, onLoginClick }) {
  const [lang, setLang] = useState(detectLang);
  const t = COPY[lang];

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('lp-styles')) {
      const el = document.createElement('style');
      el.id = 'lp-styles';
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  const ticker = [...t.tick, ...t.tick]; // doubled for seamless loop

  return (
    <div className="lp-root">

      {/* Lang bar */}
      <div className="lp-langs">
        {LANGS.map(l => (
          <button
            key={l}
            className={`lp-lb${lang === l ? ' lp-on' : ''}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-logo">
          al<span className="lp-logo-g">ug</span>
        </div>
        <div className="lp-nav-r">
          <button className="lp-nav-login" onClick={onLoginClick}>
            {t.loginLink}
          </button>
          <button className="lp-nav-btn" onClick={onRegisterClick}>
            {t.navBtn}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-bg">alug</div>
        <div className="lp-orb" />
        <div className="lp-hero-inner">
          <div>
            <div className="lp-pill">
              <div className="lp-pill-dot" />
              <span className="lp-pill-txt">{t.badge}</span>
            </div>
            <h1 className="lp-h1">
              {t.h1Line1}<br />
              <span className="lp-h1-grad">{t.h1Line2}</span>
            </h1>
            <p className="lp-sub">{t.sub}</p>
            <div className="lp-btns">
              <button className="lp-btn-main" onClick={onRegisterClick}>
                {t.cta1} →
              </button>
              <button className="lp-btn-ghost" onClick={onLoginClick}>
                {t.cta2}
              </button>
            </div>
          </div>
          <div className="lp-cards">
            <div className="lp-card">
              <div className="lp-card-n">0€</div>
              <div className="lp-card-l">{t.f1}</div>
            </div>
            <div className="lp-card lp-card-hl">
              <div className="lp-card-n">30 Tage</div>
              <div className="lp-card-l">{t.f2}</div>
            </div>
            <div className="lp-card">
              <div className="lp-card-n">100%</div>
              <div className="lp-card-l">{t.f3}</div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="lp-ticker-wrap">
          <div className="lp-ticker">
            {ticker.map((item, i) => (
              <React.Fragment key={i}>
                <span className="lp-tick-item">{item}</span>
                <span className="lp-tick-sep">·</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-how">
        <div className="lp-how-label">{t.howLabel}</div>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">1</div>
            <div className="lp-step-h">{t.s1h}</div>
            <p className="lp-step-t">{t.s1t}</p>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">2</div>
            <div className="lp-step-h">{t.s2h}</div>
            <p className="lp-step-t">{t.s2t}</p>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">3</div>
            <div className="lp-step-h">{t.s3h}</div>
            <p className="lp-step-t">{t.s3t}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="lp-cta-wrap">
        <div className="lp-cta-box">
          <div>
            <div className="lp-cta-h">
              {t.ctah1}<br />
              <span className="lp-cta-h-g">{t.ctah2}</span>
            </div>
            <p className="lp-cta-sub">{t.ctaSub}</p>
          </div>
          <div className="lp-cta-right">
            <button className="lp-btn-main" onClick={onRegisterClick}>
              {t.ctaBtn}
            </button>
            <span className="lp-cta-note">{t.ctaNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
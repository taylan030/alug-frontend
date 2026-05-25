import React, { useState, useEffect } from 'react';

const COPY = {
  de: {
    navLogin: 'Einloggen', navBtn: 'Jetzt starten',
    eyebrow: 'Affiliate Marketplace',
    h1a: 'Wachstum durch', h1b: 'echte Partnerschaften.',
    sub: 'Alug verbindet Unternehmen mit Affiliates, die ihre Produkte authentisch bewerben. Transparent, messbar und ausschließlich erfolgsbasiert.',
    affLabel: 'Für Affiliates', affTitle: 'Produkte empfehlen\nund Provision verdienen',
    affDesc: 'Kein eigenes Produkt nötig. Du wählst, was zu dir passt, teilst deinen Link und erhältst automatisch eine Provision für jeden vermittelten Kauf.',
    affSteps: [
      { h: 'Kostenlosen Account erstellen', t: 'Registrierung in weniger als einer Minute. Keine Kreditkarte erforderlich.' },
      { h: 'Passendes Produkt auswählen', t: 'Alle Produkte auf alug wurden geprüft. Provisionssätze und Konditionen sind transparent einsehbar.' },
      { h: 'Persönlichen Link teilen', t: 'Über Social Media, deinen Blog, Newsletter oder direkte Empfehlungen.' },
      { h: '💰 Provision erhalten', t: 'Jeder Kauf über deinen Link wird automatisch erfasst und dir gutgeschrieben. Echtzeit-Tracking inklusive.', final: true },
    ],
    affCta: 'Als Affiliate starten →',
    parLabel: 'Für Partner', parTitle: 'Produkt listen und\nReichweite gewinnen',
    parDesc: 'Du stellst dein Produkt zur Verfügung, wir sorgen für die Vermarktung. Provision zahlst du ausschließlich bei einem tatsächlich abgeschlossenen Kauf.',
    parSteps: [
      { h: 'Partner-Account registrieren', t: 'Kurze Registrierung als Partner. Unser Team schaltet deinen Account in der Regel innerhalb eines Werktages frei.' },
      { h: 'Produkt und Provision festlegen', t: 'Du gibst an, wie viel Provision Affiliates pro Verkauf erhalten — prozentual oder als Festbetrag.' },
      { h: 'Einmalige Shop-Integration', t: 'Unser Webhook lässt sich in wenigen Minuten einrichten. Vollständig kompatibel mit Shopify und anderen Systemen.' },
      { h: '🚀 Affiliates bewerben dich', t: 'Dein Produkt wird ab sofort von unserem gesamten Affiliate-Netzwerk beworben. Skalierbar ohne Mehraufwand.', final: true },
    ],
    parCta: 'Als Partner registrieren →',
    bar: [{ n: '0 €', l: 'Keine Einstiegskosten' }, { n: '30 Tage', l: 'Attributionsfenster' }, { n: '100 %', l: 'Erfolgsbasiert' }],
    step: 'Schritt',
  },
  en: {
    navLogin: 'Log in', navBtn: 'Get started',
    eyebrow: 'Affiliate Marketplace',
    h1a: 'Growth through', h1b: 'real partnerships.',
    sub: 'Alug connects businesses with affiliates who promote their products authentically. Transparent, measurable and entirely performance-based.',
    affLabel: 'For Affiliates', affTitle: 'Recommend products\nand earn commissions',
    affDesc: 'No product of your own needed. Pick what fits you, share your link and automatically earn a commission on every referred sale.',
    affSteps: [
      { h: 'Create a free account', t: 'Sign up in under a minute. No credit card required.' },
      { h: 'Choose a product', t: 'All products on alug are verified. Commission rates and terms are fully transparent.' },
      { h: 'Share your personal link', t: 'Via social media, your blog, newsletter or direct recommendations.' },
      { h: '💰 Receive your commission', t: 'Every purchase through your link is automatically tracked and credited to you. Real-time reporting included.', final: true },
    ],
    affCta: 'Start as an affiliate →',
    parLabel: 'For Partners', parTitle: 'List your product\nand gain reach',
    parDesc: 'You provide the product, we handle the promotion. You only pay a commission when an actual sale is completed.',
    parSteps: [
      { h: 'Register a partner account', t: 'Quick sign-up as a partner. Our team typically activates your account within one business day.' },
      { h: 'Set your product and commission', t: 'Define how much commission affiliates earn per sale — as a percentage or a fixed amount.' },
      { h: 'One-time shop integration', t: 'Our webhook can be set up in minutes. Fully compatible with Shopify and other platforms.' },
      { h: '🚀 Affiliates promote you', t: 'Your product is now available to our entire affiliate network. Scalable with zero additional effort.', final: true },
    ],
    parCta: 'Register as a partner →',
    bar: [{ n: '€ 0', l: 'No upfront costs' }, { n: '30 days', l: 'Attribution window' }, { n: '100 %', l: 'Performance-based' }],
    step: 'Step',
  },
  es: {
    navLogin: 'Iniciar sesión', navBtn: 'Empezar',
    eyebrow: 'Marketplace de Afiliados',
    h1a: 'Crecimiento a través de', h1b: 'alianzas reales.',
    sub: 'Alug conecta empresas con afiliados que promocionan sus productos de forma auténtica. Transparente, medible y basado exclusivamente en resultados.',
    affLabel: 'Para Afiliados', affTitle: 'Recomienda productos\ny gana comisiones',
    affDesc: 'No necesitas un producto propio. Elige lo que encaja contigo, comparte tu enlace y recibe automáticamente una comisión por cada venta generada.',
    affSteps: [
      { h: 'Crear una cuenta gratuita', t: 'Registro en menos de un minuto. Sin tarjeta de crédito.' },
      { h: 'Elegir un producto adecuado', t: 'Todos los productos en alug han sido verificados. Las comisiones y condiciones son completamente transparentes.' },
      { h: 'Compartir tu enlace personal', t: 'A través de redes sociales, tu blog, newsletter o recomendaciones directas.' },
      { h: '💰 Recibir tu comisión', t: 'Cada compra a través de tu enlace se registra automáticamente. Seguimiento en tiempo real incluido.', final: true },
    ],
    affCta: 'Empezar como afiliado →',
    parLabel: 'Para Partners', parTitle: 'Lista tu producto\ny gana alcance',
    parDesc: 'Tú pones el producto, nosotros gestionamos la promoción. Solo pagas comisión cuando se realiza una venta real.',
    parSteps: [
      { h: 'Registrar una cuenta de partner', t: 'Registro rápido como partner. Nuestro equipo activa tu cuenta habitualmente en un día hábil.' },
      { h: 'Definir producto y comisión', t: 'Tú decides cuánta comisión reciben los afiliados por venta — en porcentaje o como cantidad fija.' },
      { h: 'Integración única en tu tienda', t: 'Nuestro webhook se configura en minutos. Compatible con Shopify y otros sistemas.' },
      { h: '🚀 Los afiliados te promocionan', t: 'Tu producto está disponible para toda nuestra red de afiliados. Escalable sin esfuerzo adicional.', final: true },
    ],
    parCta: 'Registrarse como partner →',
    bar: [{ n: '0 €', l: 'Sin costes iniciales' }, { n: '30 días', l: 'Ventana de atribución' }, { n: '100 %', l: 'Basado en resultados' }],
    step: 'Paso',
  },
  fr: {
    navLogin: 'Se connecter', navBtn: 'Commencer',
    eyebrow: "Marketplace d'Affiliation",
    h1a: 'Croissance grâce à de', h1b: 'vrais partenariats.',
    sub: "Alug met en relation des entreprises avec des affiliés qui promeuvent leurs produits de façon authentique. Transparent, mesurable et entièrement basé sur la performance.",
    affLabel: 'Pour les Affiliés', affTitle: 'Recommandez des produits\net gagnez des commissions',
    affDesc: "Pas besoin de votre propre produit. Choisissez ce qui vous correspond, partagez votre lien et percevez automatiquement une commission sur chaque vente générée.",
    affSteps: [
      { h: 'Créer un compte gratuit', t: "Inscription en moins d'une minute. Aucune carte bancaire requise." },
      { h: 'Choisir un produit adapté', t: "Tous les produits sur alug ont été vérifiés. Les taux de commission et les conditions sont entièrement transparents." },
      { h: 'Partager votre lien personnel', t: 'Via les réseaux sociaux, votre blog, newsletter ou recommandations directes.' },
      { h: '💰 Recevoir votre commission', t: "Chaque achat via votre lien est automatiquement enregistré et crédité. Suivi en temps réel inclus.", final: true },
    ],
    affCta: "Démarrer en tant qu'affilié →",
    parLabel: 'Pour les Partenaires', parTitle: 'Référencez votre produit\net gagnez en visibilité',
    parDesc: "Vous fournissez le produit, nous gérons la promotion. Vous ne payez une commission que lorsqu'une vente est effectivement conclue.",
    parSteps: [
      { h: 'Créer un compte partenaire', t: "Inscription rapide en tant que partenaire. Notre équipe active généralement votre compte sous un jour ouvré." },
      { h: 'Définir votre produit et commission', t: "Vous indiquez combien les affiliés gagnent par vente — en pourcentage ou en montant fixe." },
      { h: 'Intégration unique dans votre boutique', t: "Notre webhook se configure en quelques minutes. Compatible avec Shopify et d'autres plateformes." },
      { h: '🚀 Les affiliés vous promeuvent', t: "Votre produit est accessible à tout notre réseau d'affiliés. Évolutif sans effort supplémentaire.", final: true },
    ],
    parCta: "S'inscrire comme partenaire →",
    bar: [{ n: '0 €', l: 'Aucun coût initial' }, { n: '30 jours', l: "Fenêtre d'attribution" }, { n: '100 %', l: 'Basé sur la performance' }],
    step: 'Étape',
  },
  tr: {
    navLogin: 'Giriş yap', navBtn: 'Başla',
    eyebrow: 'Affiliate Pazaryeri',
    h1a: 'Gerçek ortaklıklarla', h1b: 'büyüme.',
    sub: "Alug, işletmeleri ürünlerini özgün biçimde tanıtan affiliate'lerle buluşturur. Şeffaf, ölçülebilir ve tamamen performans odaklı.",
    affLabel: "Affiliate'ler İçin", affTitle: 'Ürün önerin\nve komisyon kazan',
    affDesc: 'Kendi ürününe gerek yok. Sana uygun ürünü seç, linkini paylaş ve her satıştan otomatik komisyon kazan.',
    affSteps: [
      { h: 'Ücretsiz hesap oluştur', t: 'Bir dakikadan kısa sürede kayıt. Kredi kartı gerekmez.' },
      { h: 'Uygun ürünü seç', t: "Alug'daki tüm ürünler onaylanmıştır. Komisyon oranları ve koşullar tamamen şeffaftır." },
      { h: 'Kişisel linkini paylaş', t: 'Sosyal medya, blog, bülten veya doğrudan tavsiye yoluyla.' },
      { h: '💰 Komisyonunu al', t: 'Linkin üzerinden gerçekleşen her satış otomatik olarak kaydedilir. Gerçek zamanlı takip dahil.', final: true },
    ],
    affCta: 'Affiliate olarak başla →',
    parLabel: 'Partnerler İçin', parTitle: 'Ürününü listele\nve erişim kazan',
    parDesc: "Ürününü sen sağla, tanıtımı biz yapalım. Komisyon yalnızca gerçekleşen satışlar için ödenir.",
    parSteps: [
      { h: 'Partner hesabı oluştur', t: 'Hızlı partner kaydı. Ekibimiz hesabını genellikle bir iş günü içinde aktive eder.' },
      { h: 'Ürün ve komisyon belirle', t: "Affiliate'lerin satış başına ne kadar kazanacağını belirle — yüzde veya sabit tutar olarak." },
      { h: 'Tek seferlik mağaza entegrasyonu', t: "Webhook'umuz birkaç dakikada kurulur. Shopify ve diğer platformlarla tam uyumludur." },
      { h: "🚀 Affiliate'ler seni tanıtır", t: "Ürünün tüm affiliate ağımız tarafından tanıtılabilir. Ek çaba gerektirmeden ölçeklenebilir.", final: true },
    ],
    parCta: 'Partner olarak kayıt ol →',
    bar: [{ n: '0 €', l: 'Başlangıç maliyeti yok' }, { n: '30 Gün', l: 'Atıf penceresi' }, { n: '% 100', l: 'Performans bazlı' }],
    step: 'Adım',
  },
};

const LANGS = ['de','en','es','fr','tr'];
function detectLang() {
  const b = (navigator.language||'en').toLowerCase().slice(0,2);
  return LANGS.includes(b) ? b : 'en';
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
.alp{font-family:'DM Sans',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;background:#07060f;color:#fff;min-height:100vh}
.alp *{box-sizing:border-box}

/* ── Lang bar ── */
.alp-langs{display:flex;gap:6px;padding:8px 40px;background:rgba(0,0,0,.25);border-bottom:1px solid rgba(255,255,255,.04);flex-wrap:wrap}
.alp-lb{background:transparent;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.3);padding:3px 13px;border-radius:20px;font-size:11px;cursor:pointer;font-family:inherit;letter-spacing:.3px;transition:all .15s}
.alp-lb:hover{border-color:rgba(191,90,242,.35);color:rgba(191,90,242,.7)}
.alp-lb.alp-on{background:rgba(191,90,242,.14);border-color:rgba(191,90,242,.4);color:#bf5af2}

/* ── Nav ── */
.alp-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 40px;border-bottom:1px solid rgba(255,255,255,.05);position:sticky;top:0;z-index:40;background:#07060f}
.alp-logo{display:block;mix-blend-mode:screen;height:38px;width:auto;object-fit:contain}
.alp-logo-fallback{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;background:linear-gradient(135deg,#bf5af2,#ff2d78);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.alp-nav-r{display:flex;gap:10px;align-items:center}
.alp-nav-login{background:transparent;border:none;color:rgba(255,255,255,.38);font-size:13px;cursor:pointer;font-family:inherit;padding:0;transition:color .15s}
.alp-nav-login:hover{color:rgba(255,255,255,.65)}
.alp-nav-btn{background:linear-gradient(135deg,#bf5af2,#ff2d78);color:#fff;border:none;padding:8px 22px;border-radius:40px;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500;transition:opacity .15s}
.alp-nav-btn:hover{opacity:.88}

/* ── Hero ── */
.alp-hero{padding:56px 40px 44px;text-align:center}
.alp-eyebrow{font-size:11px;letter-spacing:3px;color:rgba(255,255,255,.22);text-transform:uppercase;margin-bottom:18px}
.alp-h1{font-family:'Syne',sans-serif;font-weight:800;font-size:44px;line-height:1.07;margin-bottom:16px;letter-spacing:-0.5px}
.alp-h1 em{background:linear-gradient(130deg,#bf5af2,#ff2d78);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.alp-sub{font-size:15px;color:rgba(255,255,255,.38);line-height:1.7;max-width:600px;margin:0 auto;font-weight:300}

/* ── Tracks ── */
.alp-tracks{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:0 40px 40px;max-width:1200px;margin:0 auto}
.alp-track{display:flex;flex-direction:column}

/* track header */
.alp-th{border-radius:14px;padding:24px 24px 20px;margin-bottom:8px}
.alp-th-aff{background:linear-gradient(145deg,rgba(191,90,242,.15),rgba(191,90,242,.05));border:1px solid rgba(191,90,242,.25)}
.alp-th-par{background:linear-gradient(145deg,rgba(255,45,120,.13),rgba(255,45,120,.04));border:1px solid rgba(255,45,120,.2)}
.alp-th-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.alp-th-icon{font-size:24px}
.alp-th-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600}
.alp-th-aff .alp-th-label{color:#bf5af2}
.alp-th-par .alp-th-label{color:#ff2d78}
.alp-th-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;line-height:1.25;margin-bottom:10px;white-space:pre-line}
.alp-th-desc{font-size:13px;color:rgba(255,255,255,.37);line-height:1.65;font-weight:300}

/* step blocks */
.alp-step{border-radius:10px;padding:16px 18px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025)}
.alp-step-final-aff{border-color:rgba(191,90,242,.28);background:rgba(191,90,242,.07)}
.alp-step-final-par{border-color:rgba(255,45,120,.23);background:rgba(255,45,120,.065)}
.alp-sn{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px}
.alp-aff .alp-sn{color:#bf5af2}
.alp-par .alp-sn{color:#ff2d78}
.alp-sh{font-size:14px;font-weight:500;margin-bottom:5px;color:rgba(255,255,255,.9)}
.alp-st{font-size:12px;color:rgba(255,255,255,.37);line-height:1.65}

/* arrows */
.alp-arr{display:flex;justify-content:center;align-items:center;height:26px;font-size:15px}
.alp-aff .alp-arr{color:rgba(191,90,242,.3)}
.alp-par .alp-arr{color:rgba(255,45,120,.28)}

/* CTAs */
.alp-cta{border:none;padding:14px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;margin-top:6px;width:100%;letter-spacing:.2px;transition:opacity .15s}
.alp-cta:hover{opacity:.87}
.alp-cta-aff{background:linear-gradient(135deg,#bf5af2,#9b3ecf);color:#fff}
.alp-cta-par{background:linear-gradient(135deg,#ff2d78,#cc1f5e);color:#fff}

/* bottom bar */
.alp-bar{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(255,255,255,.05);padding:24px 40px}
.alp-bar-item{text-align:center}
.alp-bar-n{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;background:linear-gradient(135deg,#bf5af2,#ff2d78);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.alp-bar-l{font-size:11px;color:rgba(255,255,255,.24);margin-top:4px;letter-spacing:.3px}

/* ── Mobile ── */
@media(max-width:680px){
  .alp-langs{padding:8px 16px}
  .alp-nav{padding:12px 16px}
  .alp-logo{height:30px}
  .alp-nav-login{display:none}
  .alp-nav-btn{padding:7px 16px;font-size:12px}
  .alp-hero{padding:36px 20px 28px}
  .alp-h1{font-size:28px}
  .alp-sub{font-size:14px}
  .alp-tracks{grid-template-columns:1fr;gap:36px;padding:0 16px 32px}
  .alp-th-title{font-size:16px}
  .alp-bar{padding:20px 16px}
  .alp-bar-n{font-size:22px}
}

/* ── Wide screens ── */
@media(min-width:1100px){
  .alp-hero{padding:72px 60px 52px}
  .alp-nav,.alp-langs{padding-left:60px;padding-right:60px}
  .alp-tracks{padding:0 60px 56px}
  .alp-bar{padding:28px 60px}
  .alp-h1{font-size:52px}
}
`;

export default function LandingPage({ onRegisterClick, onLoginClick, onPartnerRegisterClick }) {
  const [lang, setLang] = useState(detectLang);
  const [logoError, setLogoError] = useState(false);
  const t = COPY[lang];

  useEffect(() => {
    if (!document.getElementById('alp-css')) {
      const el = document.createElement('style');
      el.id = 'alp-css';
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  // Partner CTA: use dedicated handler if provided, else fall back to register
  const handlePartnerCta = () => {
    if (onPartnerRegisterClick) onPartnerRegisterClick();
    else if (onRegisterClick) onRegisterClick();
  };

  return (
    <div className="alp">

      {/* Lang bar */}
      <div className="alp-langs">
        {LANGS.map(l => (
          <button key={l} className={`alp-lb${lang===l?' alp-on':''}`} onClick={()=>setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Nav — eigene Navbar der Landing Page */}
      <nav className="alp-nav">
        {logoError ? (
          <span className="alp-logo-fallback">alug</span>
        ) : (
          <img
            className="alp-logo"
            src={`${process.env.PUBLIC_URL}/alug-logo.jpg`}
            alt="alug"
            onError={() => setLogoError(true)}
          />
        )}
        <div className="alp-nav-r">
          <button className="alp-nav-login" onClick={onLoginClick}>{t.navLogin}</button>
          <button className="alp-nav-btn" onClick={onRegisterClick}>{t.navBtn}</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="alp-hero">
        <div className="alp-eyebrow">{t.eyebrow}</div>
        <h1 className="alp-h1">{t.h1a}<br /><em>{t.h1b}</em></h1>
        <p className="alp-sub">{t.sub}</p>
      </div>

      {/* Two tracks */}
      <div className="alp-tracks">

        {/* Affiliate */}
        <div className="alp-track alp-aff">
          <div className="alp-th alp-th-aff">
            <div className="alp-th-top">
              <span className="alp-th-icon">🔗</span>
              <span className="alp-th-label">{t.affLabel}</span>
            </div>
            <div className="alp-th-title">{t.affTitle}</div>
            <div className="alp-th-desc">{t.affDesc}</div>
          </div>
          {t.affSteps.map((s,i) => (
            <React.Fragment key={i}>
              <div className="alp-arr">↓</div>
              <div className={`alp-step${s.final?' alp-step-final-aff':''}`}>
                <div className="alp-sn">{t.step} 0{i+1}</div>
                <div className="alp-sh">{s.h}</div>
                <div className="alp-st">{s.t}</div>
              </div>
            </React.Fragment>
          ))}
          <div className="alp-arr">↓</div>
          <button className="alp-cta alp-cta-aff" onClick={onRegisterClick}>{t.affCta}</button>
        </div>

        {/* Partner */}
        <div className="alp-track alp-par">
          <div className="alp-th alp-th-par">
            <div className="alp-th-top">
              <span className="alp-th-icon">🛍️</span>
              <span className="alp-th-label">{t.parLabel}</span>
            </div>
            <div className="alp-th-title">{t.parTitle}</div>
            <div className="alp-th-desc">{t.parDesc}</div>
          </div>
          {t.parSteps.map((s,i) => (
            <React.Fragment key={i}>
              <div className="alp-arr">↓</div>
              <div className={`alp-step${s.final?' alp-step-final-par':''}`}>
                <div className="alp-sn">{t.step} 0{i+1}</div>
                <div className="alp-sh">{s.h}</div>
                <div className="alp-st">{s.t}</div>
              </div>
            </React.Fragment>
          ))}
          <div className="alp-arr">↓</div>
          {/* Partner CTA → register-partner mode */}
          <button className="alp-cta alp-cta-par" onClick={handlePartnerCta}>{t.parCta}</button>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="alp-bar">
        {t.bar.map((b,i) => (
          <div className="alp-bar-item" key={i}>
            <div className="alp-bar-n">{b.n}</div>
            <div className="alp-bar-l">{b.l}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
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
.alp{font-family:'DM Sans',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;background:#07060f;color:#fff;min-height:100vh;overflow-x:hidden;width:100%}
.alp *{box-sizing:border-box}

/* ── Lang bar ── */
.alp-langs{display:flex;gap:6px;padding:8px 40px;background:rgba(0,0,0,.25);border-bottom:1px solid rgba(255,255,255,.04);flex-wrap:wrap}
.alp-lb{background:transparent;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.3);padding:3px 13px;border-radius:20px;font-size:11px;cursor:pointer;font-family:inherit;letter-spacing:.3px;transition:all .15s}
.alp-lb:hover{border-color:rgba(191,90,242,.35);color:rgba(191,90,242,.7)}
.alp-lb.alp-on{background:rgba(191,90,242,.14);border-color:rgba(191,90,242,.4);color:#bf5af2}

/* ── Nav ── */
.alp-nav{display:flex;justify-content:space-between;align-items:center;padding:16px 40px;border-bottom:1px solid rgba(255,255,255,.05);position:sticky;top:0;z-index:40;background:#100a20}
.alp-logo{display:block;mix-blend-mode:screen;height:44px;width:auto;object-fit:contain;filter:brightness(1.1) contrast(1.05)}
.alp-logo-fallback{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;background:linear-gradient(135deg,#bf5af2,#ff2d78);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.alp-nav-r{display:flex;gap:10px;align-items:center}
.alp-nav-login{background:transparent;border:none;color:rgba(255,255,255,.38);font-size:13px;cursor:pointer;font-family:inherit;padding:0;transition:color .15s}
.alp-nav-login:hover{color:rgba(255,255,255,.65)}
.alp-nav-btn{background:linear-gradient(135deg,#bf5af2,#ff2d78);color:#fff;border:none;padding:8px 22px;border-radius:40px;font-size:13px;cursor:pointer;font-family:inherit;font-weight:500;transition:opacity .15s}
.alp-nav-btn:hover{opacity:.88}

/* ── Hero ── */
.alp-hero{padding:56px 40px 44px;text-align:center;overflow:hidden}
.alp-eyebrow{font-size:11px;letter-spacing:3px;color:rgba(255,255,255,.22);text-transform:uppercase;margin-bottom:18px}
.alp-h1{font-family:'Syne',sans-serif;font-weight:800;font-size:40px;line-height:1.07;margin-bottom:16px;letter-spacing:-0.5px;word-break:break-word;overflow-wrap:break-word}
.alp-h1 em{background:linear-gradient(130deg,#bf5af2,#ff2d78);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.alp-sub{font-size:15px;color:rgba(255,255,255,.38);line-height:1.7;max-width:600px;margin:0 auto;font-weight:300}

/* ── Tracks ── */
.alp-tracks{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:0 40px 40px;max-width:1200px;margin:0 auto;width:100%;box-sizing:border-box}
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
  .alp-h1{font-size:46px}
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
            src="data:image/jpeg;base64,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"
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
import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Shield, Scale, Cookie, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================
// COOKIE BANNER COMPONENT
// ============================================
export const CookieBanner = ({ onAccept }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShow(false);
    if (onAccept) onAccept();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-purple-500 p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="text-purple-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="text-white font-semibold mb-1">🍪 Cookies & Datenschutz</p>
            <p className="text-gray-300 text-sm">
              Wir verwenden Cookies für Analytics und um dein Nutzererlebnis zu verbessern. 
              Durch die Nutzung stimmst du unserer Datenschutzerklärung zu.
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button 
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Ablehnen
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
export const Footer = ({ onLegalClick }) => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Alug Marketplace</h3>
            <p className="text-gray-400 text-sm">
              Your Affiliate Marketing Platform for digital products and services.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onLegalClick('impressum')}
                  className="text-gray-400 hover:text-purple-400 text-sm"
                >
                  Impressum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalClick('datenschutz')}
                  className="text-gray-400 hover:text-purple-400 text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalClick('agb')}
                  className="text-gray-400 hover:text-purple-400 text-sm"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalClick('disclaimer')}
                  className="text-gray-400 hover:text-purple-400 text-sm"
                >
                  Affiliate Disclaimer
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">
              E-Mail: <a href="mailto:contact@alugaffiliate.com" className="text-purple-400">contact@alugaffiliate.com</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Alug Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// LEGAL MODAL COMPONENT
// ============================================
export const LegalModal = ({ page, onClose }) => {
  const [legalData, setLegalData] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('legalData');
    if (saved) {
      setLegalData(JSON.parse(saved));
    }
  }, []);

  const replacePlaceholders = (text) => {
    if (!legalData || Object.keys(legalData).length === 0) return text;
    
    return text
      .replace(/\[FIRMENNAME\]/g, legalData.companyName || '[FIRMENNAME]')
      .replace(/\[STRASSE UND HAUSNUMMER\]/g, legalData.street || '[STRASSE UND HAUSNUMMER]')
      .replace(/\[PLZ STADT\]/g, legalData.city || '[PLZ STADT]')
      .replace(/\[LAND\]/g, legalData.country || 'Deutschland')
      .replace(/\[IHRE EMAIL\]/g, legalData.email || '[IHRE EMAIL]')
      .replace(/\[IHRE TELEFONNUMMER\]/g, legalData.phone || '[IHRE TELEFONNUMMER]')
      .replace(/\[UST-ID FALLS VORHANDEN\]/g, legalData.ustId || '[UST-ID FALLS VORHANDEN]')
      .replace(/\[FALLS GmbH.*?\]/g, legalData.handelsregister || '[FALLS GmbH]')
      .replace(/\[HOSTING-ANBIETER.*?\]/g, legalData.hostingProvider || '[HOSTING-ANBIETER]')
      .replace(/\[IHR NAME\]/g, legalData.companyName || '[IHR NAME]')
      .replace(/\[IHRE ADRESSE\]/g, `${legalData.street || ''}, ${legalData.city || ''}`.trim() || '[IHRE ADRESSE]')
      .replace(/\[IHR FIRMENNAME\]/g, legalData.companyName || '[IHR FIRMENNAME]')
      .replace(/\[IHR GERICHTSSTAND\]/g, legalData.city || '[IHR GERICHTSSTAND]');
  };

  const content = {
    impressum: {
      title: 'Impressum',
      icon: <FileText className="text-purple-400" size={32} />,
      content: `
        <h2>Angaben gemäß § 5 TMG</h2>
        <p><strong>[FIRMENNAME]</strong><br/>
        [STRASSE UND HAUSNUMMER]<br/>
        [PLZ STADT]<br/>
        [LAND]</p>

        <h3>Kontakt</h3>
        <p>E-Mail: [IHRE EMAIL]<br/>
        Telefon: [IHRE TELEFONNUMMER]</p>

        <h3>Umsatzsteuer-ID</h3>
        <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br/>
        [UST-ID FALLS VORHANDEN]</p>

        <h3>Handelsregister</h3>
        <p>[FALLS GmbH: Registergericht und Handelsregisternummer]</p>

        <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
        <p>[IHR NAME]<br/>
        [IHRE ADRESSE]</p>

        <h3>EU-Streitschlichtung</h3>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" class="text-purple-400 underline">https://ec.europa.eu/consumers/odr</a><br/>
        Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

        <h3>Haftungsausschluss</h3>
        <h4>Haftung für Inhalte</h4>
        <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
      `
    },
    datenschutz: {
      title: 'Datenschutzerklärung',
      icon: <Shield className="text-blue-400" size={32} />,
      content: `
        <h2>1. Datenschutz auf einen Blick</h2>
        
        <h3>Allgemeine Hinweise</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
        passiert, wenn Sie diese Website besuchen.</p>

        <h3>Datenerfassung auf dieser Website</h3>
        <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
        Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

        <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
        <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.B. bei der Registrierung). 
        Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.</p>

        <h2>2. Hosting</h2>
        <p>Wir hosten die Inhalte unserer Website bei folgenden Anbietern:<br/>
        <strong>Vercel Inc.</strong> (Frontend), <strong>Render Services Inc.</strong> (Backend), <strong>Neon Inc.</strong> (Datenbank)</p>

        <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
        
        <h3>Datenschutz</h3>
        <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
        Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

        <h2>4. Datenerfassung auf dieser Website</h2>
        
        <h3>Cookies</h3>
        <p>Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien 
        und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die 
        Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</p>

        <h3>Server-Log-Dateien</h3>
        <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
        Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>

        <h3>Registrierung auf dieser Website</h3>
        <p>Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen. 
        Die dazu eingegebenen Daten (Name, E-Mail, Passwort) verwenden wir nur zum Zwecke der Nutzung 
        des jeweiligen Angebotes oder Dienstes, auf Basis von Art. 6 Abs. 1 lit. b DSGVO.</p>

        <h2>5. Affiliate-Programme und Tracking</h2>
        <p>Diese Website nimmt an Affiliate-Programmen teil. Dabei werden durch die auf dieser 
        Website eingesetzten Tracking-Cookies Daten von Ihnen als Nutzer erhoben, um Provisionen 
        korrekt zuordnen zu können.</p>

        <p><strong>Welche Daten werden erfasst?</strong></p>
        <ul>
          <li>Klicks auf Affiliate-Links</li>
          <li>IP-Adresse (anonymisiert)</li>
          <li>Zeitpunkt des Klicks</li>
          <li>Browser-Informationen (User-Agent)</li>
        </ul>

        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>

        <h3>Ihre Rechte</h3>
        <p>Sie haben jederzeit das Recht:</p>
        <ul>
          <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
          <li>Einschränkung der Datenverarbeitung zu verlangen (Art. 18 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
          <li>Datenübertragbarkeit zu verlangen (Art. 20 DSGVO)</li>
        </ul>

        <p><strong>Kontakt für Datenschutzanfragen:</strong><br/>
        contact@alugaffiliate.com</p>

        <p>Stand: ${new Date().toLocaleDateString('de-DE')}</p>
      `
    },
    agb: {
      title: 'Allgemeine Geschäftsbedingungen (AGB)',
      icon: <Scale className="text-green-400" size={32} />,
      content: `
        <h2>1. Geltungsbereich</h2>
        <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Affiliate-Marketing-Plattform 
        "[FIRMENNAME]" (nachfolgend "Plattform" genannt).</p>

        <h2>2. Vertragspartner</h2>
        <p>Der Vertrag kommt zustande zwischen:<br/>
        <strong>[IHR FIRMENNAME]</strong><br/>
        [IHRE ADRESSE]<br/>
        und dem registrierten Nutzer (nachfolgend "Affiliate" oder "Partner" genannt).</p>

        <h2>3. Leistungsbeschreibung</h2>
        <p>Die Plattform bietet Affiliates die Möglichkeit, Produkte und Dienstleistungen zu bewerben 
        und bei erfolgreicher Vermittlung Provisionen zu verdienen.</p>

        <h3>3.1 Registrierung</h3>
        <p>Die Nutzung der Plattform setzt eine Registrierung voraus. Bei der Registrierung müssen 
        wahrheitsgemäße und vollständige Angaben gemacht werden.</p>

        <h3>3.2 Affiliate-Links</h3>
        <p>Nach erfolgreicher Registrierung erhält der Affiliate individuelle Tracking-Links, 
        mit denen Verkäufe und Conversions nachverfolgt werden können.</p>

        <h2>4. Provisionen</h2>
        
        <h3>4.1 Provisionshöhe</h3>
        <p>Die Höhe der Provision wird für jedes Produkt individuell festgelegt und ist in der 
        Produktbeschreibung ersichtlich.</p>

        <h3>4.2 Provisionsanspruch</h3>
        <p>Ein Provisionsanspruch entsteht, wenn:</p>
        <ul>
          <li>Ein Kunde über den Affiliate-Link auf die Zielseite gelangt</li>
          <li>Der Kunde einen Kauf tätigt oder eine definierte Aktion durchführt</li>
          <li>Die Transaktion nicht storniert oder zurückgegeben wird</li>
          <li>Kein Betrugsversuch vorliegt</li>
        </ul>

        <h3>4.3 Attribution Window</h3>
        <p>Die Standard-Cookie-Laufzeit beträgt 30 Tage (je nach Produkt 7–90 Tage). Innerhalb dieser Zeit 
        werden dem Affiliate Conversions zugeordnet.</p>

        <h2>5. Auszahlungen</h2>
        
        <h3>5.1 Mindestauszahlungsbetrag</h3>
        <p>Der Mindestauszahlungsbetrag liegt bei 10,00 EUR.</p>

        <h3>5.2 Auszahlungsmodalitäten</h3>
        <p>Auszahlungen erfolgen nach Beantragung durch den Affiliate und nach Prüfung durch uns. 
        Die Bearbeitungszeit beträgt in der Regel 5–10 Werktage.</p>

        <h3>5.3 Zahlungsmethoden</h3>
        <p>Verfügbare Zahlungsmethoden: PayPal, Banküberweisung, Kryptowährungen (nach Verfügbarkeit).</p>

        <h2>6. Pflichten des Affiliates</h2>
        
        <h3>6.1 Verbotene Praktiken</h3>
        <p>Folgende Praktiken sind untersagt und führen zur sofortigen Sperrung:</p>
        <ul>
          <li>Cookie-Stuffing oder Cookie-Dropping</li>
          <li>Selbst-Referrals (eigene Käufe über Affiliate-Link)</li>
          <li>Manipulation von Tracking-Daten</li>
          <li>Klickbetrug oder automatisierte Klicks</li>
          <li>Spam und unerlaubte Werbeformen</li>
        </ul>

        <h2>7. Haftung</h2>
        <p>Wir haften nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit 
        ist ausgeschlossen, soweit nicht eine Verletzung wesentlicher Vertragspflichten vorliegt.</p>

        <h2>8. Vertragslaufzeit und Kündigung</h2>
        <p>Der Vertrag wird auf unbestimmte Zeit geschlossen. Beide Parteien können den Vertrag 
        jederzeit ohne Angabe von Gründen mit einer Frist von 14 Tagen kündigen.</p>

        <h2>9. Schlussbestimmungen</h2>
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist [IHR GERICHTSSTAND], soweit gesetzlich zulässig.</p>

        <p>Stand: ${new Date().toLocaleDateString('de-DE')}</p>
      `
    },
    disclaimer: {
      title: 'Affiliate Disclaimer',
      icon: <FileText className="text-yellow-400" size={32} />,
      content: `
        <h2>Affiliate-Offenlegung und Transparenzhinweis</h2>
        
        <h3>Was ist Affiliate-Marketing?</h3>
        <p>Diese Website nimmt am Affiliate-Marketing teil. Das bedeutet, dass wir Provisionen 
        für Produkte oder Dienstleistungen erhalten können, die über Links auf dieser Website 
        erworben werden.</p>

        <h3>Wie funktioniert es?</h3>
        <p>Wenn Sie auf einen Affiliate-Link klicken und anschließend ein Produkt kaufen, erhalten 
        wir möglicherweise eine Provision vom Anbieter — ohne zusätzliche Kosten für Sie.</p>

        <h3>Unsere Werte</h3>
        <ul>
          <li><strong>Ehrlichkeit:</strong> Wir kennzeichnen alle Affiliate-Links transparent</li>
          <li><strong>Qualität:</strong> Wir empfehlen nur geprüfte Produkte und Services</li>
          <li><strong>Fairness:</strong> Wir behandeln alle Produkte und Anbieter gleich</li>
        </ul>

        <h3>Cookie-Nutzung für Tracking</h3>
        <p>Für die Zuordnung von Käufen über Affiliate-Links verwenden wir Cookies. Diese:</p>
        <ul>
          <li>Speichern, dass Sie über unseren Link auf eine Seite gelangt sind</li>
          <li>Ermöglichen die korrekte Provisionszuordnung</li>
          <li>Laufen nach 30 Tagen ab (je nach Produkt)</li>
          <li>Enthalten keine persönlichen Identifikationsdaten</li>
        </ul>

        <h3>Kontakt</h3>
        <p>E-Mail: <a href="mailto:contact@alugaffiliate.com" class="text-purple-400 underline">contact@alugaffiliate.com</a></p>

        <p><strong>Letzte Aktualisierung:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
      `
    }
  };

  const currentContent = content[page] || content.impressum;
  const processedContent = replacePlaceholders(currentContent.content);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full border-2 border-purple-500 my-8">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            {currentContent.icon}
            <h2 className="text-2xl font-bold text-white">{currentContent.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div 
            className="legal-content text-gray-300"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </div>

      <style jsx>{`
        .legal-content h2 {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .legal-content h3 {
          color: rgb(209, 213, 219);
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .legal-content h4 {
          color: rgb(209, 213, 219);
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .legal-content p {
          margin-bottom: 1rem;
        }
        .legal-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          list-style-type: disc;
        }
        .legal-content li {
          margin-bottom: 0.5rem;
        }
        .legal-content a {
          color: rgb(168, 85, 247);
          text-decoration: underline;
        }
        .legal-content strong {
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

// ============================================
// ADMIN LEGAL EDITOR COMPONENT
// ============================================
export const AdminLegalEditor = ({ onSave }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({
    companyName: 'Taylan Mert',
    street: 'Ringbahnstraße 57',
    city: '12099 Berlin',
    country: 'Deutschland',
    email: 'contact@alugaffiliate.com',
    phone: '',
    ustId: '',
    handelsregister: '',
    hostingProvider: 'Vercel Inc. (Frontend), Render Services Inc. (Backend), Neon Inc. (Datenbank)',
  });

  const sections = [
    { id: 'company', title: 'Firmendaten', icon: <FileText size={20} /> },
    { id: 'contact', title: 'Kontaktdaten', icon: <Shield size={20} /> },
    { id: 'legal', title: 'Rechtliche Angaben', icon: <Scale size={20} /> },
  ];

  const handleSave = () => {
    localStorage.setItem('legalData', JSON.stringify(formData));
    if (onSave) onSave(formData);
    alert('✅ Rechtliche Daten gespeichert!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('legalData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 border border-purple-500">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Edit2 size={28} className="text-purple-400" />
          Rechtliche Angaben bearbeiten
        </h2>
        <p className="text-gray-300">
          Fülle hier deine Daten aus. Diese werden automatisch in Impressum, Datenschutz und AGB eingefügt.
        </p>
      </div>

      {sections.map(section => (
        <div key={section.id} className="bg-gray-800 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-750"
          >
            <div className="flex items-center gap-3">
              <div className="text-purple-400">{section.icon}</div>
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            </div>
            {activeSection === section.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {activeSection === section.id && (
            <div className="p-6 border-t border-gray-700 space-y-4">
              {section.id === 'company' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Straße und Hausnummer *</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PLZ und Stadt *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Land *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {section.id === 'contact' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">E-Mail Adresse *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefonnummer (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="+49 30 12345678"
                    />
                  </div>
                </>
              )}

              {section.id === 'legal' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Umsatzsteuer-ID (optional)</label>
                    <input
                      type="text"
                      value={formData.ustId}
                      onChange={(e) => setFormData({...formData, ustId: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="DE123456789"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nur bei Umsatzsteuerpflicht</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Handelsregister (optional)</label>
                    <input
                      type="text"
                      value={formData.handelsregister}
                      onChange={(e) => setFormData({...formData, handelsregister: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Amtsgericht Berlin, HRB 12345"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nur bei GmbH/UG</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Hosting-Anbieter</label>
                    <input
                      type="text"
                      value={formData.hostingProvider}
                      onChange={(e) => setFormData({...formData, hostingProvider: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Änderungen speichern
        </button>
      </div>

      <div className="bg-blue-900 border border-blue-500 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">💡 Wichtiger Hinweis</h4>
        <p className="text-blue-200 text-sm">
          Diese Texte sind Vorlagen und ersetzen KEINE Rechtsberatung! Für rechtssichere Texte 
          konsultiere bitte einen Anwalt oder nutze Dienste wie eRecht24 oder IT-Recht-Kanzlei.
        </p>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English',    flag: '🇬🇧' },
  { code: 'te', label: 'తె', full: 'Telugu',      flag: '🇮🇳' },
  { code: 'hi', label: 'हि', full: 'Hindi',       flag: '🇮🇳' },
];

// Trigger Google Translate to switch language
function triggerGoogleTranslate(langCode) {
  // Google Translate stores the selected lang in a cookie named googtrans
  // Setting it and reloading triggers the translation
  if (langCode === 'en') {
    // Reset to original English
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    window.location.reload();
    return;
  }

  const cookieVal = `/en/${langCode}`;
  document.cookie = `googtrans=${cookieVal}; path=/`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;

  // Use the hidden Google Translate select element
  const selectEl = document.querySelector('.goog-te-combo');
  if (selectEl) {
    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event('change'));
  } else {
    // Fallback: reload with cookie set
    window.location.reload();
  }
}

function getActiveLang() {
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match ? match[1] : 'en';
}

export default function LanguageSwitcher({ collapsed }) {
  const [active, setActive] = useState('en');

  useEffect(() => {
    setActive(getActiveLang());
  }, []);

  const handleSwitch = (code) => {
    setActive(code);
    localStorage.setItem('app_lang', code);
    triggerGoogleTranslate(code);
  };

  if (collapsed) {
    // Collapsed: show only current lang code, click cycles through
    const currentIndex = LANGS.findIndex(l => l.code === active);
    const nextLang = LANGS[(currentIndex + 1) % LANGS.length];
    return (
      <div style={{ padding: '6px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
        <button
          onClick={() => handleSwitch(nextLang.code)}
          title={`Switch to ${nextLang.full}`}
          style={{
            fontSize: '0.7rem', fontWeight: 800,
            padding: '4px 7px', borderRadius: '6px',
            border: '1.5px solid var(--primary-light)',
            background: 'var(--primary-glow)',
            color: 'var(--primary-light)',
            cursor: 'pointer', lineHeight: 1.3
          }}
        >
          {LANGS.find(l => l.code === active)?.label}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', gap: '4px',
      padding: '8px 12px',
      borderBottom: '1px solid var(--border)',
      marginBottom: '4px',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '4px', flexShrink: 0 }}>🌐</span>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => handleSwitch(l.code)}
          title={l.full}
          style={{
            fontSize: '0.75rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '6px',
            border: active === l.code
              ? '1.5px solid var(--primary-light)'
              : '1.5px solid var(--border)',
            background: active === l.code
              ? 'var(--primary-glow)'
              : 'transparent',
            color: active === l.code
              ? 'var(--primary-light)'
              : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            lineHeight: 1.4
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}






// --- KONFIGURACJA ---
// Wklej tutaj URL swojego Webhooka (np. Google Apps Script / Make.com)
export const WEBHOOK_URL = ""; 

export const PRICELIST_DATA = `
CENNIK USŁUG - MONTAŻREKLAM24.PL

1. OKLEJANIE WITRYN (Druk + Montaż)
- Cena: 100 zł netto / m²
- Minimalne zamówienie z montażem: 550 zł netto (łącznie z dojazdem)

2. DOJAZD NA MONTAŻ + MINIMUM LOGISTYCZNE (Warszawa i okolice do 20km od ul. Poprawnej 39R)
- Stała opłata: 350 zł netto
- Powyżej 20km: Wycena indywidualna.

3. FOLIE PRZECIWSŁONECZNE (Materiał + Montaż)
- Folia Ceramiczna (jasna, redukcja ciepła): 300 zł netto / m²
- Lustro Weneckie (mocne przyciemnienie): 200 zł netto / m²

4. USŁUGI DODATKOWE
- Usuwanie starej folii: 50 zł netto / m² (min. 150 zł netto)
- Projekt graficzny: 200 zł netto / h (min. 250 zł netto). Gratis przy gotowym pliku.
- Pomiar (Dojazd przed montażem): 200 zł netto
- Praca na wysokości (>3.5m): Zwyżka 250 zł netto/h (min. 3h = 750 zł netto).
`;

export const DEADLINE_CONFIG = {
  standard: {
    label: "Standard (5-10 dni roboczych)",
    modifier: 0,
    description: "Bez dopłat",
    color: "#374151"
  },
  express: {
    label: "Express (3-5 dni roboczych)",
    modifier: 0.25,
    description: "+25% wartości zlecenia",
    color: "#d97706" // Amber
  },
  extended: {
    label: "Wydłużony (15-30 dni roboczych)",
    modifier: -0.15,
    description: "-15% rabatu",
    color: "#16a34a" // Green
  }
};

// --- STYLES ---
export const styles = {
  container: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    margin: '0 auto',
  },
  header: {
    backgroundColor: '#000000', // Changed to black
    color: 'white',
    padding: '20px 30px',
    textAlign: 'center' as const,
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
  },
  headerSub: {
    fontSize: '14px',
    opacity: 0.8,
    marginTop: '5px',
  },
  // DEADLINE BAR
  deadlineBar: {
    backgroundColor: '#f1f1f1',
    padding: '15px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  deadlineLabel: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#64748b',
    letterSpacing: '0.5px',
  },
  deadlineSelect: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    fontWeight: 500,
    color: '#1e293b',
    width: '100%',
    maxWidth: '400px',
    cursor: 'pointer',
    outline: 'none',
  },
  deadlineInfo: (color: string) => ({
    fontSize: '13px',
    fontWeight: 600,
    color: color,
  }),

  chatSection: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    height: '450px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  messagesBox: {
    flex: 1,
    overflowY: 'auto' as const,
    marginBottom: '15px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    scrollBehavior: 'smooth' as const,
  },
  bubble: (isUser: boolean) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#2563EB' : '#ffffff',
    color: isUser ? 'white' : '#1e293b',
    padding: '12px 18px',
    borderRadius: '12px',
    maxWidth: '80%',
    boxShadow: isUser ? '0 2px 4px rgba(37, 99, 235, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
    whiteSpace: 'pre-wrap' as const,
    border: isUser ? 'none' : '1px solid #e2e8f0',
  }),
  inputWrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end', // Aligns button to bottom of textarea
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    minHeight: '100px', // Increased height (approx 3x)
    resize: 'none' as const, // FIX: Added as const for TypeScript
    fontFamily: 'inherit',
  },
  sendBtn: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    padding: '0 25px',
    height: '50px', // Fixed height for button
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  // LIVE QUOTE SECTION
  quoteSection: {
    padding: '30px',
    backgroundColor: '#fff',
    borderBottom: '4px solid #f3f4f6',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quoteTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '10px',
    borderBottom: '2px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #f3f4f6',
    color: '#374151',
  },
  totalRow: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#111827',
  },
  
  // FORM SECTION
  formSection: {
    padding: '30px',
    backgroundColor: '#fff',
  },
  row: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap' as const,
  },
  col: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  formInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  toggleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    padding: '4px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    width: 'fit-content',
  },
  toggleBtn: (active: boolean) => ({
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: active ? 'white' : 'transparent',
    color: active ? '#1e3a8a' : '#64748b',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.2s',
  }),
  
  // PAYMENT
  paymentSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  paymentOption: (selected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    border: selected ? '2px solid #2563EB' : '1px solid #d1d5db',
    backgroundColor: selected ? '#eff6ff' : 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'all 0.2s',
  }),
  
  copyBtn: {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    color: '#475569',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },

  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#16a34a', // Green
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  
  // UPLOAD SECTION
  dropZone: {
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  dropZoneHover: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563EB',
  },
  fileList: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
  },
  removeFileBtn: {
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '4px 8px',
  },
};
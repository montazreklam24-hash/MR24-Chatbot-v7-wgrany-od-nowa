
// FIX: Declare process for TypeScript in Vite environment
declare const process: { env: { API_KEY: string } };

import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { styles, PRICELIST_DATA, WEBHOOK_URL, DEADLINE_CONFIG } from './constants';
import { QuoteData, UploadedFile, OrderData, Message, DeadlineType } from './types';
import { ChatSection } from './components/ChatSection';
import { LiveQuoteSection } from './components/LiveQuoteSection';
import { ClientFormSection } from './components/ClientFormSection';

const App = () => {
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Witam w kalkulatorze oklejania witryn okiennych.\n\nOklejamy okna foliami dekoracyjnymi, reklamowymi z nadrukiem oraz przeciwsłonecznymi (bezbarwnymi, z efektem lustra weneckiego lub delikatnego zaciemnienia).\n\nChętnie pomogę w wycenie Twojego zlecenia.\nJaki rodzaj oklejania Cię interesuje?\n\nNa wstępie dodam tylko, że abyśmy mogli przygotować dokładną ofertę, będę potrzebował kilku informacji:\n\n1. Wymiarów oklejanych powierzchni (w cm).\n2. Zdjęcia miejsca montażu (to kluczowe – nie działamy po omacku!).\n3. Adresu montażu.\n4. Czy wysokość od ziemi jest powyżej 3,5 m? (Musimy ustalić czy wystarczy drabina, czy potrzebny będzie podnośnik i czy jest dla niego dostępny dojazd).\n\nNapisz proszę krótko co planujesz, a ja przeprowadzę Cię przez proces wyceny.' }
  ]);
  const [quoteData, setQuoteData] = useState<QuoteData>({ items: [], totalNet: 0 });
  const [inputValue, setInputValue] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesBoxRef = useRef<HTMLDivElement>(null);
  
  // Excluded items indices (checkboxes)
  const [excludedIndices, setExcludedIndices] = useState<number[]>([]);
  
  // Files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const [orderData, setOrderData] = useState<OrderData>({
    type: 'company',
    paymentMethod: 'proforma',
    deadline: 'standard',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    companyName: '',
    nip: '',
    companyAddress: '',
    companyCity: '',
    companyZip: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToBottom = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  // Reset exclusions when quote items change significantly (optional logic, kept simple for now)
  useEffect(() => {
     setExcludedIndices(prev => prev.filter(i => i < quoteData.items.length));
  }, [quoteData]);

  // --- LOGIKA CZATU I PARSOWANIE OFERTY ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (isChatLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setIsChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Jesteś Ekspertem ds. Wycen w MontażReklam24.pl.
        Twoim JEDYNYM celem jest ustalenie technicznych szczegółów zlecenia: Rodzaj folii, Wysokość montażu, Lokalizacja, Projekt.

        BAZA WIEDZY (CENNIK):
        ${PRICELIST_DATA}

        ZASADY PROWADZENIA ROZMOWY:
        1. Zadawaj TYLKO JEDNO pytanie na raz. Czekaj na odpowiedź klienta.
        2. Bądź konkretny i uprzejmy.
        3. Jeśli klient nie ma wymiarów/zdjęć - zapytaj: "Czy chce Pan/Pani zamówić płatny Pomiar (Dojazd przed montażem) (200 zł + VAT), czy dośle Pan/Pani wymiary i zdjęcia później w mailu?".
        4. Jeśli klient chce wysłać zdjęcia teraz - poinstruuj go, że może użyć przycisku/strefy "Przeciągnij pliki" poniżej formularza.
        5. Używaj poprawnego nazewnictwa usług: "Pomiar (Dojazd przed montażem)" oraz "Dojazd na montaż + minimum logistyczne".

        NIE PYTAJ O DANE OSOBOWE (Imię, Nazwisko, NIP) - klient wpisze je w formularzu poniżej czatu.

        *** ZASADA GENEROWANIA PEŁNEJ OFERTY ***
        Zawsze generuj pełny kosztorys, nawet jeśli wymiary są szacunkowe.
        
        1. Jeśli klient podał wymiary "na oko" (np. "chyba 2x3 metry"), użyj ich do wyliczenia pozycji "Oklejanie witryn (m2)".
        2. ZAWSZE dodaj pozycję "Dojazd na montaż + minimum logistyczne" (zgodnie z lokalizacją lub stawką bazową).
        3. Dodaj pozycję "Pomiar (Dojazd przed montażem)" jeśli klient o nim wspomni lub jeśli wymiary są niepewne.
        
        Chodzi o to, aby klient widział CAŁOŚCIOWY koszt rzędu wielkości. W tabelce klient będzie mógł sobie odznaczyć pozycje (checkboxami), których nie chce, więc lepiej dodać więcej pozycji niż mniej.

        WAŻNE - GENEROWANIE JSON:
        Po każdej swojej odpowiedzi, na samym końcu, dodaj ukryty blok kodu JSON z aktualną wyceną.
        Nawet jeśli nic się nie zmieniło, wygeneruj JSON z aktualnym stanem.
        Format:
        \`\`\`json
        {
          "items": [
             {"name": "Oklejanie OWV", "details": "ok. 6m2 (wymiar szacunkowy)", "price": 600},
             {"name": "Dojazd na montaż + minimum logistyczne", "details": "Warszawa", "price": 350},
             {"name": "Pomiar (Dojazd przed montażem)", "details": "Weryfikacja wymiarów", "price": 200}
          ],
          "totalNet": 1150
        }
        \`\`\`
        Ten JSON służy do aktualizacji tabelki na stronie.
      `;

      // Konwersja historii do formatu Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Direct call to avoid 'this' context issues
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...history,
            { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Niski, żeby trzymał się cennika
        }
      });

      const responseText = response.text || "";
      
      // Wyciągnij JSON z odpowiedzi
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      let cleanText = responseText;

      if (jsonMatch) {
          try {
              const jsonData = JSON.parse(jsonMatch[1]);
              setQuoteData(jsonData);
              // Usuń JSON z tekstu wyświetlanego użytkownikowi
              cleanText = responseText.replace(jsonMatch[0], '').trim();
          } catch (e) {
              console.error("Błąd parsowania JSON z AI", e);
          }
      }

      setMessages(prev => [...prev, { role: 'model', text: cleanText }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Przepraszam, wystąpił błąd połączenia. Spróbuj ponownie.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- OBSŁUGA PLIKÓW ---
  const handleFileChange = async (files: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of files) {
      // Create preview if image
      let preview: string | null = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      newFiles.push({ file, preview });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- WYSYŁKA FORMULARZA (BACKEND SIMULATION) ---
  const handleSubmit = async () => {
    // Walidacja podstawowa
    if (!orderData.email || !orderData.phone || !orderData.lastName) {
      alert("Proszę uzupełnić wymagane dane kontaktowe (Imię, Nazwisko, Email, Telefon)");
      return;
    }

    // Filter active items
    const activeItems = quoteData.items.filter((_, idx) => !excludedIndices.includes(idx));
    const activeTotalNet = activeItems.reduce((sum, item) => sum + item.price, 0);

    if (activeTotalNet === 0) {
      const confirm = window.confirm("Twoja wycena wynosi 0 zł (lub odznaczono wszystkie pozycje). Czy na pewno chcesz wysłać formularz jako zapytanie ogólne?");
      if (!confirm) return;
    }

    setIsSubmitting(true);

    try {
      // Calculate final total with modifier based on ACTIVE items
      const modifier = DEADLINE_CONFIG[orderData.deadline].modifier;
      const finalTotal = activeTotalNet + (activeTotalNet * modifier);

      // 1. Przygotuj nazwę folderu dla Google Drive
      const folderName = `${orderData.firstName} ${orderData.lastName} - ${orderData.street} - ${finalTotal.toFixed(0)} PLN`;

      // 2. Konwersja plików
      const filePayloads = await Promise.all(uploadedFiles.map(async (uf) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result as string;
                const base64String = res.includes(',') ? res.split(',')[1] : res;
                resolve({
                    name: uf.file.name,
                    mimeType: uf.file.type,
                    data: base64String
                });
            };
            reader.readAsDataURL(uf.file);
        });
      }));

      // 3. Payload do Webhooka
      const payload = {
        timestamp: new Date().toISOString(),
        orderData: orderData,
        quote: {
          items: activeItems, // Send only active items
          deadline: DEADLINE_CONFIG[orderData.deadline].label,
          deadlineModifier: modifier,
          baseNet: activeTotalNet,
          finalTotalNet: finalTotal
        },
        chatHistory: messages,
        folderName: folderName,
        files: filePayloads
      };

      console.log("Wysyłanie danych do:", WEBHOOK_URL);

      // SYMULACJA SUKCESU LUB RZECZYWISTE WYSŁANIE
      if (WEBHOOK_URL) {
         // await fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
      }
      
      await new Promise(r => setTimeout(r, 2000)); 

      alert(`Dziękujemy! Zamówienie zostało przyjęte.\nUtworzono folder: ${folderName}\nOtrzymasz potwierdzenie na maila: ${orderData.email}`);
      
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd podczas wysyłania zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeadlineChange = (val: DeadlineType) => {
    setOrderData(prev => ({ ...prev, deadline: val }));
  };

  const toggleItemExclusion = (index: number) => {
    setExcludedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>MontażReklam24.pl</h1>
        <p style={styles.headerSub}>Inteligentny System Wycen i Zamówień</p>
      </div>

      <ChatSection 
        messages={messages} 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        handleSendMessage={handleSendMessage}
        isChatLoading={isChatLoading}
        messagesBoxRef={messagesBoxRef}
      />

      <LiveQuoteSection 
        quoteData={quoteData}
        selectedDeadline={orderData.deadline}
        onDeadlineChange={handleDeadlineChange}
        orderData={orderData}
        excludedIndices={excludedIndices}
        toggleItemExclusion={toggleItemExclusion}
      />

      <ClientFormSection 
        orderData={orderData} 
        setOrderData={setOrderData}
        uploadedFiles={uploadedFiles}
        handleFileChange={handleFileChange}
        removeFile={removeFile}
        setUploadedFiles={setUploadedFiles}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
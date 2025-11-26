# MontażReklam24 - Chatbot Wyceniający

Aplikacja React (Vite) zintegrowana z Google Gemini API do automatycznej wyceny usług oklejania witryn.

## 🚀 Uruchomienie lokalne

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Utwórz plik `.env` w głównym folderze i dodaj swój klucz API:
   ```
   API_KEY=twoj_klucz_api_gemini
   ```
3. Uruchom aplikację:
   ```bash
   npm run dev
   ```

## 📦 Wdrożenie na Vercel

Aplikacja jest gotowa do wdrożenia na platformie Vercel.

1. **Zainstaluj Vercel CLI** (opcjonalnie) lub połącz repozytorium GitHub z Vercel.
2. **Importuj projekt** w panelu Vercel.
3. **Konfiguracja Builda**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Zmienne Środowiskowe (Environment Variables)**:
   - W ustawieniach projektu na Vercel (Settings -> Environment Variables) dodaj zmienną:
     - Key: `API_KEY`
     - Value: `Twój_Klucz_Gemini_API`

**Ważne:** Ponieważ jest to aplikacja typu SPA (Single Page Application), klucz API jest zaszywany w kodzie strony. Upewnij się, że w Google Cloud Console nałożyłeś ograniczenia (Restrictions) na ten klucz, aby działał tylko z domeny Twojej aplikacji na Vercel (np. `twoja-strona.vercel.app`).

## ⚙️ Konfiguracja Cennika

Cennik znajduje się w pliku `constants.ts` w zmiennej `PRICELIST_DATA`. Jest to zwykły tekst, który AI wykorzystuje jako bazę wiedzy. Możesz go dowolnie edytować.

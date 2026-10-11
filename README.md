# Liviu · Costruisci

App personale di self improvement, costruita a partire dai documenti in `docs/`:

- `docs/Vita.md` — routine giornaliera, dieta bulk 3000 kcal, integratori, medicine, scheda di allenamento, acqua, peso.
- `docs/Indicazioni.md` — messaggi di benvenuto per fascia oraria, messaggi speciali, promemoria.
- `docs/Design.md` — manuale di design in stile Apple e componenti React Bits usati nell'app.

## Avvio

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produzione in dist/
npm run preview  # anteprima della build
```

L'app è una PWA: dal browser del telefono si può aggiungere alla schermata Home. Tutti i dati restano sul dispositivo (localStorage, chiave `liviu-app:v1`); da Impostazioni si esporta/importa un backup JSON.

## Schermate

| Tab | Cosa fa |
| --- | --- |
| **Oggi** | Messaggio di benvenuto in base all'ora (con messaggi speciali in rotazione), blocco della routine in corso e prossimo, promemoria attivi, statistiche (giornata, costanza, acqua), contatore acqua, checklist del giorno, prossimi promemoria, scorciatoie. |
| **Routine** | Timeline della giornata (Lun–Ven, Sabato, Domenica) con blocco corrente evidenziato e spunte. |
| **Nutrizione** | Target kcal/macro, contatore acqua 3 L, 5 pasti con ingredienti e preparazione, integratori mattina/sera, calendario medicine (sì ven–mar, no mer–gio), meal prep della domenica. |
| **Palestra** | Sessione del giorno (Upper/Lower/Push/Pull/Legs), varianti attive per pattern, log serie kg × rep, suggerimento di progressione secondo la scheda, rilevamento plateau dopo 2 sessioni senza progresso con cambio variante, deload ogni 6–8 settimane (−40% volume e carico), storico. |
| **Progressi** | Peso settimanale con grafico, costanza (streak e ultimi 14 giorni), migliori carichi per pattern, cambi variante, storico pesate. |
| **Impostazioni** | Notifiche del browser, tema, riavvio conteggio programma, backup, azzeramento con pressione prolungata. |

## Promemoria

Il motore controlla ogni 30 secondi i promemoria della giornata (integratori, medicine nei giorni giusti, pasti, acqua, skincare, studio, business, palestra, magnesio, porridge, sonno, spesa del sabato e meal prep della domenica, pesata del lunedì). Un promemoria sparisce da solo quando l'attività collegata viene spuntata. Se le notifiche sono attive, viene inviata anche una notifica del browser.

## Struttura

```
src/
  data/        profilo, routine, messaggi, nutrizione, scheda
  lib/         tempo, store (localStorage), promemoria, progressione, checklist
  components/
    reactbits/ HoldButton, GlassSurface, GlassIcons, SpecularButton, SpringCheck, Counter
    ui/        TabBar, CheckRow, ReminderBanner, WaterCounter, Sheet, WeightChart, Icon
  screens/     Today, Routine, Nutrition, Workout, Progress, Settings
  styles/      tokens.css (design token), global.css
```

## Personalizzazione

- Orari e blocchi: `src/data/routine.js`
- Messaggi: `src/data/messages.js`
- Pasti, integratori, medicine, meal prep: `src/data/nutrition.js`
- Scheda e regole di progressione: `src/data/program.js`, `src/lib/progression.js`
- Colori, tipografia, spaziature: `src/styles/tokens.css`

\# Apple-Inspired Design Handbook  
\*Manuale operativo per progettare una web app con chiarezza, gerarchia, coerenza e qualitÃ  percepita ispirate ad Apple â€” aggiornato al 29 settembre 2026.\*

\> \*\*Legenda di attendibilitÃ \*\*  
\>  
\> \- \*\*\[Ufficiale\]\*\*: regola o valore pubblicato da Apple.  
\> \- \*\*\[Standard web\]\*\*: requisito o best practice W3C/WCAG.  
\> \- \*\*\[Osservazione\]\*\*: pattern osservabile nelle app o nel sito Apple, non dichiarato come token pubblico.  
\> \- \*\*\[Proposta\]\*\*: specifica pronta allâ€™uso per questo design system; non Ã¨ un valore Apple.  
\> \- \*\*\[Inferenza\]\*\*: interpretazione progettuale motivata, non una dichiarazione di Apple.

Apple non pubblica un unico â€œfile di tokenâ€ universale. Il suo sistema Ã¨ lâ€™insieme di HIG, componenti nativi, font di sistema, colori semantici, SF Symbols, API adattive e risorse di design; copiare numeri isolati senza adottare semantica, adattivitÃ  e accessibilitÃ  produce solo una caricatura visiva. Le HIG attuali sono organizzate in principi, Foundations, Patterns, Components, Inputs e Technologies, con indicazioni specifiche per piattaforma.\[^1\]\[^2\]\[^3\]\[^4\]

\*\*\*  
\#\# 1\. Executive Summary  
Il modo piÃ¹ affidabile per ottenere una UX â€œApple-likeâ€ non Ã¨ aggiungere blur e angoli arrotondati, ma applicare una sequenza di decisioni:

1\. \*\*Definire il lavoro principale della schermata.\*\* Unâ€™unica prioritÃ  leggibile in pochi secondi.  
2\. \*\*Organizzare contenuto e azioni per semantica.\*\* Prima il contenuto, poi i controlli; prima le azioni frequenti, poi quelle occasionali.  
3\. \*\*Usare componenti familiari.\*\* Tab per aree principali, toolbar per azioni, sheet per task circoscritti, alert solo per decisioni critiche.  
4\. \*\*Usare token semantici e adattivi.\*\* \`text-primary\`, non â€œneroâ€; \`surface-elevated\`, non â€œ\#FFFâ€; layout per spazio disponibile, non per modello di dispositivo.  
5\. \*\*Progettare accessibilitÃ  e stati prima della decorazione.\*\* Testo al 200%, tastiera, screen reader, contrasto, Reduce Motion e Reduce Transparency.  
6\. \*\*Usare profonditÃ  e movimento per spiegare relazioni.\*\* Materiale, transizione e feedback devono comunicare gerarchia, origine, destinazione o stato.  
7\. \*\*Far recedere lâ€™interfaccia.\*\* Colore, icone e chrome non devono competere con il contenuto.

Il sistema Apple piÃ¹ recente usa \*\*Liquid Glass\*\* come layer funzionale per navigazione e controlli sopra il contenuto, con gerarchia, armonia e coerenza come obiettivi dichiarati. Il materiale Ã¨ dinamico e adattivo; non equivale a un semplice \`backdrop-filter: blur()\` applicato ovunque.\[^5\]\[^6\]\[^7\]\[^8\]

\*\*\*  
\#\# 2\. Apple Design Philosophy  
\#\#\# Matrice dei principi  
| Principio | Provenienza | Definizione e ragione | Manifestazione | Applicazione pratica | Violazione tipica |  
|---|---|---|---|---|---|  
| \*\*Clarity\*\* | Ufficiale, oggi espresso come â€œBe clear and directâ€ | Significato, gerarchia e azione devono essere immediati. Riduce interpretazioni e costi di apprendimento.\[^9\] | Testo leggibile, icone standard, etichette brevi, azione primaria evidente | Una schermata, un titolo descrittivo, un CTA dominante; verbi per le azioni | Icone ambigue, gerarchia piatta, copy ornamentale |  
| \*\*Deference\*\* | Principio storico HIG; oggi rinforzato da focus su contenuto e controlli limitati | Lâ€™UI serve il contenuto e non cerca attenzione per sÃ© | Chrome leggero, controlli contestuali, barre che recedono | Rimuovere bordi e decorazioni che non comunicano struttura | Dashboard piena di card, colori e ombre equivalenti |  
| \*\*Depth\*\* | Ufficiale nelle Foundations e nei materiali | Layer, movimento e materiale chiariscono posizione e relazione | Sheet sopra il parent, barre su materiale, zoom dalla sorgente | ProfonditÃ  solo quando esiste una relazione spaziale o modale | Ombre arbitrarie, glass su ogni container |  
| \*\*Simplicity\*\* | Ufficiale: â€œInclude just whatâ€™s necessaryâ€; Apple precisa che semplicitÃ  non significa minimalismo\[^9\] | Conservare ciÃ² che serve, non ridurre ciecamente | Default ragionevoli, pochi controlli iniziali, dettagli su richiesta | Tagliare passaggi e decisioni; mantenere perÃ² label e affordance | Nascondere tutto in menu o icone senza testo |  
| \*\*Consistency\*\* | Ufficiale e principio UX consolidato | Stesso significato â†’ stesso pattern, parola, colore e feedback | Componenti di sistema, convenzioni di piattaforma | Registry di componenti e termini; evitare varianti ad hoc | Tre stili di pulsante primario o â€œSalva/Conferma/Fattoâ€ equivalenti |  
| \*\*Hierarchy\*\* | Ufficiale in layout, tipografia e colori | Ordina importanza mediante posizione, scala, peso, contrasto e spazio | Titolo grande, gruppi, label primarie/secondarie | Limitare ogni schermata a 3 livelli visivi forti | Tutto bold, tutto colorato, troppi livelli |  
| \*\*Focus\*\* | Ufficiale: â€œKeep focusedâ€\[^9\] | Protegge il task principale e lâ€™attenzione | Poche azioni visibili, modalitÃ  per task circoscritti | Una primary action per regione; overflow per il secondario | CTA concorrenti e notifiche interne persistenti |  
| \*\*Direct manipulation\*\* | Ufficiale per gesti e ambienti spaziali | Agire sullâ€™oggetto Ã¨ piÃ¹ naturale che comandarlo altrove | Drag, pinch, swipe, reorder con feedback continuo | Consentire drag di una card e aggiornare il layout durante il gesto | Gesto nascosto senza alternativa o feedback |  
| \*\*Feedback\*\* | Ufficiale | Comunica ricezione, avanzamento, risultato e possibilitÃ  successive\[^10\] | Highlight, stato pressed, spinner, haptic, toast | Feedback entro il frame; stato persistente per operazioni asincrone | Tap senza risposta o spinner infinito |  
| \*\*Familiarity\*\* | Ufficiale: â€œBuild on what people knowâ€\[^9\] | Riusa modelli mentali e convenzioni | Back, tab, swipe, SF Symbols comuni | Innovare nel valore del prodotto, non nella meccanica di base | Reinventare checkbox, back o scrolling |  
| \*\*Accessibility\*\* | Ufficiale | Lâ€™esperienza deve essere intuitiva, percepibile e adattabile\[^11\] | Dynamic Type, VoiceOver, contrasto, input multipli | AccessibilitÃ  come constraint del sistema, non patch finale | Layout rotto al 200%, stato affidato solo al colore |  
| \*\*Content-first\*\* | Ufficiale per iOS e layout | Il contenuto determina struttura e prioritÃ ; controlli secondari restano disponibili con poco sforzo\[^12\] | Foto edge-to-edge, liste leggibili, barre separate dal content layer | Progettare prima la lettura/attivitÃ , poi la cornice | UI kit applicato prima di capire il contenuto |  
| \*\*Progressive disclosure\*\* | Ufficiale | Mostrare prima lâ€™essenziale e rivelare complessitÃ  quando serve\[^13\] | Disclosure, menu, sezioni espandibili, drill-down | Default semplice \+ â€œAvanzateâ€; filtri solo quando pertinenti | Nascondere azioni essenziali o mostrare 30 campi subito |  
| \*\*Minimalism\*\* | Principio UX, non sinonimo ufficiale di â€œAppleâ€ | Riduce rumore preservando informazione ad alto valore; NN/g raccomanda massimo rapporto segnale/rumore\[^14\] | Palette contenuta, spazio negativo, poche varianti | Eliminare elementi senza scopo verificabile | Minimalismo cosmetico che rimuove label e segnali |  
| \*\*Reduced cognitive load\*\* | UX consolidata; coerente con HIG | Ridurre memoria, scelte simultanee e ambiguitÃ  | Recognition, default, grouping, copy vicino al problema | Mostrare opzioni rilevanti, validare inline, rendere visibile lo stato | Costringere a ricordare dati fra schermate |  
\#\#\# Metodo di applicazione  
Per ogni schermata compilare prima una \*\*scheda dâ€™intento\*\*:

\- Obiettivo utente in una frase.  
\- Informazione piÃ¹ importante.  
\- Azione primaria.  
\- Azioni secondarie realmente frequenti.  
\- Stato iniziale, vuoto, caricamento, errore, successo e offline.  
\- Relazione con schermata precedente e successiva.  
\- Varianti con testo lungo, contenuto estremo e accessibilitÃ .

Se un elemento non supporta uno di questi punti, deve essere eliminato, posticipato o giustificato.

\*\*\*  
\#\# 3\. HIG Principles  
\#\#\# Struttura operativa delle HIG  
Le HIG sono una \*\*grammatica\*\*, non una galleria. Foundations tratta accessibilitÃ , colore, layout, materiali, motion, SF Symbols e tipografia; Components definisce oggetti riusabili; Patterns definisce flussi come onboarding, modalitÃ , notifiche, privacy e gestione account; Inputs copre touch, pointer, tastiera, remote, voce e altri dispositivi.\[^2\]\[^3\]\[^1\]  
\#\#\# Regola di selezione componenti  
| NecessitÃ  | Componente corretto | Non usare quando | Regole chiave |  
|---|---|---|---|  
| Navigare tra aree principali | \*\*Tab bar\*\* | Lâ€™elemento esegue unâ€™azione | Mantenerla visibile; preservare lo stack per tab; evitare overflow; non confonderla con toolbar.\[^15\] |  
| Azioni sulla vista corrente | \*\*Toolbar\*\* | Serve cambiare area primaria | Mostrare solo azioni essenziali; separare correttamente label testuali e simboli.\[^16\] |  
| Gerarchia master-detail | \*\*Sidebar / split view\*\* | Struttura piatta o schermo stretto senza valore | Sidebar max due livelli; aggiungere pane intermedio per gerarchie profonde.\[^17\]\[^18\] |  
| Task breve legato al contesto | \*\*Sheet\*\* | Task lungo e ramificato | Titolo esplicito; Cancel/Close; Done abbinato a Cancel; prevenire perdita dati.\[^19\]\[^20\] |  
| Informazione critica che richiede decisione | \*\*Alert\*\* | Informazione passiva, errore recuperabile inline, azione annullabile | Uso raro; messaggio conciso; Cancel per azione distruttiva.\[^21\] |  
| Azioni contestuali | \*\*Context menu\*\* | Azione primaria o non scopribile altrove | Solo comandi rilevanti e probabili, non deposito di opzioni rare.\[^22\] |  
| Scegliere un comando correlato a un pulsante | \*\*Pull-down/dropdown\*\* | Ci sono solo 1â€“2 opzioni o lâ€™azione Ã¨ primaria | Idealmente almeno 3 elementi; label brevi; distruttivo rosso e confermato.\[^23\] |  
| Ricercare contenuto | \*\*Search field\*\* | Dataset minuscolo e interamente scansionabile | Cerca mentre si digita se possibile; suggerimenti; risultati rilevanti prima; filtri contestuali.\[^24\] |  
| Stato binario persistente | \*\*Toggle\*\* | Lâ€™utente deve eseguire un comando istantaneo | Label descrive ciÃ² che controlla; differenza on/off non solo cromatica.\[^25\] |  
| Una scelta tra poche alternative | \*\*Segmented control / radio\*\* | Navigazione primaria complessa o troppe opzioni | Segmenti brevi e confrontabili; radio per opzioni esplicite nei form.\[^26\] |  
| Valore da un range | \*\*Slider\*\* | Serve precisione numerica assoluta senza input alternativo | Valore leggibile, min/max comprensibili, tastiera e input preciso dove necessario |  
| Selezione da valori discreti | \*\*Picker\*\* | Le opzioni sono poche e starebbero meglio come radio/segmenti | Usare liste scrollabili per valori distinti.\[^27\] |  
| Dato breve | \*\*Text field\*\* | Testo lungo o scelta giÃ  nota | Label persistente, hint, tastiera corretta, validazione vicina, ordine Tab logico.\[^28\] |  
| Processo in corso | \*\*Progress indicator\*\* | Non câ€™Ã¨ davvero attesa | Determinato quando possibile; movimento continuo; Cancel se sicuro.\[^29\] |  
\#\#\# Stati di esperienza  
\- \*\*Onboarding:\*\* insegnare facendo; preferire tips contestuali; rimandare setup non essenziale; chiedere permessi nel momento del bisogno.\[^30\]\[^31\]  
\- \*\*Empty state:\*\* spiegare lo stato e offrire un prossimo passo concreto; non mostrare una pagina â€œmortaâ€. Apple raccomanda copy chiaro e next step nelle schermate vuote.\[^32\]  
\- \*\*Loading:\*\* preservare la struttura con skeleton discreti per contenuti prevedibili; usare spinner per attivitÃ  brevi/indeterminate e barra determinata per task misurabili.  
\- \*\*Error:\*\* prevenire prima; poi messaggio vicino alla causa, senza colpa, con soluzione e contenuto utente preservato.\[^32\]\[^33\]  
\- \*\*Notification:\*\* informazione tempestiva e di alto valore; niente duplicati; niente dati sensibili; marketing solo con consenso; â€œTime Sensitiveâ€ solo per eventi realmente imminenti.\[^34\]\[^35\]  
\- \*\*Settings:\*\* lâ€™app deve funzionare con default sensati. Mettere nel flusso le preferenze frequenti; relegare a Settings configurazioni rare o globali.  
\- \*\*Authentication:\*\* preferire passkey/SSO, identificare il metodo nel testo del pulsante e non nascondere lâ€™alternativa.\[^36\]  
\#\#\# Anatomia universale  
Ogni componente interattivo deve avere:

1\. \*\*Ruolo semantico\*\* e nome accessibile.  
2\. \*\*Hit area\*\* distinta dallâ€™area visiva.  
3\. Stati \`rest\`, \`hover\`, \`pressed\`, \`focus-visible\`, \`disabled\`, \`loading\`, \`error/selected\` se pertinenti.  
4\. Feedback immediato e risultato verificabile.  
5\. Testo che puÃ² crescere almeno al 200% senza perdita di funzione.  
6\. Contrasto e differenziazione non affidati solo al colore.

\*\*\*  
\#\# 4\. Design System  
\#\#\# Cosa Ã¨ ufficiale  
Apple pubblica template ufficiali, color guide, font e libreria SF Symbols; i componenti nativi risolvono a runtime dimensioni, colori e comportamenti in base a piattaforma e contesto.\[^37\]\[^38\] I valori CSS proposti in questo manuale sono quindi una \*\*traduzione web\*\*, non una replica interna di UIKit/SwiftUI.  
\#\#\# Modello a quattro layer  
1\. \*\*Foundations:\*\* colore, tipo, spacing, radius, motion, elevation.  
2\. \*\*Semantics:\*\* \`text-primary\`, \`action-primary\`, \`surface-elevated\`, \`motion-feedback\`.  
3\. \*\*Components:\*\* Button, Input, List, Sheet.  
4\. \*\*Patterns:\*\* ricerca, checkout, onboarding, gestione errore, navigazione.

Mai collegare un componente direttamente a un valore grezzo se esiste un token semantico. Esempio: \`Button.danger â†’ color.action.destructive â†’ palette.red.500\`.

\*\*\*  
\#\# 5\. Typography  
\#\#\# Famiglia e comportamento  
\- \*\*SF Pro:\*\* font principale per iOS, iPadOS e macOS; il sistema gestisce optical sizing e tracking in base alla dimensione. Apple sconsiglia di forzare tracking nellâ€™app reale e raccomanda i text styles.\[^39\]  
\- \*\*SF Compact:\*\* forme ottimizzate per spazi compatti, particolarmente rilevanti su watchOS.  
\- \*\*SF Mono:\*\* codice, dati monospaziati e allineamento tabellare; non per body copy.  
\- \*\*SF Symbols:\*\* non Ã¨ un font testuale, ma un sistema di simboli progettato per integrarsi con San Francisco; oltre 7.000 simboli sono disponibili nelle risorse attuali.\[^37\]  
\- \*\*Dynamic Type:\*\* token tipografici semantici che scalano con preferenze utente; \`UIFontMetrics\` e gli stili SwiftUI consentono anche ai font custom di seguire la scala.\[^39\]\[^40\]  
\#\#\# Scala iOS di riferimento  
I nomi, size e weight di base sono text styles Apple; line-height e tracking riportati come proposta web quando non esposti stabilmente come token cross-platform. Non codificare questa tabella in unâ€™app nativa al posto delle API semantiche.

| Elemento | Size | Weight | Line height web | Tracking web | Uso | Stato |  
|---|---:|---:|---:|---:|---|---|  
| Large Title | 34 px | 400 | 41 px | \-0.02em | Titolo principale mobile | Size/style ufficiale; leading/tracking proposta |  
| Title 1 | 28 px | 400 | 34 px | \-0.015em | Titolo di sezione principale | Size/style ufficiale; resto proposta |  
| Title 2 | 22 px | 400 | 28 px | \-0.01em | Sottosezione | Size/style ufficiale; resto proposta |  
| Title 3 | 20 px | 400 | 25 px | \-0.008em | Card o gruppo | Size/style ufficiale; resto proposta |  
| Headline | 17 px | 600 | 22 px | \-0.004em | Label prominente | Size/weight ufficiali; resto proposta |  
| Body | 17 px | 400 | 25 px | 0 | Testo primario | Size/weight ufficiali; leading proposta |  
| Callout | 16 px | 400 | 22 px | 0 | Testo compatto | Size/style ufficiale; resto proposta |  
| Subheadline | 15 px | 400 | 20 px | 0 | Metadati importanti | Size/style ufficiale; resto proposta |  
| Footnote | 13 px | 400 | 18 px | 0.002em | Note e helper | Size/style ufficiale; resto proposta |  
| Caption 1 | 12 px | 400 | 16 px | 0.004em | Caption | Size/style ufficiale; resto proposta |  
| Caption 2 | 11 px | 400 | 13 px | 0.006em | Minimo testo UI | Size/style ufficiale; resto proposta |

Apple indica 17 pt come default e 11 pt come minimo per iOS/iPadOS; macOS 13/10 pt, tvOS 29/23 pt, visionOS 17/12 pt e watchOS 16/12 pt. Raccomanda Regular, Medium, Semibold o Bold, evitando pesi Light/Thin piccoli.\[^39\]  
\#\#\# Regole tipografiche  
\- Usare al massimo 2â€“3 size dominanti in una schermata.  
\- Gerarchia prima con size/weight, poi con colore; evitare di usare tutto insieme.  
\- Body web predefinito: 17/25; contenuto denso desktop: 15/22.  
\- Larghezza testo lungo: 45â€“75 caratteri; \*\*\[Proposta\]\*\* \`max-width: 68ch\`.  
\- Titoli multilinea: niente altezza fissa; bilanciare con \`text-wrap: balance\` dove supportato.  
\- Numeri comparativi: \`font-variant-numeric: tabular-nums\`.  
\- Non scaricare SF Pro per il web senza rispettarne la licenza; usare \`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif\` per ottenere il font di sistema sui dispositivi Apple.

\*\*\*  
\#\# 6\. Colors  
\#\#\# Sistema semantico  
Apple raccomanda colori dinamici semanticamente corretti, non hex rigidi. I background Primary/Secondary/Tertiary esprimono livelli di gerarchia; i colori si risolvono per Light, Dark e Increased Contrast.\[^41\]\[^42\]

| Ruolo | Light web | Dark web | Provenienza |  
|---|---|---|---|  
| \`--background\` | \`\#FFFFFF\` | \`\#000000\` | Valori iOS comunemente risolti; per web sono fallback osservativi |  
| \`--background-secondary\` | \`\#F2F2F7\` | \`\#1C1C1E\` | Fallback osservativi |  
| \`--surface\` | \`\#FFFFFF\` | \`\#1C1C1E\` | Proposta semantica |  
| \`--surface-elevated\` | \`\#FFFFFF\` | \`\#2C2C2E\` | Fallback/proposta |  
| \`--text-primary\` | \`\#000000\` | \`\#FFFFFF\` | Fallback osservativi |  
| \`--text-secondary\` | \`rgba(60,60,67,.60)\` | \`rgba(235,235,245,.60)\` | Fallback osservativi |  
| \`--text-tertiary\` | \`rgba(60,60,67,.30)\` | \`rgba(235,235,245,.30)\` | Fallback osservativi; verificare contrasto |  
| \`--separator\` | \`rgba(60,60,67,.29)\` | \`rgba(84,84,88,.60)\` | Fallback osservativi |  
| \`--accent\` | \`\#007AFF\` | \`\#0A84FF\` | System Blue iOS, fallback web |  
| \`--success\` | \`\#34C759\` | \`\#30D158\` | System Green, fallback web |  
| \`--warning\` | \`\#FF9500\` | \`\#FF9F0A\` | System Orange, fallback web |  
| \`--error\` | \`\#FF3B30\` | \`\#FF453A\` | System Red, fallback web |

Questi hex sono utili per una web app, ma non vanno presentati come sostituti dei colori dinamici UIKit. In unâ€™app Apple nativa usare le API \`label\`, \`secondaryLabel\`, \`systemBackground\`, \`secondarySystemBackground\`, \`separator\`, \`tint\` e relative varianti.  
\#\#\# Uso del colore  
\- 80â€“90% della UI deve essere neutra \*\*\[Proposta\]\*\*; lâ€™accento segnala interattivitÃ , selezione o brand.  
\- Un colore deve avere uno stesso significato nellâ€™intero prodotto; Apple sconsiglia esplicitamente di ridefinire i significati dei colori semantici.\[^41\]  
\- Stato non solo cromatico: aggiungere icona, testo, pattern, forma o posizione.  
\- Dark Mode non Ã¨ inversione: usare superfici gerarchiche, ridurre saturazione apparente e testare immagini/ombre.  
\- Target contrasto web: almeno 4.5:1 per testo normale e 3:1 per testo grande; componenti e indicatori grafici essenziali almeno 3:1.\[^43\]\[^44\]

\*\*\*  
\#\# 7\. Spacing & Layout  
\#\#\# Spacing  
Apple non documenta una scala universale 4/8 valida per ogni componente e piattaforma. Le HIG pubblicano valori contestuali â€” per esempio target e distanze â€” mentre i framework nativi applicano metriche proprie. La scala seguente Ã¨ quindi \*\*\[Proposta\]\*\*:

| Token | Valore | Uso prevalente |  
|---|---:|---|  
| \`space-1\` | 4 px | Micro-gap icona/stato |  
| \`space-2\` | 8 px | Icona-label, elementi stretti |  
| \`space-3\` | 12 px | Padding compatto, gap controlli |  
| \`space-4\` | 16 px | Margine mobile, padding standard |  
| \`space-5\` | 20 px | Gruppi interni ampi |  
| \`space-6\` | 24 px | Sezioni piccole, card desktop |  
| \`space-8\` | 32 px | Separazione gruppi |  
| \`space-10\` | 40 px | Sezioni medie |  
| \`space-12\` | 48 px | Hero compatto |  
| \`space-16\` | 64 px | Sezioni ampie |  
\#\#\# Regole di ritmo  
\- Spazio interno di un gruppo \< spazio fra gruppi.  
\- Allineare a pochi assi forti; evitare â€œquasi allineamentiâ€.  
\- Margine mobile base \*\*\[Proposta\]\*\* 16 px; 20â€“24 px per schermate editoriali.  
\- Padding card \*\*\[Proposta\]\*\* 16 px mobile, 20â€“24 px desktop.  
\- Gap form \*\*\[Proposta\]\*\* 16 px tra campi, 24â€“32 px tra sezioni.  
\- Non usare card per ottenere spacing: usare prima grouping, heading e whitespace.  
\#\#\# Sizing e target  
Apple raccomanda per iOS/iPadOS un controllo

BOTTONE DELETE:   
\#\# Integrate the \<HoldButton /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: HoldButton  
\#\#\# Variant: JavaScript \+ CSS

\---

\#\#\# Usage Example  
\`\`\`jsx  
import HoldButton from './HoldButton';

\<HoldButton  
  doneLabel="Deleted"  
  backgroundColor="\#27272a"  
  fillColor="\#F43F5E"  
  textColor="\#f5f5f5"  
  fillTextColor="\#ffffff"  
  size="md"  
  radius={14}  
  fillDirection="right"  
  holdTime={2000}  
  releaseTime={200}  
  pressScale={0.97}  
  wave  
  waveAmplitude={6}  
  glow  
  resetAfter={1200}  
  onHold={() \=\> console.log('confirmed')}  
\>  
  Hold to delete  
\</HoldButton\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| children | ReactNode | "Hold to delete" | Label shown while idle and holding. |  
| doneLabel | ReactNode | "Deleted" | Label that blurs in when the hold completes. |  
| icon | ReactNode | null | Optional icon rendered before the idle label. |  
| doneIcon | ReactNode | null | Optional icon rendered before the done label. |  
| backgroundColor | string | "\#27272a" | Button body colour. |  
| fillColor | string | "\#5227FF" | Colour of the liquid fill, its wave, the glow and the focus ring. |  
| textColor | string | "\#f5f5f5" | Label colour outside the fill. |  
| fillTextColor | string | "\#ffffff" | Label colour inside the fill; the ink inverts as the edge crosses it. |  
| size | "sm" | "md" | "lg" | "md" | Height, padding and font size preset. |  
| radius | number | 14 | Corner radius in pixels of the body, the fill and the focus ring. |  
| fillDirection | "right" | "up" | "right" | Whether the liquid sweeps left to right or rises from the bottom. |  
| holdTime | number | 2000 | How long the press must last, in milliseconds. The fill moves at constant speed. |  
| releaseTime | number | 200 | How fast the fill snaps back on an early release or a reset, in milliseconds. |  
| pressScale | number | 0.97 | Squash of the button while a pointer holds it. 1 disables it. |  
| wave | boolean | true | Scrolling meniscus on the leading edge of the fill. |  
| waveAmplitude | number | 6 | Height of the wave crests in pixels. |  
| glow | boolean | true | Glow that charges with the hold and pulses once on completion. |  
| resetAfter | number | 1200 | Milliseconds the done state stays before the button resets. 0 keeps it done. |  
| disabled | boolean | false | Dims the button and ignores input. |  
| onHold | () \=\> void | \- | Called once, on the frame the fill completes. |  
| onTap | () \=\> void | \- | Called on a release shorter than 250ms that did not drift away. |  
| className | string | "" | Extra classes for the button. |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import './HoldButton.css';

const TAP\_MS \= 250;  
const HIT\_PAD \= 10;  
const LINEAR \= t \=\> t;  
const EASE\_OUT \= t \=\> 1 \- Math.pow(1 \- t, 3);

export default function HoldButton({  
  children \= 'Hold to delete',  
  doneLabel \= 'Deleted',  
  icon \= null,  
  doneIcon \= null,  
  backgroundColor \= '\#27272a',  
  fillColor \= '\#5227FF',  
  textColor \= '\#f5f5f5',  
  fillTextColor \= '\#ffffff',  
  size \= 'md',  
  radius \= 14,  
  fillDirection \= 'right',  
  holdTime \= 2000,  
  releaseTime \= 200,  
  pressScale \= 0.97,  
  wave \= true,  
  waveAmplitude \= 6,  
  glow \= true,  
  resetAfter \= 1200,  
  disabled \= false,  
  onHold,  
  onTap,  
  className \= ''  
}) {  
  const \[phase, setPhase\] \= useState('idle');  
  const \[input, setInput\] \= useState(null);  
  const phaseRef \= useRef('idle');  
  const inputRef \= useRef(null);  
  const buttonRef \= useRef(null);  
  const gesture \= useRef({ pointerId: null, start: 0, rect: null });  
  const timers \= useRef({ complete: 0, reset: 0 });  
  const hintId \= useId();

  const go \= (next, kind \= null) \=\> {  
    phaseRef.current \= next;  
    inputRef.current \= kind;  
    setPhase(next);  
    setInput(kind);  
  };

  const clearTimers \= () \=\> {  
    clearTimeout(timers.current.complete);  
    clearTimeout(timers.current.reset);  
  };

  const motion \= useRef({ raf: 0, p: 0, from: 0, to: 0, start: 0 });  
  const drive \= (to, duration, ease) \=\> {  
    const m \= motion.current;  
    cancelAnimationFrame(m.raf);  
    m.from \= m.p;  
    m.to \= to;  
    m.start \= performance.now();  
    const step \= now \=\> {  
      const t \= duration \> 0 ? Math.min(1, (now \- m.start) / duration) : 1;  
      m.p \= m.from \+ (m.to \- m.from) \* ease(t);  
      buttonRef.current?.style.setProperty('--hb-p', m.p.toFixed(4));  
      if (t \< 1\) {  
        m.raf \= requestAnimationFrame(step);  
        return;  
      }  
      m.raf \= 0;  
      if (m.to \=== 1\) complete();  
    };  
    m.raf \= requestAnimationFrame(step);  
  };

  const complete \= () \=\> {  
    if (phaseRef.current \!== 'holding') return;  
    if (performance.now() \- gesture.current.start \< holdTime \- 50\) return;  
    clearTimers();  
    go('done', inputRef.current);  
    onHold?.();  
    if (resetAfter \> 0\) {  
      timers.current.reset \= setTimeout(() \=\> {  
        go('idle');  
        drive(0, releaseTime, EASE\_OUT);  
      }, resetAfter);  
    }  
  };

  const begin \= kind \=\> {  
    if (disabled || phaseRef.current \!== 'idle') return false;  
    const button \= buttonRef.current;  
    if (\!button) return false;  
    gesture.current.start \= performance.now();  
    gesture.current.rect \= button.getBoundingClientRect();  
    go('holding', kind);  
    drive(1, holdTime, LINEAR);  
    timers.current.complete \= setTimeout(complete, holdTime \+ 100);  
    return true;  
  };

  const release \= ({ drifted \= false } \= {}) \=\> {  
    if (phaseRef.current \!== 'holding') return;  
    clearTimers();  
    const held \= performance.now() \- gesture.current.start;  
    go('idle');  
    drive(0, releaseTime, EASE\_OUT);  
    if (\!drifted && held \< TAP\_MS) onTap?.();  
  };  
  const releaseRef \= useRef(release);  
  releaseRef.current \= release;

  const handlePointerDown \= e \=\> {  
    if (e.button \!== 0 || \!e.isPrimary || gesture.current.pointerId \!== null) return;  
    if (\!begin('pointer')) return;  
    gesture.current.pointerId \= e.pointerId;  
    try {  
      e.currentTarget.setPointerCapture(e.pointerId);  
    } catch {}  
  };

  const endPointer \= (e, options) \=\> {  
    if (e.pointerId \!== gesture.current.pointerId) return;  
    gesture.current.pointerId \= null;  
    try {  
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);  
    } catch {}  
    release(options);  
  };

  const handlePointerMove \= e \=\> {  
    if (e.pointerId \!== gesture.current.pointerId) return;  
    const r \= gesture.current.rect;  
    if (\!r) return;  
    const out \=  
      e.clientX \< r.left \- HIT\_PAD ||  
      e.clientX \> r.right \+ HIT\_PAD ||  
      e.clientY \< r.top \- HIT\_PAD ||  
      e.clientY \> r.bottom \+ HIT\_PAD;  
    if (out) endPointer(e, { drifted: true });  
  };

  const handlePointerLeave \= e \=\> {  
    if (e.pointerType \!== 'touch') endPointer(e, { drifted: true });  
  };

  const handleKeyDown \= e \=\> {  
    if (e.key \=== 'Escape') {  
      if (inputRef.current \=== 'key') release({ drifted: true });  
      return;  
    }  
    if (e.key \=== ' ' || e.key \=== 'Enter') {  
      e.preventDefault();  
      if (\!e.repeat) begin('key');  
    }  
  };

  const handleKeyUp \= e \=\> {  
    if (e.key \=== ' ' || e.key \=== 'Enter') {  
      e.preventDefault();  
      if (inputRef.current \=== 'key') release();  
    }  
  };

  useLayoutEffect(() \=\> {  
    const button \= buttonRef.current;  
    if (\!button) return undefined;  
    const measure \= () \=\> {  
      button.style.setProperty('--hb-w', \`\${button.offsetWidth}px\`);  
      button.style.setProperty('--hb-h', \`\${button.offsetHeight}px\`);  
    };  
    measure();  
    const ro \= new ResizeObserver(measure);  
    ro.observe(button);  
    return () \=\> ro.disconnect();  
  }, \[\]);

  useEffect(() \=\> {  
    if (phase \!== 'holding') return undefined;  
    const cancel \= () \=\> releaseRef.current({ drifted: true });  
    const onVisibility \= () \=\> {  
      if (document.hidden) cancel();  
    };  
    window.addEventListener('blur', cancel);  
    document.addEventListener('visibilitychange', onVisibility);  
    return () \=\> {  
      window.removeEventListener('blur', cancel);  
      document.removeEventListener('visibilitychange', onVisibility);  
    };  
  }, \[phase\]);

  useEffect(() \=\> {  
    const t \= timers.current;  
    const m \= motion.current;  
    return () \=\> {  
      clearTimeout(t.complete);  
      clearTimeout(t.reset);  
      cancelAnimationFrame(m.raf);  
    };  
  }, \[\]);

  const direction \= fillDirection \=== 'up' ? 'up' : 'right';  
  const labels \= (  
    \<\>  
      \<span className="hold-button\_\_idle" aria-hidden={phase \=== 'done'}\>  
        {icon ? \<span className="hold-button\_\_icon"\>{icon}\</span\> : null}  
        {children}  
      \</span\>  
      \<span className="hold-button\_\_done" aria-hidden={phase \!== 'done'}\>  
        {doneIcon ? \<span className="hold-button\_\_icon"\>{doneIcon}\</span\> : null}  
        {doneLabel}  
      \</span\>  
    \</\>  
  );

  return (  
    \<button  
      ref={buttonRef}  
      type="button"  
      disabled={disabled}  
      className={\`hold-button hold-button--\${size}\${className ? \` \${className}\` : ''}\`}  
      data-phase={phase}  
      data-input={input ?? undefined}  
      data-direction={direction}  
      data-glow={glow ? 'true' : undefined}  
      aria-describedby={hintId}  
      style={{  
        '--hb-radius': \`\${radius}px\`,  
        '--hb-bg': backgroundColor,  
        '--hb-fill': fillColor,  
        '--hb-text': textColor,  
        '--hb-fill-text': fillTextColor,  
        '--hb-hold': \`\${holdTime}ms\`,  
        '--hb-cycles': holdTime / 1100,  
        '--hb-release': \`\${releaseTime}ms\`,  
        '--hb-press': pressScale,  
        '--hb-wave': \`\${wave ? waveAmplitude : 0}px\`  
      }}  
      onPointerDown={handlePointerDown}  
      onPointerMove={handlePointerMove}  
      onPointerUp={e \=\> endPointer(e)}  
      onPointerCancel={e \=\> endPointer(e, { drifted: true })}  
      onLostPointerCapture={e \=\> endPointer(e, { drifted: true })}  
      onPointerLeave={handlePointerLeave}  
      onKeyDown={handleKeyDown}  
      onKeyUp={handleKeyUp}  
      onContextMenu={e \=\> e.preventDefault()}  
    \>  
      \<span className="hold-button\_\_pulse" aria-hidden="true" /\>  
      \<span className="hold-button\_\_label"\>{labels}\</span\>  
      \<span className="hold-button\_\_clip" aria-hidden="true"\>  
        \<span className="hold-button\_\_fill"\>  
          \<span className="hold-button\_\_label hold-button\_\_label--fill"\>{labels}\</span\>  
        \</span\>  
        \<span className="hold-button\_\_crest" aria-hidden="true"\>  
          \<span className="hold-button\_\_label hold-button\_\_label--fill"\>{labels}\</span\>  
        \</span\>  
      \</span\>  
      \<span id={hintId} className="hold-button\_\_sr"\>  
        Press and hold for {Math.round(holdTime / 100\) / 10} seconds to confirm  
      \</span\>  
    \</button\>  
  );  
}

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.hold-button {  
  \--hb-radius: 14px;  
  \--hb-bg: \#27272a;  
  \--hb-fill: \#5227ff;  
  \--hb-text: \#f5f5f5;  
  \--hb-fill-text: \#ffffff;  
  \--hb-hold: 2000ms;  
  \--hb-release: 200ms;  
  \--hb-press: 0.97;  
  \--hb-wave: 6px;  
  \--hb-w: 0px;  
  \--hb-h: 0px;  
  \--hb-cycles: 2;  
  \--hb-p: 0;  
  \--hb-ease-out: cubic-bezier(0.23, 1, 0.32, 1);  
  \--hb-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);  
  \--hb-glow:  
    inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 32px \-6px color-mix(in srgb, var(--hb-fill) 70%, transparent);

  position: relative;  
  display: inline-grid;  
  place-items: center;  
  isolation: isolate;  
  margin: 0;  
  border: 0;  
  border-radius: var(--hb-radius);  
  background: var(--hb-bg);  
  color: var(--hb-text);  
  font-family: inherit;  
  font-weight: 500;  
  letter-spacing: 0.01em;  
  line-height: 1;  
  box-shadow: var(--hb-shadow);  
  cursor: pointer;  
  outline: none;  
  user-select: none;  
  \-webkit-user-select: none;  
  \-webkit-touch-callout: none;  
  \-webkit-tap-highlight-color: transparent;  
  touch-action: manipulation;  
  transition:  
    transform 160ms var(--hb-ease-out),  
    background-color 160ms ease,  
    box-shadow var(--hb-release) var(--hb-ease-out);  
}

.hold-button--sm {  
  height: 36px;  
  padding: 0 16px;  
  font-size: 13px;  
}

.hold-button--md {  
  height: 44px;  
  padding: 0 22px;  
  font-size: 15px;  
}

.hold-button--lg {  
  height: 52px;  
  padding: 0 28px;  
  font-size: 17px;  
}

@media (hover: hover) and (pointer: fine) {  
  .hold-button:not(:disabled):hover {  
    background: color-mix(in srgb, var(--hb-bg) 92%, \#fff);  
  }  
}

.hold-button\[data-phase='holding'\]\[data-input='pointer'\] {  
  transform: scale(var(--hb-press));  
}

.hold-button\[data-glow='true'\]\[data-phase='holding'\],  
.hold-button\[data-glow='true'\]\[data-phase='done'\] {  
  box-shadow: var(--hb-glow);  
}

.hold-button\[data-glow='true'\]\[data-phase='holding'\] {  
  transition:  
    transform 160ms var(--hb-ease-out),  
    background-color 160ms ease,  
    box-shadow var(--hb-hold) linear;  
}

.hold-button:focus-visible {  
  outline: 2px solid var(--hb-fill);  
  outline-offset: 3px;  
}

.hold-button:disabled {  
  opacity: 0.5;  
  cursor: default;  
  pointer-events: none;  
}

.hold-button\_\_pulse {  
  position: absolute;  
  inset: 0;  
  z-index: 0;  
  border-radius: var(--hb-radius);  
  pointer-events: none;  
  opacity: 0;  
}

.hold-button\[data-glow='true'\]\[data-phase='done'\] .hold-button\_\_pulse {  
  animation: hb-pulse 600ms var(--hb-ease-out) forwards;  
}

@keyframes hb-pulse {  
  from {  
    opacity: 1;  
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--hb-fill) 55%, transparent);  
  }  
  to {  
    opacity: 0;  
    box-shadow: 0 0 0 14px color-mix(in srgb, var(--hb-fill) 0%, transparent);  
  }  
}

.hold-button\_\_label {  
  position: relative;  
  z-index: 2;  
  display: grid;  
  place-items: center;  
}

.hold-button\_\_label \> span {  
  grid-area: 1 / 1;  
  display: inline-flex;  
  align-items: center;  
  gap: 8px;  
  white-space: nowrap;  
  transition:  
    opacity 200ms ease,  
    filter 200ms ease;  
}

.hold-button\_\_icon {  
  display: inline-flex;  
  flex: none;  
}

.hold-button\_\_icon \> svg {  
  display: block;  
}

.hold-button\_\_done {  
  opacity: 0;  
  filter: blur(2px);  
}

.hold-button\[data-phase='done'\] .hold-button\_\_idle {  
  opacity: 0;  
  filter: blur(2px);  
}

.hold-button\[data-phase='done'\] .hold-button\_\_done {  
  opacity: 1;  
  filter: blur(0);  
}

.hold-button\_\_clip {  
  position: absolute;  
  inset: 0;  
  z-index: 3;  
  clip-path: inset(0 round var(--hb-radius));  
  pointer-events: none;  
}

.hold-button\_\_fill {  
  position: absolute;  
  inset: 0;  
  display: grid;  
  place-items: center;  
  background: var(--hb-fill);  
  color: var(--hb-fill-text);  
  clip-path: inset(  
    0 calc((1 \- var(--hb-p)) \* (100% \+ 0.75 \* var(--hb-wave)) \- var(--hb-p) \* 0.25 \* var(--hb-wave)) 0 0  
  );  
}

.hold-button\[data-direction='up'\] .hold-button\_\_fill {  
  clip-path: inset(  
    calc((1 \- var(--hb-p)) \* (100% \+ 0.75 \* var(--hb-wave)) \- var(--hb-p) \* 0.25 \* var(--hb-wave)) 0 0 0  
  );  
}

.hold-button\_\_crest {  
  position: absolute;  
  inset: 0;  
  display: grid;  
  place-items: center;  
  background: var(--hb-fill);  
  color: var(--hb-fill-text);  
  \-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");  
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='200' viewBox='0 0 20 200' preserveAspectRatio='none'%3E%3Cpath d='M0 0H10C18 8 18 25.3 10 33.3S2 58.7 10 66.7S18 92 10 100S2 125.3 10 133.3S18 158.7 10 166.7S2 192 10 200H0Z'/%3E%3C/svg%3E");  
  \-webkit-mask-repeat: repeat-y;  
  mask-repeat: repeat-y;  
  \-webkit-mask-size: var(--hb-wave) calc(var(--hb-h) \* 2);  
  mask-size: var(--hb-wave) calc(var(--hb-h) \* 2);  
  \-webkit-mask-position-x: calc(-1 \* var(--hb-wave) \+ var(--hb-p) \* (var(--hb-w) \+ var(--hb-wave)));  
  mask-position-x: calc(-1 \* var(--hb-wave) \+ var(--hb-p) \* (var(--hb-w) \+ var(--hb-wave)));  
  \-webkit-mask-position-y: calc(-1 \* var(--hb-p) \* var(--hb-cycles) \* var(--hb-h));  
  mask-position-y: calc(-1 \* var(--hb-p) \* var(--hb-cycles) \* var(--hb-h));  
}

.hold-button\[data-direction='up'\] .hold-button\_\_crest {  
  \-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");  
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='20' viewBox='0 0 200 20' preserveAspectRatio='none'%3E%3Cpath d='M0 20V10C12 2 38 2 50 10S88 18 100 10S138 2 150 10S188 18 200 10V20Z'/%3E%3C/svg%3E");  
  \-webkit-mask-repeat: repeat-x;  
  mask-repeat: repeat-x;  
  \-webkit-mask-size: calc(var(--hb-w) \* 2\) var(--hb-wave);  
  mask-size: calc(var(--hb-w) \* 2\) var(--hb-wave);  
  \-webkit-mask-position-x: calc(-1 \* var(--hb-p) \* var(--hb-cycles) \* var(--hb-w));  
  mask-position-x: calc(-1 \* var(--hb-p) \* var(--hb-cycles) \* var(--hb-w));  
  \-webkit-mask-position-y: calc(var(--hb-h) \- var(--hb-p) \* (var(--hb-h) \+ var(--hb-wave)));  
  mask-position-y: calc(var(--hb-h) \- var(--hb-p) \* (var(--hb-h) \+ var(--hb-wave)));  
}

.hold-button\_\_label--fill {  
  z-index: auto;  
}

.hold-button\_\_sr {  
  position: absolute;  
  width: 1px;  
  height: 1px;  
  overflow: hidden;  
  clip-path: inset(50%);  
  white-space: nowrap;  
}

@media (prefers-contrast: more) {  
  .hold-button {  
    outline: 1px solid var(--hb-text);  
  }  
}

@media (prefers-reduced-motion: reduce) {  
  .hold-button {  
    transition:  
      background-color 160ms ease,  
      box-shadow var(--hb-release) ease;  
    transform: none \!important;  
  }

  .hold-button\_\_fill,  
  .hold-button\[data-direction='up'\] .hold-button\_\_fill {  
    clip-path: inset(0);  
    opacity: 0;  
    transition: opacity var(--hb-release) ease;  
  }

  .hold-button\_\_crest {  
    display: none;  
  }

  .hold-button\[data-phase='holding'\] .hold-button\_\_fill,  
  .hold-button\[data-phase='done'\] .hold-button\_\_fill {  
    opacity: 1;  
    transition: opacity var(--hb-hold) linear;  
  }

  .hold-button\_\_pulse {  
    animation: none \!important;  
  }

  .hold-button\_\_label \> span {  
    transition: opacity 200ms ease;  
    filter: none \!important;  
  }  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

GLASS APPLE: \#\# Integrate the \<GlassSurface /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: GlassSurface  
\#\#\# Variant: JavaScript \+ CSS

\---

\#\#\# Usage Example  
\`\`\`jsx  
import GlassSurface from './GlassSurface'

// Basic usage  
\<GlassSurface   
  width={300}   
  height={200}  
  borderRadius={24}  
  className="my-custom-class"  
\>  
  \<h2\>Glass Surface Content\</h2\>  
\</GlassSurface\>

// Custom displacement effects  
\<GlassSurface  
  displace={15}  
  distortionScale={-150}  
  redOffset={5}  
  greenOffset={15}  
  blueOffset={25}  
  brightness={60}  
  opacity={0.8}  
  mixBlendMode="screen"  
\>  
  \<span\>Advanced Glass Distortion\</span\>  
\</GlassSurface\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| children | React.ReactNode | undefined | Content to display inside the glass surface |  
| width | number | string | 200 | Width of the glass surface (pixels or CSS value like '100%') |  
| height | number | string | 80 | Height of the glass surface (pixels or CSS value like '100vh') |  
| borderRadius | number | 20 | Border radius in pixels |  
| borderWidth | number | 0.07 | Border width factor for displacement map |  
| brightness | number | 50 | Brightness percentage for displacement map |  
| opacity | number | 0.93 | Opacity of displacement map elements |  
| blur | number | 11 | Input blur amount in pixels |  
| displace | number | 0 | Output blur (stdDeviation) |  
| backgroundOpacity | number | 0 | Background frost opacity (0-1) |  
| saturation | number | 1 | Backdrop filter saturation factor |  
| distortionScale | number | \-180 | Main displacement scale |  
| redOffset | number | 0 | Red channel extra displacement offset |  
| greenOffset | number | 10 | Green channel extra displacement offset |  
| blueOffset | number | 20 | Blue channel extra displacement offset |  
| xChannel | 'R' | 'G' | 'B' | 'R' | X displacement channel selector |  
| yChannel | 'R' | 'G' | 'B' | 'G' | Y displacement channel selector |  
| mixBlendMode | BlendMode | 'difference' | Mix blend mode for displacement map |  
| className | string | '' | Additional CSS class names |  
| style | React.CSSProperties | {} | Inline styles object |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

/\* eslint-disable react-hooks/exhaustive-deps \*/  
import { useEffect, useState, useRef, useId } from 'react';  
import './GlassSurface.css';

const GlassSurface \= ({  
  children,  
  width \= 200,  
  height \= 80,  
  borderRadius \= 20,  
  borderWidth \= 0.07,  
  brightness \= 50,  
  opacity \= 0.93,  
  blur \= 11,  
  displace \= 0,  
  backgroundOpacity \= 0,  
  saturation \= 1,  
  distortionScale \= \-180,  
  redOffset \= 0,  
  greenOffset \= 10,  
  blueOffset \= 20,  
  xChannel \= 'R',  
  yChannel \= 'G',  
  mixBlendMode \= 'difference',  
  className \= '',  
  style \= {}  
}) \=\> {  
  const uniqueId \= useId().replace(/:/g, '-');  
  const filterId \= \`glass-filter-\${uniqueId}\`;  
  const redGradId \= \`red-grad-\${uniqueId}\`;  
  const blueGradId \= \`blue-grad-\${uniqueId}\`;

  const \[svgSupported, setSvgSupported\] \= useState(false);

  const containerRef \= useRef(null);  
  const feImageRef \= useRef(null);  
  const redChannelRef \= useRef(null);  
  const greenChannelRef \= useRef(null);  
  const blueChannelRef \= useRef(null);  
  const gaussianBlurRef \= useRef(null);

  const generateDisplacementMap \= () \=\> {  
    const rect \= containerRef.current?.getBoundingClientRect();  
    const actualWidth \= rect?.width || 400;  
    const actualHeight \= rect?.height || 200;  
    const edgeSize \= Math.min(actualWidth, actualHeight) \* (borderWidth \* 0.5);

    const svgContent \= \`  
      \<svg viewBox="0 0 \${actualWidth} \${actualHeight}" xmlns="http://www.w3.org/2000/svg"\>  
        \<defs\>  
          \<linearGradient id="\${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%"\>  
            \<stop offset="0%" stop-color="\#0000"/\>  
            \<stop offset="100%" stop-color="red"/\>  
          \</linearGradient\>  
          \<linearGradient id="\${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%"\>  
            \<stop offset="0%" stop-color="\#0000"/\>  
            \<stop offset="100%" stop-color="blue"/\>  
          \</linearGradient\>  
        \</defs\>  
        \<rect x="0" y="0" width="\${actualWidth}" height="\${actualHeight}" fill="black"\>\</rect\>  
        \<rect x="0" y="0" width="\${actualWidth}" height="\${actualHeight}" rx="\${borderRadius}" fill="url(\#\${redGradId})" /\>  
        \<rect x="0" y="0" width="\${actualWidth}" height="\${actualHeight}" rx="\${borderRadius}" fill="url(\#\${blueGradId})" style="mix-blend-mode: \${mixBlendMode}" /\>  
        \<rect x="\${edgeSize}" y="\${edgeSize}" width="\${actualWidth \- edgeSize \* 2}" height="\${actualHeight \- edgeSize \* 2}" rx="\${borderRadius}" fill="hsl(0 0% \${brightness}% / \${opacity})" style="filter:blur(\${blur}px)" /\>  
      \</svg\>  
    \`;

    return \`data:image/svg+xml,\${encodeURIComponent(svgContent)}\`;  
  };

  const updateDisplacementMap \= () \=\> {  
    feImageRef.current?.setAttribute('href', generateDisplacementMap());  
  };

  useEffect(() \=\> {  
    updateDisplacementMap();  
    \[  
      { ref: redChannelRef, offset: redOffset },  
      { ref: greenChannelRef, offset: greenOffset },  
      { ref: blueChannelRef, offset: blueOffset }  
    \].forEach(({ ref, offset }) \=\> {  
      if (ref.current) {  
        ref.current.setAttribute('scale', (distortionScale \+ offset).toString());  
        ref.current.setAttribute('xChannelSelector', xChannel);  
        ref.current.setAttribute('yChannelSelector', yChannel);  
      }  
    });

    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());  
  }, \[  
    width,  
    height,  
    borderRadius,  
    borderWidth,  
    brightness,  
    opacity,  
    blur,  
    displace,  
    distortionScale,  
    redOffset,  
    greenOffset,  
    blueOffset,  
    xChannel,  
    yChannel,  
    mixBlendMode  
  \]);

  useEffect(() \=\> {  
    if (\!containerRef.current) return;

    const resizeObserver \= new ResizeObserver(() \=\> {  
      setTimeout(updateDisplacementMap, 0);  
    });

    resizeObserver.observe(containerRef.current);

    return () \=\> {  
      resizeObserver.disconnect();  
    };  
  }, \[\]);

  useEffect(() \=\> {  
    setTimeout(updateDisplacementMap, 0);  
  }, \[width, height\]);

  useEffect(() \=\> {  
    setSvgSupported(supportsSVGFilters());  
  }, \[\]);

  const supportsSVGFilters \= () \=\> {  
    if (typeof window \=== 'undefined' || typeof document \=== 'undefined') {  
      return false;  
    }

    const isWebkit \= /Safari/.test(navigator.userAgent) && \!/Chrome/.test(navigator.userAgent);  
    const isFirefox \= /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {  
      return false;  
    }

    const div \= document.createElement('div');  
    div.style.backdropFilter \= \`url(\#\${filterId})\`;

    return div.style.backdropFilter \!== '';  
  };

  const containerStyle \= {  
    ...style,  
    width: typeof width \=== 'number' ? \`\${width}px\` : width,  
    height: typeof height \=== 'number' ? \`\${height}px\` : height,  
    borderRadius: \`\${borderRadius}px\`,  
    '--glass-frost': backgroundOpacity,  
    '--glass-saturation': saturation,  
    '--filter-id': \`url(\#\${filterId})\`  
  };

  return (  
    \<div  
      ref={containerRef}  
      className={\`glass-surface \${svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback'} \${className}\`}  
      style={containerStyle}  
    \>  
      \<svg className="glass-surface\_\_filter" xmlns="http://www.w3.org/2000/svg"\>  
        \<defs\>  
          \<filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%"\>  
            \<feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" /\>

            \<feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" /\>  
            \<feColorMatrix  
              in="dispRed"  
              type="matrix"  
              values="1 0 0 0 0  
                      0 0 0 0 0  
                      0 0 0 0 0  
                      0 0 0 1 0"  
              result="red"  
            /\>

            \<feDisplacementMap  
              ref={greenChannelRef}  
              in="SourceGraphic"  
              in2="map"  
              id="greenchannel"  
              result="dispGreen"  
            /\>  
            \<feColorMatrix  
              in="dispGreen"  
              type="matrix"  
              values="0 0 0 0 0  
                      0 1 0 0 0  
                      0 0 0 0 0  
                      0 0 0 1 0"  
              result="green"  
            /\>

            \<feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" /\>  
            \<feColorMatrix  
              in="dispBlue"  
              type="matrix"  
              values="0 0 0 0 0  
                      0 0 0 0 0  
                      0 0 1 0 0  
                      0 0 0 1 0"  
              result="blue"  
            /\>

            \<feBlend in="red" in2="green" mode="screen" result="rg" /\>  
            \<feBlend in="rg" in2="blue" mode="screen" result="output" /\>  
            \<feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" /\>  
          \</filter\>  
        \</defs\>  
      \</svg\>

      \<div className="glass-surface\_\_content"\>{children}\</div\>  
    \</div\>  
  );  
};

export default GlassSurface;

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.glass-surface {  
  position: relative;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  overflow: hidden;  
  transition: opacity 0.26s ease-out;  
}

.glass-surface\_\_filter {  
  width: 100%;  
  height: 100%;  
  pointer-events: none;  
  position: absolute;  
  inset: 0;  
  opacity: 0;  
  z-index: \-1;  
}

.glass-surface\_\_content {  
  width: 100%;  
  height: 100%;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  padding: 0.5rem;  
  border-radius: inherit;  
  position: relative;  
  z-index: 1;  
}

.glass-surface--svg {  
  background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));  
  backdrop-filter: var(--filter-id, url(\#glass-filter)) saturate(var(--glass-saturation, 1));  
  box-shadow:  
    0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))  
      inset,  
    0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))  
      inset,  
    0px 4px 16px rgba(17, 17, 26, 0.05),  
    0px 8px 24px rgba(17, 17, 26, 0.05),  
    0px 16px 56px rgba(17, 17, 26, 0.05),  
    0px 4px 16px rgba(17, 17, 26, 0.05) inset,  
    0px 8px 24px rgba(17, 17, 26, 0.05) inset,  
    0px 16px 56px rgba(17, 17, 26, 0.05) inset;  
}

.glass-surface--fallback {  
  background: rgba(255, 255, 255, 0.25);  
  backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);  
  \-webkit-backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);  
  border: 1px solid rgba(255, 255, 255, 0.3);  
  box-shadow:  
    0 8px 32px 0 rgba(31, 38, 135, 0.2),  
    0 2px 16px 0 rgba(31, 38, 135, 0.1),  
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4),  
    inset 0 \-1px 0 0 rgba(255, 255, 255, 0.2);  
}

@media (prefers-color-scheme: dark) {  
  .glass-surface--fallback {  
    background: rgba(255, 255, 255, 0.1);  
    backdrop-filter: blur(12px) saturate(1.8) brightness(1.2);  
    \-webkit-backdrop-filter: blur(12px) saturate(1.8) brightness(1.2);  
    border: 1px solid rgba(255, 255, 255, 0.2);  
    box-shadow:  
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2),  
      inset 0 \-1px 0 0 rgba(255, 255, 255, 0.1);  
  }  
}

@supports not (backdrop-filter: blur(10px)) {  
  .glass-surface--fallback {  
    background: rgba(255, 255, 255, 0.4);  
    box-shadow:  
      inset 0 1px 0 0 rgba(255, 255, 255, 0.5),  
      inset 0 \-1px 0 0 rgba(255, 255, 255, 0.3);  
  }

  .glass-surface--fallback::before {  
    content: '';  
    position: absolute;  
    inset: 0;  
    background: rgba(255, 255, 255, 0.15);  
    border-radius: inherit;  
    z-index: \-1;  
  }  
}

@supports not (backdrop-filter: blur(10px)) {  
  @media (prefers-color-scheme: dark) {  
    .glass-surface--fallback {  
      background: rgba(0, 0, 0, 0.4);  
    }

    .glass-surface--fallback::before {  
      background: rgba(255, 255, 255, 0.05);  
    }  
  }  
}

.glass-surface:focus-visible {  
  outline: 2px solid light-dark(\#007aff, \#0a84ff);  
  outline-offset: 2px;  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

GLASS ICONS:   
\#\# Integrate the \<GlassIcons /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: GlassIcons  
\#\#\# Variant: JavaScript \+ CSS

\---

\#\#\# Usage Example  
\`\`\`jsx  
import GlassIcons from './GlassIcons'

// update with your own icons and colors  
const items \= \[  
  { icon: \<FiFileText /\>, color: 'blue', label: 'Files' },  
  { icon: \<FiBook /\>, color: 'purple', label: 'Books' },  
  { icon: \<FiHeart /\>, color: 'red', label: 'Health' },  
  { icon: \<FiCloud /\>, color: 'indigo', label: 'Weather' },  
  { icon: \<FiEdit /\>, color: 'orange', label: 'Notes' },  
  { icon: \<FiBarChart2 /\>, color: 'green', label: 'Stats' },  
\];

\<div style={{ height: '600px', position: 'relative' }}\>  
  \<GlassIcons items={items} className="custom-class"/\>  
\</div\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| items | GlassIconsItem\[\] | \[\] | Array of items to render. Each item should include: an icon (React.ReactElement), a color (string), a label (string), and an optional customClass (string). |  
| className | string | '' | Optional additional CSS class(es) to be added to the container. |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

import './GlassIcons.css';

const gradientMapping \= {  
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',  
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',  
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',  
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',  
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',  
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'  
};

const GlassIcons \= ({ items, className }) \=\> {  
  const getBackgroundStyle \= color \=\> {  
    if (gradientMapping\[color\]) {  
      return { background: gradientMapping\[color\] };  
    }  
    return { background: color };  
  };

  return (  
    \<div className={\`icon-btns \${className || ''}\`}\>  
      {items.map((item, index) \=\> (  
        \<button key={index} className={\`icon-btn \${item.customClass || ''}\`} aria-label={item.label} type="button"\>  
          \<span className="icon-btn\_\_back" style={getBackgroundStyle(item.color)}\>\</span\>  
          \<span className="icon-btn\_\_front"\>  
            \<span className="icon-btn\_\_icon" aria-hidden="true"\>  
              {item.icon}  
            \</span\>  
          \</span\>  
          \<span className="icon-btn\_\_label"\>{item.label}\</span\>  
        \</button\>  
      ))}  
    \</div\>  
  );  
};

export default GlassIcons;

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.icon-btns {  
  display: grid;  
  grid-gap: 5em;  
  grid-template-columns: repeat(2, 1fr);  
  margin: auto;  
  padding: 3em 0;  
  overflow: visible;  
}

.icon-btn {  
  background-color: transparent;  
  outline: none;  
  position: relative;  
  width: 4.5em;  
  height: 4.5em;  
  perspective: 24em;  
  transform-style: preserve-3d;  
  \-webkit-tap-highlight-color: transparent;  
  border: none;  
  cursor: pointer;  
}

.icon-btn\_\_back,  
.icon-btn\_\_front,  
.icon-btn\_\_label {  
  transition:  
    opacity 0.3s cubic-bezier(0.83, 0, 0.17, 1),  
    transform 0.3s cubic-bezier(0.83, 0, 0.17, 1);  
}

.icon-btn\_\_back,  
.icon-btn\_\_front {  
  border-radius: 1.25em;  
  position: absolute;  
  top: 0;  
  left: 0;  
  width: 100%;  
  height: 100%;  
}

.icon-btn\_\_back {  
  box-shadow: 0.5em \-0.5em 0.75em hsla(223, 10%, 10%, 0.15);  
  display: block;  
  transform: rotate(15deg);  
  transform-origin: 100% 100%;  
  will-change: transform;  
}

.icon-btn\_\_front {  
  background-color: hsla(0, 0%, 100%, 0.15);  
  box-shadow: 0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset;  
  backdrop-filter: blur(0.75em);  
  \-webkit-backdrop-filter: blur(0.75em);  
  \-moz-backdrop-filter: blur(0.75em);  
  display: flex;  
  transform-origin: 80% 50%;  
  will-change: transform;  
}

.icon-btn\_\_icon {  
  margin: auto;  
  width: 1.5em;  
  height: 1.5em;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  color: \#fff;  
}

.icon-btn\_\_label {  
  font-size: 1em;  
  white-space: nowrap;  
  text-align: center;  
  line-height: 2;  
  opacity: 0;  
  position: absolute;  
  top: 100%;  
  right: 0;  
  left: 0;  
  transform: translateY(0);  
}

.icon-btn:focus-visible .icon-btn\_\_back,  
.icon-btn:hover .icon-btn\_\_back {  
  transform: rotate(25deg) translate3d(-0.5em, \-0.5em, 0.5em);  
}

.icon-btn:focus-visible .icon-btn\_\_front,  
.icon-btn:hover .icon-btn\_\_front {  
  transform: translate3d(0, 0, 2em);  
}

.icon-btn:focus-visible .icon-btn\_\_label,  
.icon-btn:hover .icon-btn\_\_label {  
  opacity: 1;  
  transform: translateY(20%);  
}

@media (min-width: 768px) {  
  .icon-btns {  
    grid-template-columns: repeat(3, 1fr);  
  }  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

SPECULAR BUTTON:  
\#\# Integrate the \<SpecularButton /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: SpecularButton  
\#\#\# Variant: JavaScript \+ CSS  
\#\#\# Dependencies: ogl

\---

\#\#\# Usage Example  
\`\`\`jsx  
import SpecularButton from './SpecularButton';

\<SpecularButton  
  size="lg"  
  radius={18}  
  tint="\#ffffff"  
  tintOpacity={0}  
  blur={0}  
  textColor="\#f5f5f5"  
  lineColor="\#ffffff"  
  baseColor="\#525252"  
  intensity={1}  
  shineSize={10}  
  shineFade={40}  
  thickness={1}  
  speed={0.35}  
  followMouse  
  proximity={250}  
  autoAnimate={false}  
  onClick={() \=\> console.log('clicked')}  
\>  
  Get Started  
\</SpecularButton\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| children | ReactNode | "Get Started" | Button label or any custom content. |  
| size | "sm" | "md" | "lg" | "lg" | Preset padding and font size of the button. |  
| radius | number | 18 | Corner radius in pixels; clamps to a pill automatically. |  
| tint | string | "\#ffffff" | Color of the glass background tint. |  
| tintOpacity | number | 0 | Strength of the glass tint. |  
| blur | number | 0 | Backdrop blur in pixels behind the button. |  
| textColor | string | "\#f5f5f5" | Color of the button label. |  
| lineColor | string | "\#ffffff" | Color of the moving specular highlight. |  
| baseColor | string | "\#525252" | Color of the static edge stroke under the highlight. |  
| intensity | number | 1 | Brightness of the specular highlight. |  
| shineSize | number | 10 | Angular size in degrees of each shine streak along the edge. |  
| shineFade | number | 40 | How gradually each streak fades out at its ends, in degrees. |  
| thickness | number | 1 | Width of the highlight line in pixels. |  
| speed | number | 0.35 | Rotation speed of the sweep when autoAnimate is on. |  
| followMouse | boolean | true | Point the light toward the cursor. |  
| proximity | number | 250 | Distance in pixels within which the shine fades in as the cursor approaches. |  
| autoAnimate | boolean | false | Keep the shine always on with a rotating sweep, regardless of cursor distance. |  
| disabled | boolean | false | Disable the button. |  
| onClick | MouseEventHandler | \- | Standard button click handler. |  
| type | "button" | "submit" | "reset" | "button" | Native button type. |  
| className | string | "" | Additional CSS classes for the button. |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

import { useRef, useEffect } from 'react';  
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';  
import './SpecularButton.css';

const PAD \= 20;

const VERT \= \`\#version 300 es  
in vec2 position;  
void main() {  
  gl\_Position \= vec4(position, 0.0, 1.0);  
}  
\`;

const FRAG \= \`\#version 300 es  
precision highp float;

uniform vec2 uCenter;  
uniform vec2 uHalfSize;  
uniform float uRadius;  
uniform float uAngle;  
uniform float uPx;  
uniform vec3 uLineColor;  
uniform vec3 uBaseColor;  
uniform float uIntensity;  
uniform float uShineSize;  
uniform float uShineFade;  
uniform float uThickness;  
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {  
  vec2 q \= abs(p) \- b \+ r;  
  return length(max(q, 0.0)) \+ min(max(q.x, q.y), 0.0) \- r;  
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {  
  float x \= d / (sigma \+ 1e-6);  
  float k \= mix(1.0, 1.6, smoothstep(0.0, 1.5, x));  
  return exp(-k \* x \* x);  
}

void main() {  
  vec2 p \= gl\_FragCoord.xy \- uCenter;  
  float d \= shapeSDF(p);  
  vec2 L \= vec2(cos(uAngle), sin(uAngle));

  // Dark base stroke hugging the edge for a sense of thickness  
  float base \= (1.0 \- smoothstep(0.0, uBaseWidth, abs(d))) \* 0.45;

  // Symmetric specular: the edges facing toward/away from the light both  
  // catch a streak. The angular window (size \+ fade) is measured with an  
  // elliptical normal so it varies continuously along straight edges.  
  vec2 nEll \= normalize(p / (uHalfSize \* uHalfSize) \+ 1e-6);  
  float phi \= acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));  
  float rim \= 1.0 \- smoothstep(uShineSize \- uShineFade, uShineSize \+ uShineFade \+ 1e-4, phi);  
  float line \= gaussianLine(d, uThickness);  
  float edgeClamp \= 1.0 \- smoothstep(0.5 \* uPx, 3.0 \* uPx, abs(d));  
  float hi \= line \* rim \* edgeClamp \* uIntensity;

  vec3 col \= uBaseColor \* base \+ uLineColor \* hi;  
  float a \= clamp(base \+ hi, 0.0, 1.0);  
  fragColor \= vec4(col, a);  
}  
\`;

const SpecularButton \= ({  
  children \= 'Get Started',  
  size \= 'lg',  
  radius \= 18,  
  tint \= '\#ffffff',  
  tintOpacity \= 0,  
  blur \= 0,  
  textColor \= '\#f5f5f5',  
  lineColor \= '\#ffffff',  
  baseColor \= '\#525252',  
  intensity \= 1,  
  shineSize \= 10,  
  shineFade \= 40,  
  thickness \= 1,  
  speed \= 0.35,  
  followMouse \= true,  
  proximity \= 250,  
  autoAnimate \= false,  
  disabled \= false,  
  onClick,  
  className \= '',  
  type \= 'button'  
}) \=\> {  
  const btnRef \= useRef(null);  
  const fxRef \= useRef(null);  
  const propsRef \= useRef({});

  propsRef.current \= { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() \=\> {  
    const btn \= btnRef.current;  
    const fx \= fxRef.current;  
    if (\!btn || \!fx) return;

    const dpr \= window.devicePixelRatio || 1;  
    const renderer \= new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });  
    const gl \= renderer.gl;  
    gl.clearColor(0, 0, 0, 0);  
    gl.enable(gl.BLEND);  
    gl.blendFunc(gl.ONE, gl.ONE\_MINUS\_SRC\_ALPHA);

    const geometry \= new Triangle(gl);  
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program \= new Program(gl, {  
      vertex: VERT,  
      fragment: FRAG,  
      uniforms: {  
        uCenter: { value: \[0, 0\] },  
        uHalfSize: { value: \[1, 1\] },  
        uRadius: { value: 0 },  
        uAngle: { value: 2.4 },  
        uPx: { value: dpr },  
        uLineColor: { value: \[1, 1, 1\] },  
        uBaseColor: { value: \[0.32, 0.32, 0.32\] },  
        uIntensity: { value: 1 },  
        uShineSize: { value: 0.17 },  
        uShineFade: { value: 0.7 },  
        uThickness: { value: 1 },

        uBaseWidth: { value: dpr }  
      }  
    });

    const mesh \= new Mesh(gl, { geometry, program });  
    fx.appendChild(gl.canvas);

    const sizeRef \= { w: 1, h: 1 };  
    const resize \= () \=\> {  
      // Fractional size \+ explicit center keep the SDF pinned to the exact  
      // CSS border, instead of drifting up to a pixel from offsetWidth rounding.  
      const rect \= btn.getBoundingClientRect();  
      const w \= rect.width;  
      const h \= rect.height;  
      sizeRef.w \= w;  
      sizeRef.h \= h;  
      renderer.setSize(w \+ PAD \* 2, h \+ PAD \* 2);  
      program.uniforms.uCenter.value \= \[(PAD \+ w / 2\) \* dpr, (PAD \+ h / 2\) \* dpr\];  
      program.uniforms.uHalfSize.value \= \[(w / 2\) \* dpr, (h / 2\) \* dpr\];  
    };  
    const ro \= new ResizeObserver(resize);  
    ro.observe(btn);  
    resize();

    // Light angle steers toward the pointer (anywhere on the page) and falls  
    // back to a slow sweep when the pointer hasn't moved yet.  
    let pointerAngle \= null;  
    let proximityT \= 0;  
    const onPointerMove \= e \=\> {  
      const rect \= btn.getBoundingClientRect();  
      const cx \= rect.left \+ rect.width / 2;  
      const cy \= rect.top \+ rect.height / 2;  
      const dx \= Math.max(rect.left \- e.clientX, 0, e.clientX \- rect.right);  
      const dy \= Math.max(rect.top \- e.clientY, 0, e.clientY \- rect.bottom);  
      const dist \= Math.hypot(dx, dy);  
      // Over the button itself the light settles on the diagonal (framing the  
      // corners) and gently sways with the cursor position within the button.  
      if (dist \=== 0\) {  
        const nx \= (e.clientX \- cx) / (rect.width / 2);  
        const ny \= (cy \- e.clientY) / (rect.height / 2);  
        pointerAngle \= Math.atan2(2 / rect.height, \-2 / rect.width) \+ nx \* 0.3 \+ ny \* 0.15;  
      } else {  
        pointerAngle \= Math.atan2(cy \- e.clientY, e.clientX \- cx);  
      }  
      const t \= Math.max(0, 1 \- dist / Math.max(propsRef.current.proximity, 1));  
      proximityT \= t \* t \* (3 \- 2 \* t);  
    };  
    window.addEventListener('pointermove', onPointerMove);

    let angle \= 2.4;  
    let idleAngle \= 2.4;  
    let bright \= 0;  
    let last \= performance.now();  
    let raf \= 0;

    const lineC \= new Color();  
    const baseC \= new Color();

    const update \= now \=\> {  
      raf \= requestAnimationFrame(update);  
      const dt \= Math.min((now \- last) / 1000, 0.05);  
      last \= now;  
      const p \= propsRef.current;

      idleAngle \+= p.speed \* dt;  
      const steer \= p.followMouse && pointerAngle \!= null && (\!p.autoAnimate || proximityT \> 0);  
      const target \= steer ? pointerAngle : idleAngle;  
      const diff \= ((target \- angle \+ Math.PI \* 3\) % (Math.PI \* 2)) \- Math.PI;  
      angle \+= diff \* (1 \- Math.exp(-dt \* 7));

      // Shine fades in with pointer proximity unless autoAnimate keeps it on  
      const brightTarget \= p.autoAnimate ? 1 : proximityT;  
      bright \+= (brightTarget \- bright) \* (1 \- Math.exp(-dt \* 8));

      lineC.set(p.lineColor);  
      baseC.set(p.baseColor);  
      program.uniforms.uAngle.value \= angle;  
      program.uniforms.uRadius.value \= Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2\) \* dpr;  
      program.uniforms.uLineColor.value \= \[lineC.r, lineC.g, lineC.b\];  
      program.uniforms.uBaseColor.value \= \[baseC.r, baseC.g, baseC.b\];  
      program.uniforms.uIntensity.value \= p.intensity \* bright;  
      program.uniforms.uShineSize.value \= (p.shineSize \* Math.PI) / 180;  
      program.uniforms.uShineFade.value \= (p.shineFade \* Math.PI) / 180;  
      program.uniforms.uThickness.value \= p.thickness \* dpr;  
      renderer.render({ scene: mesh });  
    };  
    raf \= requestAnimationFrame(update);

    return () \=\> {  
      cancelAnimationFrame(raf);  
      ro.disconnect();  
      window.removeEventListener('pointermove', onPointerMove);  
      if (gl.canvas.parentNode \=== fx) fx.removeChild(gl.canvas);  
      gl.getExtension('WEBGL\_lose\_context')?.loseContext();  
    };  
  }, \[\]);

  return (  
    \<button  
      ref={btnRef}  
      type={type}  
      disabled={disabled}  
      onClick={onClick}  
      className={\`specular-button specular-button--\${size}\${className ? \` \${className}\` : ''}\`}  
      style={{  
        '--sb-radius': \`\${radius}px\`,  
        '--sb-tint': tint,  
        '--sb-tint-opacity': tintOpacity,  
        '--sb-blur': \`\${blur}px\`,  
        '--sb-text-color': textColor  
      }}  
    \>  
      \<span ref={fxRef} className="specular-button\_\_fx" aria-hidden="true" /\>  
      \<span className="specular-button\_\_label"\>{children}\</span\>  
    \</button\>  
  );  
};

export default SpecularButton;

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.specular-button {  
  \--sb-radius: 18px;  
  \--sb-tint: \#ffffff;  
  \--sb-tint-opacity: 0;  
  \--sb-blur: 0px;  
  \--sb-text-color: \#f5f5f5;

  position: relative;  
  display: inline-flex;  
  align-items: center;  
  justify-content: center;  
  border: none;  
  margin: 0;  
  font-family: inherit;  
  font-weight: 500;  
  letter-spacing: 0.01em;  
  line-height: 1;  
  color: var(--sb-text-color);  
  background: color-mix(in srgb, var(--sb-tint) calc(var(--sb-tint-opacity) \* 100%), transparent);  
  border-radius: var(--sb-radius);  
  backdrop-filter: blur(var(--sb-blur));  
  \-webkit-backdrop-filter: blur(var(--sb-blur));  
  box-shadow:  
    inset 0 1px 0 rgba(255, 255, 255, 0.04),  
    0 8px 24px rgba(0, 0, 0, 0.25);  
  cursor: pointer;  
  outline: none;  
  transition: transform 0.15s ease;  
}

.specular-button:active {  
  transform: scale(0.97);  
}

.specular-button:focus-visible {  
  outline: 2px solid color-mix(in srgb, var(--sb-text-color) 60%, transparent);  
  outline-offset: 3px;  
}

.specular-button:disabled {  
  opacity: 0.55;  
  cursor: default;  
}

.specular-button:disabled:active {  
  transform: none;  
}

.specular-button--sm {  
  font-size: 0.85rem;  
  padding: 10px 22px;  
}

.specular-button--md {  
  font-size: 1rem;  
  padding: 14px 30px;  
}

.specular-button--lg {  
  font-size: 1.15rem;  
  padding: 18px 40px;  
}

/\* Canvas extends past the button so the rim glow can bleed outside the edge \*/  
.specular-button\_\_fx {  
  position: absolute;  
  inset: \-20px;  
  pointer-events: none;  
  z-index: 1;  
}

.specular-button\_\_fx canvas {  
  display: block;  
  width: 100%;  
  height: 100%;  
}

.specular-button\_\_label {  
  position: relative;  
  z-index: 2;  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

CHECK   
\#\# Integrate the \<SpringCheck /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: SpringCheck  
\#\#\# Variant: JavaScript \+ CSS  
\#\#\# Dependencies: motion @hugeicons/core-free-icons

\---

\#\#\# Usage Example  
\`\`\`jsx  
import SpringCheck from './SpringCheck';

\<SpringCheck  
  label="Ship the build"  
  defaultChecked={false}  
  onChange={checked \=\> console.log(checked)}  
  color="\#ffffff"  
  fillColor="\#ffffff"  
  checkColor="\#0b0b0f"  
  boxSize={28}  
  boxRadius={9}  
  fontSize={18}  
  bounce={0.2}  
  strikeLag={0.12}  
  doneOpacity={0.42}  
  strike="left"  
/\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| label | ReactNode | "Ship the build" | The words beside the box; the strike-through is exactly their width. |  
| checked | boolean | undefined | Controlled state. A change from outside animates on the spring. |  
| defaultChecked | boolean | false | Initial state when uncontrolled. |  
| onChange | (checked: boolean) \=\> void | \- | Called on every toggle. |  
| disabled | boolean | false | Dims the row and ignores input. |  
| color | string | "\#ffffff" | Ink: the label, the ring, the rule and the focus outline. |  
| fillColor | string | "\#ffffff" | The fill that swells out of the box centre. |  
| checkColor | string | "\#0b0b0f" | Stroke of the tick drawn over the fill. |  
| boxSize | number | 28 | Box side in pixels; ring, gap and row height derive from it. |  
| boxRadius | number | 9 | Box corner radius in pixels; half the size makes a circle. |  
| fontSize | number | 18 | Label size in pixels; the rule thickness derives from it. |  
| bounce | number | 0.2 | How far the fill swells past full. 0 arrives dead, 0.5 rebounds twice. |  
| strikeLag | number | 0.12 | Where on the spring the rule starts: 0 wipes with the fill, 0.4 waits for the tick. |  
| doneOpacity | number | 0.42 | How much ink the words keep once checked. |  
| strike | "left" | "center" | "right" | "none" | "left" | Where the strike-through wipes from, or no rule at all. |  
| ariaLabel | string | \- | Accessible name when the label is not text. |  
| className | string | "" | Extra classes for the row. |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';  
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';  
import { Tick02Icon } from '@hugeicons/core-free-icons';

import './SpringCheck.css';

const VISUAL\_DURATION \= 0.2;  
const RULE\_END \= 0.84;  
const SWELL \= 0.35;  
const TICK\_PATH \= String(Tick02Icon\[0\]\[1\].d);  
const ORIGIN \= { left: 'left center', center: 'center', right: 'right center', none: 'left center' };

const clamp01 \= value \=\> Math.min(1, Math.max(0, value));  
const zetaOf \= bounce \=\> (bounce \<= 0 ? 1 : \-Math.log(bounce) / Math.sqrt(Math.PI \*\* 2 \+ Math.log(bounce) \*\* 2));

const readings \= (t, doneOpacity, strikeLag) \=\> {  
  const held \= clamp01(t);  
  return {  
    fill: \`scale(\${Math.max(t, 0)})\`,  
    box: \`scale(\${1 \+ SWELL \* Math.max(0, t \- 1)})\`,  
    tick: 1 \- held,  
    word: 1 \- (1 \- doneOpacity) \* held,  
    rule: \`scaleX(\${clamp01((held \- strikeLag) / (RULE\_END \- strikeLag))})\`  
  };  
};

export default function SpringCheck({  
  label \= 'Ship the build',  
  checked,  
  defaultChecked \= false,  
  onChange,  
  disabled \= false,  
  color \= '\#ffffff',  
  fillColor \= '\#ffffff',  
  checkColor \= '\#0b0b0f',  
  boxSize \= 28,  
  boxRadius \= 9,  
  fontSize \= 18,  
  bounce \= 0.2,  
  strikeLag \= 0.12,  
  doneOpacity \= 0.42,  
  strike \= 'left',  
  ariaLabel,  
  className \= ''  
}) {  
  const controlled \= checked \!== undefined;  
  const \[inner, setInner\] \= useState(defaultChecked);  
  const on \= controlled ? checked : inner;  
  const reduce \= useReducedMotion();

  const t \= useMotionValue(on ? 1 : 0);  
  const viaPointer \= useRef(false);  
  const instant \= useRef(false);  
  const rowRef \= useRef(null);  
  const boxRef \= useRef(null);  
  const fillRef \= useRef(null);  
  const tickRef \= useRef(null);  
  const wordRef \= useRef(null);  
  const ruleRef \= useRef(null);  
  const cfg \= useRef({ doneOpacity, strikeLag });  
  cfg.current \= { doneOpacity, strikeLag };

  const write \= value \=\> {  
    const r \= readings(value, cfg.current.doneOpacity, cfg.current.strikeLag);  
    if (fillRef.current) fillRef.current.style.transform \= r.fill;  
    if (boxRef.current) boxRef.current.style.transform \= r.box;  
    if (tickRef.current) tickRef.current.style.strokeDashoffset \= r.tick;  
    if (wordRef.current) wordRef.current.style.opacity \= r.word;  
    if (ruleRef.current) ruleRef.current.style.transform \= r.rule;  
  };  
  useMotionValueEvent(t, 'change', write);  
  useLayoutEffect(() \=\> {  
    write(t.get());  
  });

  useEffect(() \=\> {  
    const target \= on ? 1 : 0;  
    if (reduce || instant.current) {  
      instant.current \= false;  
      t.jump(target);  
      return undefined;  
    }  
    if (t.get() \=== target && t.getVelocity() \=== 0\) return undefined;  
    const controls \= animate(t, target, {  
      type: 'spring',  
      visualDuration: VISUAL\_DURATION,  
      bounce: 1 \- zetaOf(bounce)  
    });  
    return () \=\> controls.stop();  
  }, \[on, reduce, bounce, t\]);

  const handlePointerDown \= e \=\> {  
    if (e.button \!== 0 || disabled) return;  
    viaPointer.current \= true;  
    if (\!reduce && rowRef.current) rowRef.current.dataset.pressed \= '';  
  };  
  const handlePointerUp \= () \=\> {  
    if (rowRef.current) delete rowRef.current.dataset.pressed;  
  };  
  const handlePointerCancel \= () \=\> {  
    viaPointer.current \= false;  
    handlePointerUp();  
  };  
  const toggle \= () \=\> {  
    if (disabled) return;  
    instant.current \= \!viaPointer.current;  
    viaPointer.current \= false;  
    const next \= \!on;  
    if (\!controlled) setInner(next);  
    onChange?.(next);  
  };

  const r \= readings(t.get(), doneOpacity, strikeLag);  
  const ring \= boxSize \>= 24 ? 2 : 1.5;  
  const gap \= Math.min(16, Math.max(8, Math.round(boxSize \* 0.43)));  
  const ruleHeight \= Math.max(1.5, Math.round(fontSize / 6\) / 2);

  return (  
    \<button  
      ref={rowRef}  
      type="button"  
      role="checkbox"  
      aria-checked={on}  
      aria-label={ariaLabel}  
      disabled={disabled}  
      className={\`spring-check\${className ? \` \${className}\` : ''}\`}  
      style={{  
        '--sc-ink': color,  
        '--sc-fill': fillColor,  
        '--sc-check': checkColor,  
        '--sc-box': \`\${boxSize}px\`,  
        '--sc-radius': \`\${boxRadius}px\`,  
        '--sc-font': \`\${fontSize}px\`,  
        '--sc-ring': \`\${ring}px\`,  
        '--sc-gap': \`\${gap}px\`,  
        '--sc-row': \`\${Math.max(44, boxSize \+ 16)}px\`,  
        '--sc-rule': \`\${ruleHeight}px\`,  
        '--sc-origin': ORIGIN\[strike\] || ORIGIN.left  
      }}  
      onPointerDown={handlePointerDown}  
      onPointerUp={handlePointerUp}  
      onPointerCancel={handlePointerCancel}  
      onPointerLeave={handlePointerCancel}  
      onClick={toggle}  
    \>  
      \<span className="spring-check\_\_press"\>  
        \<span ref={boxRef} className="spring-check\_\_box" style={{ transform: r.box }}\>  
          \<span className="spring-check\_\_ring" aria-hidden="true" /\>  
          \<span ref={fillRef} className="spring-check\_\_fill" style={{ transform: r.fill }} /\>  
          \<svg className="spring-check\_\_tick" viewBox="0 0 24 24" aria-hidden="true"\>  
            \<path ref={tickRef} d={TICK\_PATH} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: r.tick }} /\>  
          \</svg\>  
        \</span\>  
      \</span\>  
      \<span className="spring-check\_\_label"\>  
        \<span ref={wordRef} className="spring-check\_\_word" style={{ opacity: r.word }}\>  
          {label}  
        \</span\>  
        {strike \!== 'none' ? (  
          \<span ref={ruleRef} className="spring-check\_\_rule" aria-hidden="true" style={{ transform: r.rule }} /\>  
        ) : null}  
      \</span\>  
    \</button\>  
  );  
}

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.spring-check {  
  \--sc-ink: \#ffffff;  
  \--sc-fill: \#ffffff;  
  \--sc-check: \#0b0b0f;  
  \--sc-box: 28px;  
  \--sc-radius: 9px;  
  \--sc-font: 18px;  
  \--sc-ring: 2px;  
  \--sc-gap: 12px;  
  \--sc-row: 44px;  
  \--sc-rule: 1.5px;  
  \--sc-origin: left center;  
  \--sc-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  display: inline-flex;  
  align-items: center;  
  gap: var(--sc-gap);  
  min-height: var(--sc-row);  
  margin: 0;  
  padding: 0;  
  border: 0;  
  background: none;  
  color: var(--sc-ink);  
  font-family: inherit;  
  font-size: var(--sc-font);  
  font-weight: 500;  
  line-height: 1.2;  
  letter-spacing: \-0.01em;  
  text-align: left;  
  cursor: pointer;  
  user-select: none;  
  \-webkit-user-select: none;  
  \-webkit-touch-callout: none;  
  \-webkit-tap-highlight-color: transparent;  
  touch-action: manipulation;  
  outline: none;  
}

.spring-check:disabled {  
  opacity: 0.5;  
  cursor: not-allowed;  
}

.spring-check\_\_press {  
  flex: none;  
  width: var(--sc-box);  
  height: var(--sc-box);  
  border-radius: var(--sc-radius);  
  transition: transform 160ms var(--sc-ease-out);  
}

.spring-check\[data-pressed\] .spring-check\_\_press {  
  transform: scale(0.95);  
}

.spring-check:focus-visible .spring-check\_\_press {  
  outline: 2px solid color-mix(in srgb, var(--sc-ink) 45%, transparent);  
  outline-offset: 3px;  
}

.spring-check\_\_box {  
  position: relative;  
  display: grid;  
  place-items: center;  
  width: 100%;  
  height: 100%;  
  border-radius: inherit;  
  overflow: hidden;  
  transform-origin: center;  
}

.spring-check\_\_ring {  
  position: absolute;  
  inset: 0;  
  border-radius: inherit;  
  box-shadow: inset 0 0 0 var(--sc-ring) var(--sc-ink);  
  opacity: 0.28;  
  transition: opacity 120ms ease;  
}

@media (hover: hover) and (pointer: fine) {  
  .spring-check:not(:disabled):hover .spring-check\_\_ring {  
    opacity: 0.5;  
  }  
}

.spring-check\_\_fill {  
  position: absolute;  
  inset: 0;  
  border-radius: inherit;  
  background: var(--sc-fill);  
  transform-origin: center;  
}

.spring-check\_\_tick {  
  position: relative;  
  width: 68%;  
  height: 68%;  
  overflow: visible;  
  fill: none;  
  stroke: var(--sc-check);  
  stroke-width: 2.6;  
  stroke-linecap: round;  
  stroke-linejoin: round;  
}

.spring-check\_\_label {  
  position: relative;  
  display: inline-block;  
}

.spring-check\_\_word {  
  display: inline-block;  
}

.spring-check\_\_rule {  
  position: absolute;  
  left: 0;  
  right: 0;  
  top: 46%;  
  height: var(--sc-rule);  
  border-radius: 2px;  
  background: currentColor;  
  transform-origin: var(--sc-origin);  
  pointer-events: none;  
}

@media (prefers-reduced-motion: reduce) {  
  .spring-check\_\_press {  
    transition: none;  
  }  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

COUNTER FOR DAILY WATER:  
\#\# Integrate the \<Counter /\> component from React Bits

You are helping integrate an open-source React component into an existing application.

\#\#\# Component: Counter  
\#\#\# Variant: JavaScript \+ CSS  
\#\#\# Dependencies: motion

\---

\#\#\# Usage Example  
\`\`\`jsx  
import Counter from './Counter';

\<Counter  
  value={2}  
  places={\[100, 10, 1\]}  
  fontSize={80}  
  padding={5}  
  gap={10}  
  textColor="white"  
  fontWeight={900}  
/\>  
\`\`\`

\#\#\# Props  
| Prop | Type | Default | Description |  
|------|------|---------|-------------|  
| value | number | N/A (required) | The numeric value to display in the counter. |  
| fontSize | number | 100 | The base font size used for the counter digits. |  
| padding | number | 0 | Additional padding added to the digit height. |  
| places | number\[\] | \[100, 10, 1 , "." , 0.1\] | Defines which digit positions to display. Include whole number and decimal place values (use "." for the decimal point). If omitted, place values will be detected automatically. |  
| gap | number | 8 | The gap (in pixels) between each digit. |  
| borderRadius | number | 4 | The border radius (in pixels) for the counter container. |  
| horizontalPadding | number | 8 | The horizontal padding (in pixels) for the counter container. |  
| textColor | string | inherit | The text color for the counter digits. |  
| fontWeight | string | number | inherit | The font weight of the counter digits. |  
| containerStyle | React.CSSProperties | {} | Custom inline styles for the outer container. |  
| counterStyle | React.CSSProperties | {} | Custom inline styles for the counter element. |  
| digitStyle | React.CSSProperties | {} | Custom inline styles for each digit container. |  
| gradientHeight | number | 16 | The height (in pixels) of the gradient overlays. |  
| gradientFrom | string | 'black' | The starting color for the gradient overlays. |  
| gradientTo | string | 'transparent' | The ending color for the gradient overlays. |  
| topGradientStyle | React.CSSProperties | undefined | Custom inline styles for the top gradient overlay. |  
| bottomGradientStyle | React.CSSProperties | undefined | Custom inline styles for the bottom gradient overlay. |

\#\#\# Full Component Source  
\`\`\`jsx  
'use client';

import { motion, useSpring, useTransform } from 'motion/react';  
import { useEffect } from 'react';

import './Counter.css';

function Number({ mv, number, height }) {  
  let y \= useTransform(mv, latest \=\> {  
    let placeValue \= latest % 10;  
    let offset \= (10 \+ number \- placeValue) % 10;  
    let memo \= offset \* height;  
    if (offset \> 5\) {  
      memo \-= 10 \* height;  
    }  
    return memo;  
  });  
  return (  
    \<motion.span className="counter-number" style={{ y }}\>  
      {number}  
    \</motion.span\>  
  );  
}

function normalizeNearInteger(num) {  
  const nearest \= Math.round(num);  
  const tolerance \= 1e-9 \* Math.max(1, Math.abs(num));  
  return Math.abs(num \- nearest) \< tolerance ? nearest : num;  
}

function getValueRoundedToPlace(value, place) {  
  const scaled \= value / place;  
  return Math.floor(normalizeNearInteger(scaled));  
}

function Digit({ place, value, height, digitStyle }) {  
  const isDecimal \= place \=== '.';  
  const valueRoundedToPlace \= isDecimal ? 0 : getValueRoundedToPlace(value, place);  
  const animatedValue \= useSpring(valueRoundedToPlace);

  useEffect(() \=\> {  
    if (\!isDecimal) {  
      animatedValue.set(valueRoundedToPlace);  
    }  
  }, \[animatedValue, valueRoundedToPlace, isDecimal\]);

  if (isDecimal) {  
    return (  
      \<span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}\>  
        .  
      \</span\>  
    );  
  }

  return (  
    \<span className="counter-digit" style={{ height, ...digitStyle }}\>  
      {Array.from({ length: 10 }, (\_, i) \=\> (  
        \<Number key={i} mv={animatedValue} number={i} height={height} /\>  
      ))}  
    \</span\>  
  );  
}

export default function Counter({  
  value,  
  fontSize \= 100,  
  padding \= 0,  
  places \= \[...value.toString()\].map((ch, i, a) \=\> {  
    ch \== '.';  
    if (ch \=== '.') {  
      return '.';  
    } else {  
      return (  
        10 \*\*  
        (a.indexOf('.') \=== \-1 ? a.length \- i \- 1 : i \< a.indexOf('.') ? a.indexOf('.') \- i \- 1 : \-(i \- a.indexOf('.')))  
      );  
    }  
  }),  
  gap \= 8,  
  borderRadius \= 4,  
  horizontalPadding \= 8,  
  textColor \= 'inherit',  
  fontWeight \= 'inherit',  
  containerStyle,  
  counterStyle,  
  digitStyle,  
  gradientHeight \= 16,  
  gradientFrom \= 'black',  
  gradientTo \= 'transparent',  
  topGradientStyle,  
  bottomGradientStyle  
}) {  
  const height \= fontSize \+ padding;  
  const defaultCounterStyle \= {  
    fontSize,  
    gap: gap,  
    borderRadius: borderRadius,  
    paddingLeft: horizontalPadding,  
    paddingRight: horizontalPadding,  
    color: textColor,  
    fontWeight: fontWeight,  
    direction: "ltr"  
  };  
  const defaultTopGradientStyle \= {  
    height: gradientHeight,  
    background: \`linear-gradient(to bottom, \${gradientFrom}, \${gradientTo})\`  
  };  
  const defaultBottomGradientStyle \= {  
    height: gradientHeight,  
    background: \`linear-gradient(to top, \${gradientFrom}, \${gradientTo})\`  
  };  
  return (  
    \<span className="counter-container" style={containerStyle}\>  
      \<span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}\>  
        {places.map(place \=\> (  
          \<Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} /\>  
        ))}  
      \</span\>  
      \<span className="gradient-container"\>  
        \<span className="top-gradient" style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}\>\</span\>  
        \<span  
          className="bottom-gradient"  
          style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle}  
        \>\</span\>  
      \</span\>  
    \</span\>  
  );  
}

\`\`\`

\#\#\# Component CSS  
\`\`\`css  
.counter-container {  
  position: relative;  
  display: inline-block;  
}

.counter-counter {  
  display: flex;  
  overflow: hidden;  
  line-height: 1;  
}

.counter-digit {  
  position: relative;  
  width: 1ch;  
  font-variant-numeric: tabular-nums;  
}

.counter-number {  
  position: absolute;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  left: 0;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}

.gradient-container {  
  pointer-events: none;  
  position: absolute;  
  top: 0;  
  bottom: 0;  
  left: 0;  
  right: 0;  
}

.bottom-gradient {  
  position: absolute;  
  bottom: 0;  
  width: 100%;  
}

\`\`\`

\#\#\# Integration Instructions  
1\. Install any listed dependencies.  
2\. Copy the component source into the appropriate directory in the project.  
3\. Import the CSS file alongside the component.  
4\. Import and render the component using the usage example above as a starting point.  
5\. Adjust props as needed for the specific use case — refer to the props table for all available options.

\#\#\# More from React Bits  
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.  

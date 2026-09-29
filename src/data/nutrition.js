/* Dieta bulk invernale — 3000 kcal (da Vita.md) */
export const TARGETS = {
  kcal: 3000,
  maintenanceKcal: 2500,
  surplusKcal: 500,
  proteinG: 190,
  carbsG: 420,
  fatG: 50,
  fiberG: 40
};

export const MEALS = [
  {
    id: 'breakfast',
    time: '06:30',
    minutes: 6 * 60 + 30,
    title: 'Colazione',
    subtitle: 'A casa',
    kcal: 600,
    items: ["80 g fiocchi d'avena", '250 ml latte senza lattosio', '1 banana schiacciata', '30 g whey (aggiunta dopo aver scaldato)'],
    prep: 'Cuoci porridge, avena e banana la sera prima e metti in frigo. La mattina scalda 1-2 min, poi mescola la whey.'
  },
  {
    id: 'snack',
    time: '10:30',
    minutes: 10 * 60 + 30,
    title: 'Spuntino',
    subtitle: 'A scuola',
    kcal: 400,
    items: ['120 g pane integrale', '80 g fesa di tacchino o prosciutto cotto', '1 frutto'],
    variant: 'Variante: 2 fette di formaggio magro o 150 g di yogurt greco 0%.'
  },
  {
    id: 'lunch',
    time: '14:30',
    minutes: 14 * 60 + 30,
    title: 'Pranzo',
    subtitle: 'A casa',
    kcal: 850,
    items: ['150 g pasta integrale (peso crudo)', '200 g petto di pollo (peso crudo)', '200 g verdure', "1 cucchiaio d'olio"]
  },
  {
    id: 'pregym',
    time: '19:00',
    minutes: 19 * 60,
    title: 'Pre-gym',
    subtitle: 'Carboidrati',
    kcal: 550,
    items: ['100 g riso (peso crudo)', '150 g pollo/tacchino oppure 2 scatolette di tonno al naturale', 'Verdure', '1 frutto']
  },
  {
    id: 'postgym',
    time: '21:30',
    minutes: 21 * 60 + 30,
    title: 'Post-gym',
    subtitle: 'Shake (cena)',
    kcal: 600,
    items: ['30 g whey', '60 g avena', '1 banana', '250 ml latte senza lattosio']
  }
];

export const MEAL_PREP = {
  day: 'sun',
  title: 'Meal prep della domenica',
  steps: [
    { id: 'cook', text: 'Cuoci 1 kg di petto di pollo, riso e pasta; prepara le verdure al forno.' },
    { id: 'split', text: 'Dividi tutto in contenitori.' },
    { id: 'fridge', text: 'In frigo: porzioni per lunedì-mercoledì (3-4 giorni).' },
    { id: 'freeze', text: 'Congela le porzioni per giovedì-venerdì; scongelale la sera prima.' },
    { id: 'porridge', text: 'Porridge della colazione: ogni sera, oppure 2-3 porzioni insieme.' }
  ]
};

/* Integratori del mattino (06:30) e della sera (21:30). */
export const SUPPLEMENTS = {
  morning: [
    { id: 'nootropics', name: 'Nootropici' },
    { id: 'k2d3', name: 'K2 / D3' },
    { id: 'omega3', name: 'Omega-3' },
    { id: 'multi', name: 'Multivitaminico' },
    { id: 'rhodiola', name: 'Rhodiola rosea' },
    { id: 'alphagpc', name: 'Alpha GPC' }
  ],
  evening: [{ id: 'magnesium', name: 'Magnesio bisglicinato' }]
};

/*
  Medicine: 5 giorni sì, 2 no. Sì: ven, sab, dom, lun, mar. No: mer, gio.
*/
export const MEDICINE = {
  name: 'Medicine',
  days: ['fri', 'sat', 'sun', 'mon', 'tue'],
  offDays: ['wed', 'thu'],
  time: '06:30'
};

export function isMedicineDay(dayKey) {
  return MEDICINE.days.includes(dayKey);
}

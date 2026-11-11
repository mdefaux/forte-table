// Deterministic generator of mock records, so the demo is identical on every reload.
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Anna',
  'Marco',
  'Giulia',
  'Luca',
  'Sofia',
  'Matteo',
  'Chiara',
  'Paolo',
  'Elena',
  'Davide',
  'Sara',
  'Andrea',
  'Laura',
  'Simone',
  'Marta',
  'Floyd',
  'Floris',
  'Irene',
  'Pietro',
  'Noemi',
];
const LAST_NAMES = [
  'Rossi',
  'Bianchi',
  'Romano',
  'Colombo',
  'Ricci',
  'Marino',
  'Greco',
  'Bruno',
  'Gallo',
  'Conti',
  'De Luca',
  'Costa',
  'Giordano',
  'Mancini',
  'Rizzo',
  'Lombardi',
  'Moretti',
  'Barbieri',
];
const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'HR',
  'Operations',
  'Legal',
  'Support',
];
const ROLES = [
  'Analyst',
  'Developer',
  'Manager',
  'Consultant',
  'Designer',
  'Architect',
  'Specialist',
  'Director',
];
const PLACES = [
  ['Italy', 'Milan'],
  ['Italy', 'Rome'],
  ['Italy', 'Turin'],
  ['France', 'Paris'],
  ['France', 'Lyon'],
  ['Germany', 'Berlin'],
  ['Germany', 'Munich'],
  ['Spain', 'Madrid'],
  ['UK', 'London'],
  ['Switzerland', 'Lugano'],
];
const STATUSES = ['Active', 'Active', 'Active', 'On leave', 'Terminated'];

export function generateRecords(count = 1000, seed = 42) {
  const random = mulberry32(seed);
  const pick = list => list[Math.floor(random() * list.length)];
  const start = Date.UTC(2010, 0, 1);
  const span = Date.UTC(2026, 0, 1) - start;

  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const [country, city] = pick(PLACES);

    return {
      id: i + 1,
      firstName,
      lastName,
      email: `${firstName}.${lastName}${i + 1}@example.com`
        .toLowerCase()
        .replace(/\s/g, ''),
      department: pick(DEPARTMENTS),
      role: pick(ROLES),
      country,
      city,
      hireDate: new Date(start + Math.floor(random() * span))
        .toISOString()
        .slice(0, 10),
      salary: Math.round(28000 + random() * 92000),
      bonus: Math.round(random() * 15000),
      progress: Math.round(random() * 100),
      rating: 1 + Math.floor(random() * 5),
      remote: random() > 0.6,
      status: pick(STATUSES),
    };
  });
}

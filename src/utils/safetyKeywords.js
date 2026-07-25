// Multilingual safety keywords for crisis detection

export const DANGER_KEYWORDS_BY_LANG = {
  en: [
    'suicide',
    'overdose',
    'kill myself',
    "can't breathe",
    'relapse badly',
    'panic attack',
    'relapse',
    'want to die',
    'self-harm'
  ],
  hi: [
    'आत्महत्या',
    'खुदकुशी',
    'ओवरडोज़',
    'खुद को मारना',
    'सांस नहीं आ रही',
    'दोबारा नशा',
    'घबराहट का दौरा',
    'मरना चाहता हूँ',
    'मरना चाहती हूँ',
    'आत्म-हानि',
    'नुकसान पहुंचाना'
  ],
  ta: [
    'தற்கொலை',
    'அதிக அளவு மருந்து',
    'என்னை நானே கொன்றுவிடுவேன்',
    'சுவாசிக்க முடியவில்லை',
    'பீதி தாக்குதல்',
    'இறக்க விரும்புகிறேன்',
    'சுய தீங்கு',
    'மீண்டும் போதை'
  ],
  te: [
    'ఆత్మహత్య',
    'అతి మోతాదు',
    'నన్ను నేను చంపుకుంటాను',
    'శ్వాస తీసుకోలేకపోతున్నాను',
    'తీవ్ర ఆందోళన దాడి',
    'చనిపోవాలనుకుంటున్నాను',
    'స్వయం హాని',
    'మళ్లీ వ్యసనం'
  ]
};

// Flattened combination of all languages
export const ALL_DANGER_KEYWORDS = Object.values(DANGER_KEYWORDS_BY_LANG).flat();

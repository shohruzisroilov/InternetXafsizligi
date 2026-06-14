import { Lesson, Question, GameItem } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Parol Xavfsizligi',
    emoji: '🔑',
    bgColor: 'from-sky-400 to-blue-500',
    content: [
      "Paroling — sening maxfiy kaliting! Hech kimga aytma. 🤫",
      "Yaxshi parol: harflar + raqamlar + belgilar. Kamida 12 ta!",
      "Har sayt uchun boshqa parol. Bir xilini hamma joyda ishlatma!",
    ],
    funFact: "💡 Dunyoda eng ko'p parol: \"123456\" — bu juda oson topiladi!",
    interactiveType: 'lock',
    videoId: 'k4b3W_FjVpY',
  },
  {
    id: 2,
    title: 'Begona = Xavf!',
    emoji: '👥',
    bgColor: 'from-violet-400 to-purple-500',
    content: [
      "Internetda begona odam = ko'chada begona odam. Ishonma! 🚫",
      "Ismingni, manzilingni, telefon raqamingni aytma!",
      "Noqulay his qilsang — darhol ota-onangga ayt. 👪",
    ],
    funFact: "💡 10 kishidan 3 tasi internetda o'zini boshqacha ko'rsatadi!",
    interactiveType: 'chat',
    videoId: 'p33m7r8I6f0',
  },
  {
    id: 3,
    title: 'Xavfli Havolalar',
    emoji: '⚠️',
    bgColor: 'from-orange-400 to-red-500',
    content: [
      "Har qanday havola = xavf bo'lishi mumkin. Bosishdan oldin o'yla! 🧠",
      "Zararli sayt: kompyuteringga virus kiritishi mumkin.",
      "Shubhali ko'rinsa — kattaga ayt! Sen yolg'iz emas. 💪",
    ],
    funFact: "💡 Har kuni 1 million yangi zararli sayt paydo bo'ladi!",
    interactiveType: 'warning',
    videoId: 'wX-4-q9Vz5E',
  },
]

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Qaysi parol eng xavfsiz? 🔐',
    options: ['123456', 'parol', 'M@rv0n#2024!', 'qwerty'],
    correctIndex: 2,
    explanation: '✅ Harf + raqam + belgi aralash parol eng kuchli!',
  },
  {
    id: 2,
    question: 'Begona odam manzil so\'rasa? 🏠',
    options: ['Aytaman', 'Ota-onaga aytaman', 'O\'ylayman', 'Indamayman'],
    correctIndex: 1,
    explanation: '✅ Doim ota-onangga ayt — ular seni himoya qiladi!',
  },
  {
    id: 3,
    question: 'Noma\'lum havola kelsa? 🔗',
    options: ['Bosaman', 'Do\'stimga yuboraman', 'Bosmay o\'chiraman', 'Yuklab olaman'],
    correctIndex: 2,
    explanation: '✅ Noma\'lum havolani HECH QACHON bosma!',
  },
  {
    id: 4,
    question: 'Internetda nima ulashish mumkin? 📤',
    options: ['Uy manzil', 'Telefon raqam', 'Sevimli rang', 'Maktab nomi'],
    correctIndex: 2,
    explanation: '✅ Faqat zararsiz narsalar: sevimli rang, film, o\'yin!',
  },
  {
    id: 5,
    question: 'Xavfsiz parol kamida necha belgi? 🔢',
    options: ['4 ta', '6 ta', '8 ta', '12 ta yoki ko\'proq'],
    correctIndex: 3,
    explanation: '✅ Mutaxassislar kamida 12 ta belgini tavsiya qiladi!',
  },
]

export const GRADE_CONFIG = {
  excellent: {
    minScore: 5,
    emoji: '🏆',
    message: "Zo'r! Sen haqiqiy internet himoyachisan!",
    bgColor: 'from-yellow-400 to-orange-400',
  },
  good: {
    minScore: 3,
    emoji: '⭐',
    message: 'Yaxshi! Yana bir oz mashq qil!',
    bgColor: 'from-sky-400 to-blue-500',
  },
  tryAgain: {
    minScore: 0,
    emoji: '💪',
    message: 'Xavotir olma! Yana o\'rganamiz!',
    bgColor: 'from-violet-400 to-purple-500',
  },
} as const

export const GAME_ITEMS: GameItem[] = [
  {
    id: 1,
    text: "M@rv0n#2024! paroli",
    isSafe: true,
    explanation: "Kuchli parol: Harflar, raqamlar va maxsus belgilardan iborat hamda kamida 12 belgidan kam emas.",
    emoji: "🔐"
  },
  {
    id: 2,
    text: "http://free-robux-now.net havolasi",
    isSafe: false,
    explanation: "Xavfli havola! Bepul sovg'a yoki o'yin pullarini va'da qiluvchi havolalar ko'pincha virus yoki firibgarlikdir.",
    emoji: "🔗"
  },
  {
    id: 3,
    text: "Begona odam: 'Salom, uy manzilingni yozib yubor'",
    isSafe: false,
    explanation: "Begonaga shaxsiy ma'lumotlarni (manzil, telefon, maktab) berish juda xavfli! Hech qachon yozmang.",
    emoji: "💬"
  },
  {
    id: 4,
    text: "Shubhali havola kelganda uni ota-onaga ko'rsatish",
    isSafe: true,
    explanation: "To'g'ri qaror! Shubhali vaziyatda har doim oilangiz va kattalardan yordam so'rang.",
    emoji: "👪"
  },
  {
    id: 5,
    text: "Hamma akkauntlar uchun bitta '123456' paroli",
    isSafe: false,
    explanation: "Juda zaif va oson topiladigan parol! Har xil saytlar uchun har xil va murakkab parol yarating.",
    emoji: "🔑"
  },
  {
    id: 6,
    text: "https://kun.uz rasmiy yangiliklar sayti",
    isSafe: true,
    explanation: "Xavfsiz sayt! Manzilining boshida 'https://' bo'lishi xavfsiz ulanishni bildiradi va u mashhur ishonchli manba.",
    emoji: "🌐"
  },
  {
    id: 7,
    text: "Begona kishi: 'Kel uchrashamiz, faqat ota-onangga aytma'",
    isSafe: false,
    explanation: "O'ta xavfli! Internetdagi begona odamlar bilan yashirincha uchrashish taqiqlanadi. Ota-onaga xabar bering.",
    emoji: "👥"
  },
  {
    id: 8,
    text: "Internetda faqat sevimli rangingiz va multfilmingizni aytish",
    isSafe: true,
    explanation: "Xavfsiz ma'lumot. Ranglar va multfilmlar shaxsiy maxfiy ma'lumotlar hisoblanmaydi.",
    emoji: "🎨"
  },
  {
    id: 9,
    text: "Telefonga SMS orqali kelgan tasdiqlash kodini begonaga berish",
    isSafe: false,
    explanation: "SMS tasdiqlash kodlari maxfiy! Ularni begonaga berish akkauntingiz yoki pulingiz o'g'irlanishiga sabab bo'ladi.",
    emoji: "📲"
  },
  {
    id: 10,
    text: "Kompyuterga o'yin yuklashdan oldin kattalardan so'rash",
    isSafe: true,
    explanation: "To'g'ri qaror! Noma'lum fayllar ichida virus bo'lishi mumkin. Yuklashdan oldin ruxsat so'rash xavfsiz yo'ldir.",
    emoji: "🛡️"
  }
]

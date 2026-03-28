import type { User } from "./AuthScreen";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
}

export interface Chat {
  id: string;
  userId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

export const MOCK_USERS: User[] = [
  { id: "1", name: "Алексей Петров", username: "alex_petrov", phone: "+79161234567", avatar: "АП", bio: "Привет, я использую Вектор!" },
  { id: "2", name: "Мария Иванова", username: "maria_iv", phone: "+79031112233", avatar: "МИ", bio: "На связи 24/7" },
  { id: "3", name: "Дмитрий Ковалёв", username: "d_kovalev", phone: "+79876543210", avatar: "ДК", bio: "Разработчик, люблю кофе" },
  { id: "4", name: "Анна Смирнова", username: "anna_s", phone: "+79123456789", avatar: "АС", bio: "🎨 Дизайнер" },
  { id: "5", name: "Игорь Волков", username: "igor_v", phone: "+79654321098", avatar: "ИВ", bio: "Путешественник" },
];

export const ONLINE_USERS = new Set(["1", "3", "5"]);

export const MOCK_CHATS: Chat[] = [
  {
    id: "c1", userId: "1",
    lastMessage: "Привет! Как дела? 👋", lastTime: "14:32", unread: 2,
    messages: [
      { id: "m1", chatId: "c1", senderId: "1", text: "Привет! Как дела? 👋", time: "14:30", read: true },
      { id: "m2", chatId: "c1", senderId: "me", text: "Отлично, спасибо! А у тебя?", time: "14:31", read: true },
      { id: "m3", chatId: "c1", senderId: "1", text: "Тоже хорошо. Созвонимся сегодня?", time: "14:32", read: false },
    ],
  },
  {
    id: "c2", userId: "2",
    lastMessage: "Скинь файл, пожалуйста", lastTime: "12:15", unread: 0,
    messages: [
      { id: "m4", chatId: "c2", senderId: "me", text: "Привет, Мария!", time: "12:10", read: true },
      { id: "m5", chatId: "c2", senderId: "2", text: "Привет! 😊", time: "12:12", read: true },
      { id: "m6", chatId: "c2", senderId: "2", text: "Скинь файл, пожалуйста", time: "12:15", read: true },
    ],
  },
  {
    id: "c3", userId: "3",
    lastMessage: "Всё понял, сделаю 👍", lastTime: "Вчера", unread: 0,
    messages: [
      { id: "m7", chatId: "c3", senderId: "3", text: "Дима, нужна помощь с кодом", time: "Вчера", read: true },
      { id: "m8", chatId: "c3", senderId: "me", text: "Всё понял, сделаю 👍", time: "Вчера", read: true },
    ],
  },
  {
    id: "c4", userId: "4",
    lastMessage: "Посмотри макет в фигме", lastTime: "Пн", unread: 1,
    messages: [
      { id: "m9", chatId: "c4", senderId: "4", text: "Посмотри макет в фигме", time: "Пн", read: false },
    ],
  },
];

export const MOCK_CONTACTS = ["1", "2", "3", "4", "5"];

export const NOTIFICATIONS = [
  { id: "n1", type: "message", userId: "1", text: "написал вам сообщение", time: "14:32", read: false },
  { id: "n2", type: "contact", userId: "4", text: "добавил вас в контакты", time: "09:15", read: false },
  { id: "n3", type: "message", userId: "2", text: "упомянул вас в сообщении", time: "Вчера", read: true },
  { id: "n4", type: "message", userId: "3", text: "написал вам сообщение", time: "Пн", read: true },
];

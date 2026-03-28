import { useState } from "react";
import type { User } from "./AuthScreen";
import { MOCK_CHATS, MOCK_USERS, NOTIFICATIONS, type Chat } from "./data";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ContactsTab from "./ContactsTab";
import ProfileTab from "./ProfileTab";
import SearchTab from "./SearchTab";
import SettingsTab from "./SettingsTab";
import NotificationsTab from "./NotificationsTab";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "search" | "notifications" | "settings";

interface MessengerProps {
  user: User;
  onLogout: () => void;
}

export default function Messenger({ user, onLogout }: MessengerProps) {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<{ chat: Chat; partner: User } | null>(null);
  const [currentUser, setCurrentUser] = useState(user);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;
  const unreadChats = MOCK_CHATS.reduce((sum, c) => sum + c.unread, 0);

  const handleSelectChat = (chat: Chat, partner: User) => {
    setActiveChat({ chat, partner });
    setMobileView("chat");
    chat.unread = 0;
  };

  const handleStartChat = (partner: User) => {
    let chat = MOCK_CHATS.find(c => c.userId === partner.id);
    if (!chat) {
      chat = { id: `virtual_${partner.id}`, userId: partner.id, lastMessage: "", lastTime: "", unread: 0, messages: [] };
      MOCK_CHATS.unshift(chat);
    }
    setActiveChat({ chat, partner });
    setTab("chats");
    setMobileView("chat");
  };

  const navItems = [
    { id: "chats" as Tab, icon: "MessageSquare", label: "Чаты", badge: unreadChats },
    { id: "contacts" as Tab, icon: "Users", label: "Контакты", badge: 0 },
    { id: "search" as Tab, icon: "Search", label: "Поиск", badge: 0 },
    { id: "notifications" as Tab, icon: "Bell", label: "Звонки", badge: unreadNotifs },
    { id: "settings" as Tab, icon: "Settings", label: "Настройки", badge: 0 },
  ];

  return (
    <div className="flex h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="flex flex-col w-16 flex-shrink-0 py-4 items-center gap-1" style={{ background: "hsl(var(--card))", borderRight: "1px solid hsl(var(--border))" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "hsl(var(--primary))" }}>
          <Icon name="Zap" size={18} className="text-white" />
        </div>
        <div className="flex-1 flex flex-col gap-1 w-full px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item relative w-full ${tab === item.id ? "active" : ""}`}
              onClick={() => { setTab(item.id); setMobileView("list"); }}
            >
              <Icon name={item.icon as "MessageSquare"} size={20} />
              {item.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "hsl(var(--primary))", color: "#fff", fontSize: "9px" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="nav-item w-12" onClick={() => setTab("settings")}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: "hsl(199 89% 35%)", color: "#fff" }}>
            {currentUser.avatar}
          </div>
        </button>
      </div>

      <div className="w-80 flex-shrink-0 flex flex-col" style={{ borderRight: "1px solid hsl(var(--border))" }}>
        {tab === "chats" && <ChatList currentUser={currentUser} onSelectChat={handleSelectChat} activeChat={activeChat?.chat ?? null} />}
        {tab === "contacts" && <ContactsTab currentUser={currentUser} onStartChat={handleStartChat} />}
        {tab === "search" && <SearchTab currentUser={currentUser} onStartChat={handleStartChat} />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "settings" && <SettingsTab user={currentUser} onLogout={onLogout} />}
      </div>

      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow
            chat={activeChat.chat}
            partner={activeChat.partner}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <Icon name="MessageSquare" size={44} style={{ color: "hsl(var(--primary) / 0.4)" }} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Вектор</h3>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Выберите чат, чтобы начать общение</p>
            </div>
            <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
              <Icon name="Lock" size={12} />
              <span>Все сообщения зашифрованы</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { User } from "./AuthScreen";
import { MOCK_CHATS, MOCK_USERS, ONLINE_USERS, type Chat } from "./data";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ChatListProps {
  currentUser: User;
  onSelectChat: (chat: Chat, partner: User) => void;
  activeChat: Chat | null;
}

export default function ChatList({ currentUser, onSelectChat, activeChat }: ChatListProps) {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(MOCK_CHATS);

  const getUserById = (id: string) => MOCK_USERS.find(u => u.id === id);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (!val.trim()) { setChats(MOCK_CHATS); return; }
    const q = val.toLowerCase().replace("@", "");
    const matched = MOCK_USERS.filter(u =>
      u.id !== currentUser.id && (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.phone.includes(q)
      )
    );
    const matchedChats = MOCK_CHATS.filter(c => matched.some(u => u.id === c.userId));
    const newContacts = matched.filter(u => !MOCK_CHATS.some(c => c.userId === u.id));
    const virtualChats: Chat[] = newContacts.map(u => ({
      id: `virtual_${u.id}`,
      userId: u.id,
      lastMessage: "Новый контакт",
      lastTime: "",
      unread: 0,
      messages: [],
    }));
    setChats([...matchedChats, ...virtualChats]);
  };

  return (
    <div className="flex flex-col h-full" style={{ borderRight: "1px solid hsl(var(--border))" }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Чаты</h1>
          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-muted" style={{ color: "hsl(var(--primary))" }}>
            <Icon name="SquarePen" size={18} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="input-field pl-9 py-2 text-sm"
            placeholder="Поиск по имени, @нику или номеру"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Icon name="MessageSquare" size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Ничего не найдено</p>
          </div>
        )}
        {chats.map((chat, i) => {
          const partner = getUserById(chat.userId);
          if (!partner) return null;
          const isOnline = ONLINE_USERS.has(partner.id);
          const isActive = activeChat?.id === chat.id;

          return (
            <div
              key={chat.id}
              className={`chat-item ${isActive ? "active" : ""}`}
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => onSelectChat(chat, partner)}
            >
              <Avatar initials={partner.avatar} userId={partner.id} size="md" showOnline />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm truncate">{partner.name}</span>
                  <span className="text-xs flex-shrink-0 ml-2" style={{ color: "hsl(var(--muted-foreground))" }}>{chat.lastTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate" style={{ color: isOnline ? "hsl(var(--online))" : "hsl(var(--muted-foreground))" }}>
                    {isOnline ? "онлайн" : chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center" style={{ background: "hsl(var(--primary))", color: "#fff" }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

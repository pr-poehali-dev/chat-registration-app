import { useState } from "react";
import type { User } from "./AuthScreen";
import { MOCK_USERS, MOCK_CHATS, ONLINE_USERS } from "./data";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface SearchTabProps {
  currentUser: User;
  onStartChat: (user: User) => void;
}

export default function SearchTab({ currentUser, onStartChat }: SearchTabProps) {
  const [query, setQuery] = useState("");

  const results = query.trim().length >= 1
    ? MOCK_USERS.filter(u => {
        if (u.id === currentUser.id) return false;
        const q = query.toLowerCase().replace("@", "");
        return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
      })
    : [];

  const chatResults = query.trim().length >= 1
    ? MOCK_CHATS.filter(c => c.messages.some(m => m.text.toLowerCase().includes(query.toLowerCase())))
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold mb-3">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="input-field pl-10 text-sm"
            placeholder="Поиск людей, @ников, номеров..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery("")}>
              <Icon name="X" size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {!query.trim() && (
          <div className="px-4 space-y-4 pt-4">
            <p className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>ПОДСКАЗКИ</p>
            {["@alex_petrov", "+79161234567", "Мария"].map(hint => (
              <button key={hint} className="flex items-center gap-3 w-full" onClick={() => setQuery(hint)}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
                  <Icon name={hint.startsWith("@") ? "AtSign" : hint.startsWith("+") ? "Phone" : "User"} size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
                </div>
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{hint}</span>
              </button>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && chatResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Icon name="SearchX" size={36} style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Ничего не найдено</p>
            <p className="text-xs text-center" style={{ color: "hsl(var(--muted-foreground))" }}>Попробуйте @ник или номер телефона</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="px-4 pt-2">
            <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>ПОЛЬЗОВАТЕЛИ</p>
            <div className="space-y-1">
              {results.map(user => {
                const isOnline = ONLINE_USERS.has(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors animate-fade-in"
                    onClick={() => onStartChat(user)}
                  >
                    <Avatar initials={user.avatar} userId={user.id} size="md" showOnline />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs" style={{ color: isOnline ? "hsl(var(--online))" : "hsl(var(--muted-foreground))" }}>
                        {isOnline ? "онлайн · " : ""} @{user.username} · {user.phone}
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                      Написать
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chatResults.length > 0 && (
          <div className="px-4 pt-3">
            <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>СООБЩЕНИЯ</p>
            <div className="space-y-1">
              {chatResults.map(chat => {
                const user = MOCK_USERS.find(u => u.id === chat.userId);
                if (!user) return null;
                const matchedMsg = chat.messages.find(m => m.text.toLowerCase().includes(query.toLowerCase()));
                return (
                  <div key={chat.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors animate-fade-in">
                    <Avatar initials={user.avatar} userId={user.id} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{matchedMsg?.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { User } from "./AuthScreen";
import { MOCK_USERS, MOCK_CONTACTS, ONLINE_USERS } from "./data";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ContactsTabProps {
  currentUser: User;
  onStartChat: (user: User) => void;
}

export default function ContactsTab({ currentUser, onStartChat }: ContactsTabProps) {
  const [search, setSearch] = useState("");

  const contacts = MOCK_CONTACTS
    .map(id => MOCK_USERS.find(u => u.id === id))
    .filter((u): u is User => !!u && u.id !== currentUser.id);

  const filtered = search.trim()
    ? contacts.filter(u => {
        const q = search.toLowerCase().replace("@", "");
        return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.phone.includes(q);
      })
    : contacts;

  const byLetter = filtered.reduce<Record<string, User[]>>((acc, u) => {
    const letter = u.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(u);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold mb-3">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input className="input-field pl-9 py-2 text-sm" placeholder="Имя, @ник или номер..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-xl mx-2 hover:bg-muted transition-colors">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.15)" }}>
            <Icon name="UserPlus" size={20} style={{ color: "hsl(var(--primary))" }} />
          </div>
          <span className="font-medium text-sm" style={{ color: "hsl(var(--primary))" }}>Добавить контакт</span>
        </div>

        {Object.entries(byLetter).sort().map(([letter, users]) => (
          <div key={letter}>
            <div className="px-6 py-2">
              <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>{letter}</span>
            </div>
            {users.map(user => {
              const isOnline = ONLINE_USERS.has(user.id);
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors rounded-xl mx-2"
                  onClick={() => onStartChat(user)}
                >
                  <Avatar initials={user.avatar} userId={user.id} size="md" showOnline />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs" style={{ color: isOnline ? "hsl(var(--online))" : "hsl(var(--muted-foreground))" }}>
                      {isOnline ? "онлайн" : `@${user.username}`}
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-card transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <Icon name="MessageCircle" size={17} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Icon name="Users" size={36} style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

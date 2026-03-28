import { useState } from "react";
import type { User } from "./AuthScreen";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ProfileTabProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default function ProfileTab({ user, onUpdate }: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);

  const handleSave = () => {
    onUpdate({ ...user, name: name.trim(), bio: bio.trim(), username: username.trim() });
    setEditing(false);
  };

  const stats = [
    { label: "Чатов", value: "4" },
    { label: "Контактов", value: "5" },
    { label: "Сообщений", value: "128" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-shrink-0 pt-8 pb-6 flex flex-col items-center gap-3 relative" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}>
        <div className="relative">
          <Avatar initials={user.avatar} userId={user.id} size="lg" showOnline />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary))", color: "#fff" }}>
            <Icon name="Camera" size={13} />
          </button>
        </div>
        {!editing ? (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm mt-0.5" style={{ color: "hsl(var(--primary))" }}>@{user.username}</p>
              <p className="text-sm mt-2 px-8" style={{ color: "hsl(var(--muted-foreground))" }}>{user.bio}</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}
              onClick={() => setEditing(true)}
            >
              <Icon name="Pencil" size={14} /> Редактировать
            </button>
          </>
        ) : (
          <div className="w-full px-6 space-y-3 animate-scale-in">
            <input className="input-field text-center font-semibold" value={name} onChange={e => setName(e.target.value)} placeholder="Имя" />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>@</span>
              <input className="input-field pl-8" value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} placeholder="никнейм" />
            </div>
            <textarea className="input-field resize-none text-sm" rows={2} value={bio} onChange={e => setBio(e.target.value)} placeholder="О себе..." />
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors" style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }} onClick={() => setEditing(false)}>Отмена</button>
              <button className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors" style={{ background: "hsl(var(--primary))", color: "#fff" }} onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        <div className="flex gap-3">
          {stats.map(s => (
            <div key={s.label} className="flex-1 rounded-xl p-3 text-center" style={{ background: "hsl(var(--card))" }}>
              <div className="text-xl font-bold" style={{ color: "hsl(var(--primary))" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
          {[
            { icon: "Phone", label: "Номер телефона", value: user.phone },
            { icon: "AtSign", label: "Имя пользователя", value: `@${user.username}` },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                <Icon name={item.icon as "Phone"} size={16} style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.label}</div>
                <div className="text-sm font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

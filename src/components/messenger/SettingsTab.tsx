import { useState } from "react";
import type { User } from "./AuthScreen";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface SettingsTabProps {
  user: User;
  onLogout: () => void;
}

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
    style={{ background: checked ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
  >
    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm" style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }} />
  </button>
);

export default function SettingsTab({ user, onLogout }: SettingsTabProps) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);

  const sections = [
    {
      title: "Уведомления",
      items: [
        { icon: "Bell", label: "Push-уведомления", value: notifications, onChange: () => setNotifications(v => !v) },
        { icon: "Volume2", label: "Звуки сообщений", value: sounds, onChange: () => setSounds(v => !v) },
      ],
    },
    {
      title: "Приватность",
      items: [
        { icon: "Eye", label: "Подтверждение прочтения", value: readReceipts, onChange: () => setReadReceipts(v => !v) },
        { icon: "Wifi", label: "Показывать онлайн", value: onlineStatus, onChange: () => setOnlineStatus(v => !v) },
        { icon: "Clock", label: "Показывать время визита", value: lastSeen, onChange: () => setLastSeen(v => !v) },
      ],
    },
  ];

  const menuItems = [
    { icon: "Shield", label: "Безопасность", sub: "Пароль и двухфакторная аутентификация" },
    { icon: "Palette", label: "Оформление", sub: "Тема и шрифты" },
    { icon: "Download", label: "Данные и хранилище", sub: "Управление кэшем" },
    { icon: "HelpCircle", label: "Помощь", sub: "FAQ и поддержка" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold">Настройки</h2>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "hsl(var(--card))" }}>
          <Avatar initials={user.avatar} userId={user.id} size="md" showOnline />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{user.name}</div>
            <div className="text-xs" style={{ color: "hsl(var(--primary))" }}>@{user.username}</div>
          </div>
          <Icon name="ChevronRight" size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
        </div>
      </div>

      <div className="px-4 space-y-4 pb-4">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs font-semibold mb-2 px-1" style={{ color: "hsl(var(--muted-foreground))" }}>{section.title.toUpperCase()}</p>
            <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
              {section.items.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                    <Icon name={item.icon as "Bell"} size={15} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <Toggle checked={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-xs font-semibold mb-2 px-1" style={{ color: "hsl(var(--muted-foreground))" }}>ОБЩЕЕ</p>
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
            {menuItems.map((item, i) => (
              <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
                  <Icon name={item.icon as "Shield"} size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.sub}</div>
                </div>
                <Icon name="ChevronRight" size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
          onClick={onLogout}
        >
          <Icon name="LogOut" size={17} />
          <span className="text-sm font-semibold">Выйти из аккаунта</span>
        </button>

        <p className="text-center text-xs pb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Вектор v1.0.0</p>
      </div>
    </div>
  );
}

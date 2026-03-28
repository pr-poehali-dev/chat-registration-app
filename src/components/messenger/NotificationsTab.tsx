import { useState } from "react";
import { NOTIFICATIONS, MOCK_USERS } from "./data";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Уведомления</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "hsl(var(--primary))", color: "#fff" }}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="text-xs font-medium transition-colors" style={{ color: "hsl(var(--primary))" }} onClick={markAllRead}>
            Прочитать все
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <Icon name="Bell" size={36} style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Нет уведомлений</p>
          </div>
        )}
        {notifications.map((notif, i) => {
          const user = MOCK_USERS.find(u => u.id === notif.userId);
          if (!user) return null;
          return (
            <div
              key={notif.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-150 rounded-xl mx-2"
              style={{ background: notif.read ? "transparent" : "hsl(var(--primary) / 0.05)", animationDelay: `${i * 0.05}s` }}
              onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
            >
              <div className="relative">
                <Avatar initials={user.avatar} userId={user.id} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary))" }}>
                  <Icon name={notif.type === "message" ? "MessageCircle" : "UserPlus"} size={11} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm">
                  <span className="font-semibold">{user.name}</span>
                  <span style={{ color: "hsl(var(--muted-foreground))" }}> {notif.text}</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: "hsl(var(--primary))" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

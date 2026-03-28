import { useState, useRef, useEffect } from "react";
import type { User } from "./AuthScreen";
import { ONLINE_USERS, type Chat, type Message } from "./data";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ChatWindowProps {
  chat: Chat;
  partner: User;
  currentUser: User;
  onBack?: () => void;
}

export default function ChatWindow({ chat, partner, currentUser, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isOnline = ONLINE_USERS.has(partner.id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.id]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      chatId: chat.id,
      senderId: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages(prev => [...prev, newMsg]);
    chat.messages.push(newMsg);
    chat.lastMessage = newMsg.text;
    chat.lastTime = newMsg.time;
    setInput("");

    if (isOnline) {
      setTimeout(() => {
        const replies = ["Понял 👍", "Ок!", "Хорошо, спасибо!", "Отлично!", "Понятно, разберусь", "👌"];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          chatId: chat.id,
          senderId: partner.id,
          text: replies[Math.floor(Math.random() * replies.length)],
          time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
          read: false,
        };
        setMessages(prev => [...prev, reply]);
        chat.messages.push(reply);
      }, 1200 + Math.random() * 800);
    }
  };

  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
    const last = acc[acc.length - 1];
    if (!last) return [{ date: "Сегодня", msgs: [msg] }];
    last.msgs.push(msg);
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
        {onBack && (
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors mr-1" onClick={onBack}>
            <Icon name="ArrowLeft" size={18} />
          </button>
        )}
        <Avatar initials={partner.avatar} userId={partner.id} size="md" showOnline />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{partner.name}</div>
          <div className="text-xs" style={{ color: isOnline ? "hsl(var(--online))" : "hsl(var(--muted-foreground))" }}>
            {isOnline ? "онлайн" : "был(а) недавно"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="Phone" size={17} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="Video" size={17} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="MoreVertical" size={17} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ background: "hsl(var(--background))" }}>
        {groupedMessages.map(group => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="px-3 py-1 rounded-full text-xs" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>{group.date}</span>
            </div>
            <div className="space-y-1">
              {group.msgs.map((msg, i) => {
                const isMe = msg.senderId === "me";
                const showAvatar = !isMe && (i === 0 || group.msgs[i - 1]?.senderId !== msg.senderId);
                return (
                  <div key={msg.id} className={`flex items-end gap-2 animate-fade-in ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <div style={{ width: 28 }}>
                        {showAvatar && <Avatar initials={partner.avatar} userId={partner.id} size="sm" />}
                      </div>
                    )}
                    <div className={`max-w-xs px-4 py-2 ${isMe ? "msg-bubble-out" : "msg-bubble-in"}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{msg.time}</span>
                        {isMe && <Icon name={msg.read ? "CheckCheck" : "Check"} size={13} style={{ color: msg.read ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
            <Avatar initials={partner.avatar} userId={partner.id} size="lg" />
            <div className="text-center">
              <p className="font-semibold">{partner.name}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Начните диалог</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
        <div className="flex items-end gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0 mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="Paperclip" size={17} />
          </button>
          <div className="flex-1 relative">
            <textarea
              className="input-field resize-none py-2.5 pr-10 text-sm min-h-[44px] max-h-28"
              placeholder="Сообщение..."
              value={input}
              rows={1}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
              }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
            <button className="absolute right-2 bottom-2 transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Icon name="Smile" size={18} />
            </button>
          </div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 mb-0.5"
            style={{ background: input.trim() ? "hsl(var(--primary))" : "hsl(var(--muted))", color: input.trim() ? "#fff" : "hsl(var(--muted-foreground))" }}
            onClick={sendMessage}
          >
            <Icon name="Send" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

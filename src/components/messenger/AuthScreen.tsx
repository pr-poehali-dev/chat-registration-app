import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  bio: string;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Алексей Петров", username: "alex_petrov", phone: "+79161234567", avatar: "АП", bio: "Привет, я использую Вектор!", },
  { id: "2", name: "Мария Иванова", username: "maria_iv", phone: "+79031112233", avatar: "МИ", bio: "На связи 24/7" },
  { id: "3", name: "Дмитрий Ковалёв", username: "d_kovalev", phone: "+79876543210", avatar: "ДК", bio: "Разработчик, люблю кофе" },
];

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"phone" | "code" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    let formatted = "+";
    if (digits.length > 0) formatted += digits.slice(0, 1);
    if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ") " + digits.slice(4, 7);
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);
    return formatted;
  };

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11) { setError("Введите корректный номер"); return; }
    setError("");
    if (mode === "login") {
      const found = MOCK_USERS.find(u => u.phone.replace(/\D/g, "") === digits);
      if (!found) { setError("Пользователь не найден. Зарегистрируйтесь"); return; }
    }
    setStep("code");
  };

  const handleCodeSubmit = () => {
    if (code !== "1234") { setError("Неверный код. Введите 1234"); return; }
    setError("");
    if (mode === "login") {
      const digits = phone.replace(/\D/g, "");
      const found = MOCK_USERS.find(u => u.phone.replace(/\D/g, "") === digits);
      if (found) onAuth(found);
    } else {
      setStep("profile");
    }
  };

  const handleProfileSubmit = () => {
    if (!name.trim()) { setError("Введите имя"); return; }
    if (!username.trim() || username.length < 3) { setError("Никнейм минимум 3 символа"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError("Только латиница, цифры и _"); return; }
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      username: username.toLowerCase().trim(),
      phone,
      avatar: name.trim().slice(0, 2).toUpperCase(),
      bio: "Привет! Я использую Вектор",
    };
    MOCK_USERS.push(newUser);
    onAuth(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(199 89% 20% / 0.3) 0%, hsl(var(--background)) 70%)" }}>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--primary))" }}>
            <Icon name="Zap" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Вектор</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Быстрый и приватный мессенджер</p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          {step === "phone" && (
            <div className="animate-scale-in">
              <h2 className="font-semibold text-lg mb-1">{mode === "login" ? "Войти" : "Регистрация"}</h2>
              <p className="text-xs mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {mode === "login" ? "Введите номер телефона для входа" : "Создайте аккаунт по номеру телефона"}
              </p>
              <div className="space-y-3">
                <input
                  className="input-field"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()}
                  maxLength={18}
                />
                {error && <p className="text-xs" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
                <button className="btn-primary" onClick={handlePhoneSubmit}>Продолжить</button>
              </div>
              <div className="mt-4 text-center">
                <button
                  className="text-xs transition-colors"
                  style={{ color: "hsl(var(--primary))" }}
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                >
                  {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
                </button>
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                <p className="text-xs text-center mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Тестовые аккаунты:</p>
                <div className="space-y-1">
                  {MOCK_USERS.map(u => (
                    <button key={u.id} className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-muted" onClick={() => { setPhone(u.phone); }}>
                      <span style={{ color: "hsl(var(--primary))" }}>@{u.username}</span> — {u.phone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "code" && (
            <div className="animate-scale-in">
              <button className="flex items-center gap-1 text-xs mb-4 transition-colors" style={{ color: "hsl(var(--muted-foreground))" }} onClick={() => { setStep("phone"); setError(""); setCode(""); }}>
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="font-semibold text-lg mb-1">Код подтверждения</h2>
              <p className="text-xs mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                Отправили SMS на {phone}.<br />
                <span style={{ color: "hsl(var(--primary))" }}>Введите 1234 для теста</span>
              </p>
              <div className="space-y-3">
                <input
                  className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                  placeholder="• • • •"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
                  maxLength={4}
                />
                {error && <p className="text-xs" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
                <button className="btn-primary" onClick={handleCodeSubmit}>Подтвердить</button>
              </div>
            </div>
          )}

          {step === "profile" && (
            <div className="animate-scale-in">
              <h2 className="font-semibold text-lg mb-1">Ваш профиль</h2>
              <p className="text-xs mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>Как вас будут видеть другие</p>
              <div className="space-y-3">
                <input className="input-field" placeholder="Имя и фамилия" value={name} onChange={e => setName(e.target.value)} />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>@</span>
                  <input
                    className="input-field pl-8"
                    placeholder="никнейм"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  />
                </div>
                {error && <p className="text-xs" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
                <button className="btn-primary" onClick={handleProfileSubmit}>Создать аккаунт</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { MOCK_USERS };

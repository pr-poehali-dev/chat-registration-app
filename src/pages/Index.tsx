import { useState } from "react";
import AuthScreen, { type User } from "@/components/messenger/AuthScreen";
import Messenger from "@/components/messenger/Messenger";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <AuthScreen onAuth={setUser} />;
  return <Messenger user={user} onLogout={() => setUser(null)} />;
}

import { ONLINE_USERS } from "./data";

interface AvatarProps {
  initials: string;
  userId?: string;
  size?: "sm" | "md" | "lg";
  showOnline?: boolean;
}

const COLORS = [
  "hsl(199 89% 35%)",
  "hsl(262 60% 50%)",
  "hsl(22 80% 48%)",
  "hsl(142 60% 35%)",
  "hsl(330 70% 45%)",
  "hsl(45 85% 42%)",
];

function getColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const sizes = { sm: 36, md: 46, lg: 64 };
const fontSizes = { sm: "13px", md: "15px", lg: "22px" };

export default function Avatar({ initials, userId = "", size = "md", showOnline = false }: AvatarProps) {
  const px = sizes[size];
  const isOnline = showOnline && ONLINE_USERS.has(userId);

  return (
    <div className="relative flex-shrink-0" style={{ width: px, height: px }}>
      <div
        className="flex items-center justify-center rounded-full font-semibold text-white select-none"
        style={{ width: px, height: px, background: getColor(initials || userId), fontSize: fontSizes[size] }}
      >
        {initials}
      </div>
      {isOnline && (
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: size === "lg" ? 14 : 10,
            height: size === "lg" ? 14 : 10,
            background: "hsl(var(--online))",
            border: "2px solid hsl(var(--background))",
          }}
        />
      )}
    </div>
  );
}

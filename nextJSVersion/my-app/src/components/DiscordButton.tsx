import { CONFIG } from "@/config";
import { DiscordIcon } from "@/components/DiscordIcon";

// The Discord link, reused in the nav (with icon), the home CTA, and the
// footer — just with different classes / contents.
export function DiscordButton({
  className = "discord-btn",
  withIcon = true,
  children = "Discord",
}: {
  className?: string;
  withIcon?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <a className={className} href={CONFIG.DISCORD} target="_blank" rel="noopener noreferrer">
      {withIcon && <DiscordIcon />}
      {children}
    </a>
  );
}

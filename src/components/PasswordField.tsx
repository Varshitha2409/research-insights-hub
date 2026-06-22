import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkPassword, passwordStrength } from "@/lib/passwordStrength";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  showMeter?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export function PasswordField({ id, label, value, onChange, showMeter, autoComplete, placeholder }: Props) {
  const [show, setShow] = useState(false);
  const checks = checkPassword(value);
  const { level, score } = passwordStrength(value);
  const meterColor = level === "weak" ? "bg-destructive" : level === "medium" ? "bg-yellow-500" : "bg-green-500";
  const meterPct = Math.min(100, (score / 6) * 100);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          minLength={8}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showMeter && value && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full transition-all", meterColor)} style={{ width: `${meterPct}%` }} />
            </div>
            <span className={cn("text-xs font-medium capitalize", level === "weak" ? "text-destructive" : level === "medium" ? "text-yellow-600" : "text-green-600")}>
              {level}
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-1 text-xs">
            <Rule ok={checks.minLength} text="8+ characters" />
            <Rule ok={checks.upper} text="Uppercase letter" />
            <Rule ok={checks.lower} text="Lowercase letter" />
            <Rule ok={checks.number} text="Number" />
            <Rule ok={checks.special} text="Special character" />
          </ul>
        </div>
      )}
    </div>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className={cn("flex items-center gap-1.5", ok ? "text-green-600" : "text-muted-foreground")}>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {text}
    </li>
  );
}

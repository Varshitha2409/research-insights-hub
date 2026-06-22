export type Strength = "weak" | "medium" | "strong";

export interface PasswordCheck {
  minLength: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

export function checkPassword(pwd: string): PasswordCheck {
  return {
    minLength: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}

export function isPasswordValid(pwd: string): boolean {
  const c = checkPassword(pwd);
  return c.minLength && c.upper && c.lower && c.number && c.special;
}

export function passwordStrength(pwd: string): { level: Strength; score: number } {
  const c = checkPassword(pwd);
  const score = Object.values(c).filter(Boolean).length + (pwd.length >= 12 ? 1 : 0);
  if (score <= 2) return { level: "weak", score };
  if (score <= 4) return { level: "medium", score };
  return { level: "strong", score };
}

import { Duration } from "luxon";

export function convertToHours(value: string): number {
  const match = value.match(/^(\d+)([hd])$/);
  if (!match) throw new Error("Formato inválido");

  const amount = parseInt(match[1]);
  const unit = match[2] === "h" ? "hours" : "days";

  const duration = Duration.fromObject({ [unit]: amount });

  return duration.as("hours");
}

export function clearLocalStorage(){
  localStorage.clear();
}

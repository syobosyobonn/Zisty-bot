import { Member, Role } from "../deps.ts";
import { Config } from "../configs.ts";

type PermissionLevel = "mod" | "team" | "member";

export function hasPermission(member: Member): PermissionLevel | null {
  if (member.roles.includes(Config.role.mod)) {
    return "mod";
  }
  if (member.roles.includes(Config.role.team)) {
    return "team";
  }
  return "member";
}
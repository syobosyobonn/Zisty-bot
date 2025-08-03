import { Member } from "../deps.ts";
import { Config } from "../configs.ts";

type PermissionLevel = "mod" | "team" | "member";

export function hasPermission(member: Member): PermissionLevel | null {
    const memberRoles: BigInt[] = member.roles || [];
    console.log("Member Roles:", memberRoles);

    if (memberRoles.includes(Config.role.mod)) {
        return "mod";
    }
    if (memberRoles.includes(Config.role.team)) {
        return "team";
    }
    return "member";
}
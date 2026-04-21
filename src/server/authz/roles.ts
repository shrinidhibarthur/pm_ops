import { RoleKey } from "@prisma/client";

export const ADMIN_ROLE: RoleKey = "ADMIN";

export type ActorContext = {
  userId: string;
  email: string;
  roleKeys: Set<RoleKey>;
  teamIds: Set<string>;
};

export function hasRole(ctx: ActorContext, role: RoleKey) {
  return ctx.roleKeys.has(role);
}

export function isAdmin(ctx: ActorContext) {
  return hasRole(ctx, ADMIN_ROLE);
}


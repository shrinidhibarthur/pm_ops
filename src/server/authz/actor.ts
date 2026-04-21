import { RoleKey } from "@prisma/client";
import { getSession } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { type ActorContext } from "@/server/authz/roles";

export async function requireActor(): Promise<ActorContext> {
  const session = await getSession();
  const userId = session?.user?.id;
  const email = session?.user?.email;
  if (!userId || !email) throw new Error("UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
      teams: true,
    },
  });
  if (!user || !user.active) throw new Error("UNAUTHENTICATED");

  const roleKeys = new Set<RoleKey>(user.roles.map((ur) => ur.role.key));
  const teamIds = new Set<string>(user.teams.map((ut) => ut.teamId));

  return { userId: user.id, email: user.email, roleKeys, teamIds };
}


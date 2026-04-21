import { requireActor } from "@/server/authz/actor";
import { jsonError, jsonOk } from "@/server/http/route";
import { forbidden } from "@/server/http/errors";
import { runNotificationDispatcher } from "@/server/notifications/service";

export async function POST() {
  try {
    const actor = await requireActor();
    if (!actor.roleKeys.has("ADMIN")) throw forbidden("Only admins can run the dispatcher in this build.");
    return jsonOk(await runNotificationDispatcher(100));
  } catch (e) {
    return jsonError(e);
  }
}


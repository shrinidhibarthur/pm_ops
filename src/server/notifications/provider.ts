import { NotificationChannel } from "@prisma/client";

export type NotificationSendInput = {
  channel: NotificationChannel;
  to: string;
  type: string;
  payload: Record<string, unknown>;
};

export interface NotificationProvider {
  send(input: NotificationSendInput): Promise<void>;
}

export class StubNotificationProvider implements NotificationProvider {
  async send(_: NotificationSendInput): Promise<void> {
    // Intentionally no-op. In real providers, this would call Teams webhooks / SMTP / Graph API.
    return;
  }
}


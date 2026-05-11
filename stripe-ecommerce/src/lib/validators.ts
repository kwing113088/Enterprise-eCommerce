import { z } from 'zod';

export const CreatePaymentIntentSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(100),
      })
    )
    .min(1)
    .max(50),
  currency: z.string().length(3).default('usd'),
});

export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
});

export type CreatePaymentIntentInput = z.infer<typeof CreatePaymentIntentSchema>;

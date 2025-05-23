import {z} from "zod";

export const PlaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
    .min(3, {message: 'Name should be at least 3 characters'})
    .max(100, {message: 'Name shouldn\'t has more than 100 characters'}),
  city: z.string()
    .min(3, {message: 'City should be at least 3 characters'})
    .max(100, {message: 'City shouldn\'t has more than 100 characters'}),
  description: z.string()
    .min(3, {message: 'Description should be at least 3 characters'})
    .max(250, {message: 'Description shouldn\'t has more than 250 characters'}),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  photoIds: z.array(z.string()).default([]),
});

export type Place = z.infer<typeof PlaceSchema>;

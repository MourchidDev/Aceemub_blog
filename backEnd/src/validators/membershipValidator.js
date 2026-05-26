import { z } from "zod";

const membershipSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase().max(160),
  phone: z.string().trim().min(6).max(40),
  school: z.string().trim().min(2).max(120),
  level: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(100),
});

export default membershipSchema;
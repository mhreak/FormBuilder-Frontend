import { z } from "zod";

export const iconVariantSchema = z.enum([
  "Linear",
  "Outline",
  "TwoTone",
  "Bulk",
  "Broken",
  "Bold",
]);

export const formSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "نام سکشن الزامی است")
    .max(100, "نام سکشن نباید بیشتر از 100 کاراکتر باشد"),

  description: z
    .string()
    .trim()
    .max(500, "توضیحات نباید بیشتر از 500 کاراکتر باشد"),

  icon: z.object({
    name: z.string().min(1, "یک آیکون انتخاب کنید"),
    variant: iconVariantSchema,
  }),
});

export type FormSectionFormData = z.infer<typeof formSectionSchema>;

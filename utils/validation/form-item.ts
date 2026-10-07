import { z } from "zod";

const optionSchema = z.object({
  id: z.string().min(1),
  label: z
    .string()
    .trim()
    .min(1, "عنوان گزینه الزامی است.")
    .max(100, "عنوان گزینه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد."),
  value: z
    .string()
    .trim()
    .min(1, "مقدار گزینه الزامی است.")
    .max(100, "مقدار گزینه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد."),
});

export const formItemSchema = z
  .object({
    type: z.enum([
      "text",
      "textarea",
      "email",
      "number",
      "phone",
      "select",
      "multiselect",
      "date",
      "file",
    ]),

    title: z
      .string()
      .trim()
      .min(1, "عنوان فیلد الزامی است.")
      .max(100, "عنوان فیلد نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد."),

    description: z
      .string()
      .trim()
      .max(500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد."),

    required: z.boolean(),

    placeholder: z
      .string()
      .trim()
      .max(150, "متن راهنما نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد.")
      .optional(),

    options: z.array(optionSchema).optional(),

    min: z.number().optional(),

    max: z.number().optional(),

    accept: z.string().trim().max(200, "فرمت فایل نامعتبر است.").optional(),

    maxFileSize: z.number().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.type === "select" || data.type === "multiselect") &&
      (!data.options || data.options.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "حداقل یک گزینه اضافه کنید.",
      });
    }

    if (
      data.type === "number" &&
      data.min !== undefined &&
      data.max !== undefined &&
      data.min > data.max
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["min"],
        message: "حداقل مقدار نمی‌تواند بیشتر از حداکثر مقدار باشد.",
      });
    }

    if (
      data.type === "file" &&
      data.maxFileSize !== undefined &&
      data.maxFileSize <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxFileSize"],
        message: "حجم فایل باید بیشتر از صفر باشد.",
      });
    }
  });

export type FormItemFormData = z.infer<typeof formItemSchema>;

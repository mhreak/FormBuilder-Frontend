import type { FormItem, FormItemType, FormSection } from "../types/form";
import { FormItemFormData } from "./validation/form-item";
import type { FormSectionFormData } from "@/utils/validation/form-section";

export function getDefaultItemTitle(type: FormItemType) {
  const titles: Record<FormItemType, string> = {
    text: "متن کوتاه",
    textarea: "متن بلند",
    email: "ایمیل",
    number: "عدد",
    phone: "شماره تلفن",
    select: "انتخاب گزینه",
    multiselect: "انتخاب چند گزینه",
    date: "تاریخ",
    file: "آپلود فایل",
  };

  return titles[type];
}

export function getDefaultItemDescription(type: FormItemType) {
  const descriptions: Record<FormItemType, string> = {
    text: "متن کوتاه",
    textarea: "توضیحات خود را وارد کنید",
    email: "example@email.com",
    number: "یک عدد وارد کنید",
    phone: "شماره تماس خود را وارد کنید",
    select: "یک گزینه را انتخاب کنید",
    multiselect: "گزینه‌های موردنظر را انتخاب کنید",
    date: "تاریخ را انتخاب کنید",
    file: "فایل موردنظر را آپلود کنید",
  };

  return descriptions[type];
}

export function createDefaultItem(type: FormItemType): FormItem {
  const base: FormItem = {
    id: crypto.randomUUID(),
    type,
    title: getDefaultItemTitle(type),
    description: "",
    required: false,
    placeholder: "",
  };

  switch (type) {
    case "select":
    case "multiselect":
      return {
        ...base,
        options: [
          {
            id: crypto.randomUUID(),
            label: "گزینه اول",
            value: "option-1",
          },
          {
            id: crypto.randomUUID(),
            label: "گزینه دوم",
            value: "option-2",
          },
        ],
      };

    case "number":
      return {
        ...base,
        min: undefined,
        max: undefined,
      };

    case "file":
      return {
        ...base,
        accept: "",
        maxFileSize: undefined,
      };

    default:
      return base;
  }
}

export function createFormData(item: FormItem | null): FormItemFormData {
  if (!item) {
    return {
      type: "text",
      title: "",
      description: "",
      required: false,
      placeholder: "",
      options: undefined,
      min: undefined,
      max: undefined,
      accept: undefined,
      maxFileSize: undefined,
    };
  }

  return {
    type: item.type,
    title: item.title,
    description: item.description,
    required: item.required,
    placeholder: item.placeholder ?? "",
    options: item.options,
    min: item.min,
    max: item.max,
    accept: item.accept,
    maxFileSize: item.maxFileSize,
  };
}

export function createSectionFormData(
  section: FormSection | null,
): FormSectionFormData {
  if (!section) {
    return {
      title: "",
      description: "",
      icon: {
        name: "ElementPlus",
        variant: "Linear",
      },
    };
  }

  return {
    title: section.title,
    description: section.description ?? "",
    icon: section.icon ?? {
      name: "ElementPlus",
      variant: "Linear",
    },
  };
}

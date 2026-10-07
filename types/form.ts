export type FormItemType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "select"
  | "multiselect"
  | "date"
  | "file";

export type FormItemOption = {
  id: string;
  label: string;
  value: string;
};

export type FormItem = {
  id: string;
  type: FormItemType;

  title: string;
  description: string;
  required: boolean;

  placeholder?: string;

  options?: FormItemOption[];

  min?: number;
  max?: number;

  accept?: string;
  maxFileSize?: number;
};

export interface FormSection {
  id: string;
  title: string;
  description: string;
  icon?: SectionIcon;
  items: FormItem[];
}

export type FormStage = {
  id: string;
  title: string;
  description: string;
  sections: FormSection[];
};

export type FormData = {
  id: string;
  title: string;
  description: string;
  stages: FormStage[];
};

export type IconVariant =
  | "Linear"
  | "Outline"
  | "TwoTone"
  | "Bulk"
  | "Broken"
  | "Bold";

export interface SectionIcon {
  name: string;
  variant: IconVariant;
}

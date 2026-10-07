import FormBuilder from "@/components/templates/create-form/FormBuilder";

interface EditFormProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditForm({ params }: EditFormProps) {
  const { id } = await params;

  return <FormBuilder mode="edit" formId={id} />;
}

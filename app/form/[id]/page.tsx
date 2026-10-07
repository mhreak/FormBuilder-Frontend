import { notFound } from "next/navigation";
import type { FormData } from "@/types/form";
import FormView from "@/components/templates/view-form/FormView";

interface FormPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { id } = await params;

  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_APP_URL}/api/forms/${id}`,
  //     {
  //       cache: "no-store",
  //     },
  //   );

  //   if (!response.ok) {
  //     notFound();
  //   }

  //   const form: FormData = await response.json();
  const initialForm: FormData = {
    id: "form-1",
    title: "فرم ثبت‌نام دوره آموزشی",

    description: "اطلاعات خود را برای ثبت‌نام در دوره وارد کنید.",

    stages: [
      {
        id: "stage-1",
        title: "اطلاعات شخصی",
        description: "اطلاعات اولیه شرکت‌کننده را وارد کنید.",

        sections: [
          {
            id: "section-1",
            title: "اطلاعات تماس",
            description: "راه‌های ارتباطی شما",

            items: [
              {
                id: "item-1",
                type: "text",
                title: "نام و نام خانوادگی",
                description: "نام کامل خود را وارد کنید",
                required: true,
              },
              {
                id: "item-2",
                type: "email",
                title: "ایمیل",
                description: "example@email.com",
                required: true,
              },
              {
                id: "item-3",
                type: "phone",
                title: "شماره تلفن",
                description: "شماره تماس خود را وارد کنید",
                required: false,
              },
            ],
          },
        ],
      },
      {
        id: "stage-2",
        title: "اطلاعات شخصی",
        description: "اطلاعات اولیه شرکت‌کننده را وارد کنید.",

        sections: [
          {
            id: "section-1",
            title: "اطلاعات تماس",
            description: "راه‌های ارتباطی شما",

            items: [
              {
                id: "item-1",
                type: "text",
                title: "نام و نام خانوادگی",
                description: "نام کامل خود را وارد کنید",
                required: true,
              },
              {
                id: "item-2",
                type: "email",
                title: "ایمیل",
                description: "example@email.com",
                required: true,
              },
              {
                id: "item-3",
                type: "phone",
                title: "شماره تلفن",
                description: "شماره تماس خود را وارد کنید",
                required: false,
              },
            ],
          },
        ],
      },
    ],
  };

  return <FormView form={initialForm} />;
}

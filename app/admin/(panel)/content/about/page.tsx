import ContentForm from "../../../../components/admin/ContentForm";
import ImageField from "../../../../components/admin/ImageField";
import { getAboutContent } from "../../../../lib/site-content";
import { saveAboutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  const content = await getAboutContent();

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Про шефа
      </h1>

      <p className="mt-4 max-w-2xl text-sm text-zinc-500">
        Секція «About» на головній сторінці. Абзаци розділяються порожнім
        рядком, спеціалізації — кожна з нового рядка.
      </p>

      <div className="mt-10">
        <ContentForm
          action={saveAboutAction}
          context="the «About the chef» section of a private chef's website: a heading, a short biography, a list of specialities and a personal quote"
          fields={[
            { name: "heading", label: "Заголовок", value: content.heading },
            { name: "body", label: "Текст", multiline: true, value: content.body },
            {
              name: "specialities",
              label: "Спеціалізації",
              multiline: true,
              value: content.specialities,
            },
            { name: "quote", label: "Цитата", value: content.quote },
          ]}
        >
          <div className="md:col-span-2">
            <ImageField
              label="Портрет"
              name="photo"
              currentUrl={content.photo}
              removeName="removePhoto"
              hint="Вертикальне фото, пропорція 2:3. JPG, PNG, WebP або AVIF, до 8 МБ."
            />
          </div>
        </ContentForm>
      </div>
    </div>
  );
}

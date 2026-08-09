import AdminField from "../../../../components/admin/AdminField";
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
        <ContentForm action={saveAboutAction}>
          <AdminField
            label="Заголовок"
            name="headingUk"
            defaultValue={content.heading.uk}
          />
          <AdminField
            label="Заголовок англійською"
            name="headingEn"
            defaultValue={content.heading.en}
          />

          <AdminField
            label="Текст"
            name="bodyUk"
            multiline
            defaultValue={content.body.uk}
          />
          <AdminField
            label="Текст англійською"
            name="bodyEn"
            multiline
            defaultValue={content.body.en}
          />

          <AdminField
            label="Спеціалізації"
            name="specialitiesUk"
            multiline
            defaultValue={content.specialities.uk}
          />
          <AdminField
            label="Спеціалізації англійською"
            name="specialitiesEn"
            multiline
            defaultValue={content.specialities.en}
          />

          <AdminField
            label="Цитата"
            name="quoteUk"
            defaultValue={content.quote.uk}
          />
          <AdminField
            label="Цитата англійською"
            name="quoteEn"
            defaultValue={content.quote.en}
          />

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

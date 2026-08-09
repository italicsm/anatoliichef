import AdminField from "../../../../components/admin/AdminField";
import ContentForm from "../../../../components/admin/ContentForm";
import { getContactContent } from "../../../../lib/site-content";
import { saveContactAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ContactContentPage() {
  const content = await getContactContent();

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Контакти
      </h1>

      <p className="mt-4 max-w-2xl text-sm text-zinc-500">
        Секція «Contact» на головній сторінці. Телефон і пошта стають
        клікабельними, посилання на соцмережі відкриваються в новій вкладці.
      </p>

      <div className="mt-10">
        <ContentForm action={saveContactAction}>
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
            label="Примітка про доступність"
            name="availabilityUk"
            defaultValue={content.availability.uk}
          />
          <AdminField
            label="Примітка англійською"
            name="availabilityEn"
            defaultValue={content.availability.en}
          />

          <AdminField
            label="Телефон"
            name="phone"
            required
            defaultValue={content.phone}
            placeholder="+34 600 000 000"
          />
          <AdminField
            label="Пошта"
            name="email"
            required
            defaultValue={content.email}
            placeholder="hello@example.com"
          />

          <AdminField
            label="Місто"
            name="locationUk"
            defaultValue={content.location.uk}
          />
          <AdminField
            label="Місто англійською"
            name="locationEn"
            defaultValue={content.location.en}
          />

          <AdminField
            label="Telegram"
            name="telegram"
            defaultValue={content.telegram}
            placeholder="https://t.me/…"
          />
          <AdminField
            label="WhatsApp"
            name="whatsapp"
            defaultValue={content.whatsapp}
            placeholder="https://wa.me/…"
          />
          <AdminField
            label="Instagram"
            name="instagram"
            defaultValue={content.instagram}
            placeholder="https://instagram.com/…"
          />
          <AdminField
            label="Facebook"
            name="facebook"
            defaultValue={content.facebook}
            placeholder="https://facebook.com/…"
          />
        </ContentForm>
      </div>
    </div>
  );
}

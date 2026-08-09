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
        <ContentForm
          action={saveContactAction}
          context="the «Contact» section of a private chef's website: a heading, an invitation to get in touch, a note about availability and the city"
          fields={[
            { name: "heading", label: "Заголовок", value: content.heading },
            { name: "body", label: "Текст", multiline: true, value: content.body },
            {
              name: "availability",
              label: "Примітка про доступність",
              value: content.availability,
            },
            { name: "location", label: "Місто", value: content.location },
          ]}
        >
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

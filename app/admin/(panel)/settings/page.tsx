import Link from "next/link";
import GeminiSettingsForm from "../../../components/admin/GeminiSettingsForm";
import NotificationSettingsForm from "../../../components/admin/NotificationSettingsForm";
import {
  describeGeminiKey,
  describeNotificationSettings,
  getGeminiModel,
} from "../../../lib/admin/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [key, model, notifications] = await Promise.all([
    describeGeminiKey(),
    getGeminiModel(),
    describeNotificationSettings(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Налаштування
      </h1>

      <section className="mt-12 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Куди приходять замовлення
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-zinc-500">
          Кожне замовлення й кожен запит із сайту йде обома каналами одразу.
          Достатньо одного з них: якщо Telegram недоступний, спрацює пошта, і
          навпаки. Поки не налаштований жоден, замовлення пишуться в журнал
          сервера — вони не губляться, але й нікуди не приходять.
        </p>

        <div className="mt-8">
          <NotificationSettingsForm settings={notifications} />
        </div>
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Контакти на сайті
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-zinc-500">
          Телефон, пошта й посилання на Telegram, WhatsApp, Instagram і Facebook,
          які бачить гість, живуть у розділі{" "}
          <Link
            href="/admin/content/contact"
            className="text-zinc-900 underline underline-offset-4"
          >
            «Контакти»
          </Link>
          . Вони навмисно окремо від налаштувань вище: адреса, куди приходять
          замовлення, і адреса, яку показують гостям, — різні речі, і тримати їх
          в одному полі означало б рано чи пізно опублікувати не те.
        </p>
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Автоматичний переклад
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-zinc-500">
          У формі страви кнопка «Переклад АІ» заповнює англійську та іспанську
          з української через Gemini. Переклад ніколи не запускається сам:
          спершу ви бачите результат у полях, потім зберігаєте.
        </p>

        <div className="mt-8">
          <GeminiSettingsForm
            isSet={key.isSet}
            source={key.source}
            model={model}
          />
        </div>
      </section>
    </div>
  );
}

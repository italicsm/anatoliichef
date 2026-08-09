import GeminiSettingsForm from "../../../components/admin/GeminiSettingsForm";
import {
  describeGeminiKey,
  getGeminiModel,
} from "../../../lib/admin/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [key, model] = await Promise.all([
    describeGeminiKey(),
    getGeminiModel(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Налаштування
      </h1>

      <section className="mt-12 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Автоматичний переклад
        </h2>

        <p className="mt-4 max-w-xl text-sm text-zinc-500">
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

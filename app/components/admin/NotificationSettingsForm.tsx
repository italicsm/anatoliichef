"use client";

import { useActionState, useState } from "react";
import {
  findTelegramChatsAction,
  saveNotificationsAction,
  sendTestNotificationAction,
  type ActionState,
  type TestResult,
} from "../../admin/(panel)/settings/actions";
import type { NotificationSettings } from "../../lib/admin/settings";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField, { adminFieldStyles, adminLabelStyles } from "./AdminField";

const CHANNEL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  email: "Пошта",
  console: "Журнал сервера",
};

function sourceNote(source: "env" | "database" | null): string {
  return source === "env"
    ? " Задано змінною оточення — вона має пріоритет над збереженим тут."
    : "";
}

export default function NotificationSettingsForm({
  settings,
}: {
  settings: NotificationSettings;
}) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    saveNotificationsAction,
    {}
  );

  const [chatId, setChatId] = useState(settings.telegramChat.value);
  // The chat id cannot be found without a token, and the token cannot be saved
  // before the chat id is known — so the lookup reads the field, not the
  // database.
  const [token, setToken] = useState("");

  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);

  async function handleTest() {
    setIsTesting(true);
    setResults(null);
    setTestError(null);

    const outcome = await sendTestNotificationAction();

    setResults(outcome.results);
    setTestError(outcome.error ?? null);
    setIsTesting(false);
  }

  async function handleFindChats() {
    setIsSearching(true);
    setChats([]);
    setChatError(null);

    const outcome = await findTelegramChatsAction(token);

    setChats(outcome.chats);
    setChatError(outcome.error ?? null);
    setIsSearching(false);
  }

  return (
    <div className="max-w-2xl">
      <form action={action}>
        <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Telegram
        </h3>

        <div className="mt-6">
          <label className={adminLabelStyles} htmlFor="telegram-token">
            {settings.telegramToken.isSet ? "Новий токен бота" : "Токен бота"}
          </label>
          <input
            id="telegram-token"
            name="telegramToken"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder={
              settings.telegramToken.isSet
                ? "залиште порожнім, щоб не змінювати"
                : "1234567890:AA…"
            }
            className={`${adminFieldStyles} mt-2`}
          />
          {/* The panel knows whether this is set, so it says what to do next
              rather than repeating the first-time instructions forever. */}
          <p className="mt-3 text-xs text-zinc-400">
            {settings.telegramToken.isSet
              ? "Бот підключений. Заповніть це поле лише якщо міняєте бота — показати збережений токен неможливо, лише замінити або прибрати."
              : "Створюється в Telegram у боті @BotFather за хвилину."}
            {sourceNote(settings.telegramToken.source)}
          </p>
        </div>

        {settings.telegramToken.isSet &&
        settings.telegramToken.source === "database" ? (
          <label className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              name="clearTelegramToken"
              className="h-4 w-4 accent-zinc-900"
            />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Прибрати збережений токен
            </span>
          </label>
        ) : null}

        <div className="mt-8">
          <AdminField
            label="Кому надсилати (ID чату)"
            name="telegramChat"
            value={chatId}
            onChange={setChatId}
            placeholder="123456789 або @назва_каналу"
          />
          <p className="mt-3 text-xs text-zinc-400">
            {settings.telegramChat.value
              ? "Замовлення йдуть у цей чат. Щоб надсилати їх в інше місце: напишіть боту з потрібного чату — у групі саме «/start» — і натисніть «Знайти чати»."
              : "Бот не вміє писати людині за ніком — йому потрібен числовий ID, і він дізнається його лише після того, як ви першим напишете боту. Напишіть йому будь-що — у групі саме «/start» — тоді натисніть «Знайти чати»."}
            {sourceNote(settings.telegramChat.source)}
          </p>

          <button
            type="button"
            onClick={handleFindChats}
            disabled={isSearching}
            className="mt-4 inline-flex items-center gap-3 border border-zinc-300 px-5 py-2 text-xs uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-40"
          >
            {isSearching ? <Spinner /> : null}
            {isSearching ? "Шукаємо" : "Знайти чати"}
          </button>

          {chatError ? (
            <p aria-live="polite" className="mt-3 text-sm text-red-700">
              {chatError}
            </p>
          ) : null}

          {chats.length > 0 ? (
            <ul aria-live="polite" className="mt-4 space-y-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => setChatId(chat.id)}
                    className="text-sm text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline"
                  >
                    {chat.id}
                    {chat.title ? ` — ${chat.title}` : ""}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <h3 className="mt-14 text-xs uppercase tracking-[0.25em] text-zinc-500">
          Пошта
        </h3>

        <div className="mt-6">
          <label className={adminLabelStyles} htmlFor="resend-key">
            {settings.resendKey.isSet ? "Новий ключ Resend" : "Ключ Resend"}
          </label>
          <input
            id="resend-key"
            name="resendKey"
            type="password"
            autoComplete="off"
            placeholder={
              settings.resendKey.isSet
                ? "залиште порожнім, щоб не змінювати"
                : "re_…"
            }
            className={`${adminFieldStyles} mt-2`}
          />
          <p className="mt-3 text-xs text-zinc-400">
            {settings.resendKey.isSet
              ? "Пошта підключена як запасний канал: спрацює, якщо Telegram виявиться недоступним. Заповніть поле лише щоб замінити ключ."
              : "Пошта — запасний канал на випадок, якщо Telegram недоступний. Без ключа вона просто не використовується."}
            {sourceNote(settings.resendKey.source)}
          </p>
        </div>

        {settings.resendKey.isSet && settings.resendKey.source === "database" ? (
          <label className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              name="clearResendKey"
              className="h-4 w-4 accent-zinc-900"
            />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Прибрати збережений ключ
            </span>
          </label>
        ) : null}

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <AdminField
            label="Кому надсилати"
            name="emailTo"
            defaultValue={settings.emailTo.value}
            placeholder="chef@example.com"
          />

          <AdminField
            label="Від кого"
            name="emailFrom"
            defaultValue={settings.emailFrom.value}
            placeholder="orders@ваш-домен.com"
          />
        </div>

        <p className="mt-3 text-xs text-zinc-400">
          Адреса «від кого» має належати домену, підтвердженому в Resend —
          чужу адресу сервіс відхилить.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="gap-3 text-xs uppercase tracking-[0.2em]"
          >
            {isPending ? <Spinner /> : null}
            {isPending ? "Зберігаємо" : "Зберегти"}
          </Button>

          {state.error ? (
            <p aria-live="polite" className="text-sm text-red-700">
              {state.error}
            </p>
          ) : null}

          {state.savedAt && !state.error ? (
            <p aria-live="polite" className="text-sm text-emerald-700">
              Збережено.
            </p>
          ) : null}
        </div>
      </form>

      {/*
        Outside the form on purpose: a test sends through whatever is already
        saved, so pressing it must never be confused with submitting the fields
        currently on screen.
      */}
      <div className="mt-12 border-t border-zinc-200 pt-8">
        <button
          type="button"
          onClick={handleTest}
          disabled={isTesting}
          className="inline-flex items-center gap-3 border border-zinc-300 px-6 py-3 text-xs uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-40"
        >
          {isTesting ? <Spinner /> : null}
          {isTesting ? "Надсилаємо" : "Перевірити звʼязок"}
        </button>

        <p className="mt-3 text-xs text-zinc-400">
          Надішле тестове повідомлення тими каналами, які збережені зараз —
          щойно введені, але не збережені зміни воно не бачить.
        </p>

        {testError ? (
          <p aria-live="polite" className="mt-4 text-sm text-red-700">
            {testError}
          </p>
        ) : null}

        {results && results.length > 0 ? (
          <ul aria-live="polite" className="mt-4 space-y-1">
            {results.map((result) => (
              <li
                key={result.channel}
                className={`text-sm ${
                  result.delivered ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {CHANNEL_LABELS[result.channel] ?? result.channel}:{" "}
                {result.delivered
                  ? "доставлено"
                  : `не вдалося${result.reason ? ` — ${result.reason}` : ""}`}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

import OrderStatusControl from "../../../components/admin/OrderStatusControl";
import { listOrders } from "../../../lib/admin/orders";
import { formatPrice } from "../../../lib/format";

export const dynamic = "force-dynamic";

const dateTimeFormatter = new Intl.DateTimeFormat("uk-UA", {
  timeZone: "Europe/Madrid",
  dateStyle: "short",
  timeStyle: "short",
});

export default async function OrdersPage() {
  let orders;

  try {
    orders = await listOrders();
  } catch (error) {
    return (
      <p className="text-red-700">
        {error instanceof Error ? error.message : "Помилка бази даних."}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Замовлення
      </h1>

      {orders.length === 0 ? (
        <p className="mt-10 text-zinc-500">Замовлень ще немає.</p>
      ) : null}

      <ul className="mt-10">
        {orders.map((order) => (
          <li key={order.id} className="border-b border-zinc-200 py-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-zinc-900">
                  {order.number}
                  <span className="ml-4 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {dateTimeFormatter.format(new Date(order.createdAt))}
                  </span>
                </p>

                <p className="mt-2 text-zinc-700">
                  {order.name}
                  <a
                    href={`tel:${order.phone.replace(/\s/g, "")}`}
                    className="ml-4 text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    {order.phone}
                  </a>
                </p>

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {[
                    order.eventDate ? `дата: ${order.eventDate}` : null,
                    order.guests ? `гостей: ${order.guests}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "деталі не вказані"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-xl tabular-nums text-zinc-900">
                  {formatPrice(order.total)}
                </span>

                <OrderStatusControl id={order.id} status={order.status} />
              </div>
            </div>

            {order.comment ? (
              <p className="mt-4 max-w-2xl text-sm text-zinc-500">
                «{order.comment}»
              </p>
            ) : null}

            <ul className="mt-5 space-y-1">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-baseline gap-x-4 text-sm text-zinc-600"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {item.menuSlug}
                  </span>
                  <span>{item.dishTitle}</span>
                  {item.portion ? (
                    <span className="text-zinc-400">{item.portion}</span>
                  ) : null}
                  <span className="tabular-nums">× {item.quantity}</span>
                  <span className="tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

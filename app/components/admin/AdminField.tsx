export const adminFieldStyles =
  "w-full border-b border-zinc-300 bg-transparent py-2 text-zinc-900 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-900";

export const adminLabelStyles =
  "text-xs uppercase tracking-[0.25em] text-zinc-500";

type AdminFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  multiline?: boolean;
  className?: string;
};

/** Shared so every admin form looks the same without repeating the classes. */
export default function AdminField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  pattern,
  multiline,
  className = "",
}: AdminFieldProps) {
  const id = `field-${name}`;

  return (
    <div className={className}>
      <label htmlFor={id} className={adminLabelStyles}>
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={`${adminFieldStyles} mt-2 resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          pattern={pattern}
          className={`${adminFieldStyles} mt-2`}
        />
      )}
    </div>
  );
}

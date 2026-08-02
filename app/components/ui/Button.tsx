type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="rounded-full bg-black px-10 py-4 text-white transition hover:bg-zinc-800">
      {children}
    </button>
  );
}
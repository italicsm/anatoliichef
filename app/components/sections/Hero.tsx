import Button from "../ui/Button";
import Container from "../ui/Container";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center bg-white">
      <Container>
        <div className="text-center">

          <h1 className="text-6xl font-extralight tracking-wide text-zinc-900">
            Anatolii Lukianchuk
          </h1>

          <p className="mt-5 text-sm uppercase tracking-[0.6em] text-zinc-500">
            Private Chef
          </p>

          <p className="mx-auto mt-10 max-w-xl text-lg leading-8 text-zinc-600">
            Creating unforgettable dining experiences in Valencia.
          </p>

          <div className="mt-12">
            <Button>
              Reserve a Dinner
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
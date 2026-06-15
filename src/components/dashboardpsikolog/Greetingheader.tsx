interface GreetingHeaderProps {
  name: string;
}

export default function GreetingHeader({ name }: GreetingHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
        Halo, {name}.
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Bagaimana perasaanmu hari ini? Luangkan waktu sejenak untuk mengenali
        dirimu sendiri.
      </p>
    </div>
  );
}
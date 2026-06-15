interface ClientListHeaderProps {
  title: string;
  description: string;
}

export default function ClientListHeader({
  title,
  description,
}: ClientListHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
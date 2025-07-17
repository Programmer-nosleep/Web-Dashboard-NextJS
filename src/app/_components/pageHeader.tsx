export default function PageHeader({ children, ...props }: { children: React.ReactNode }) {
  return (
    <div {...props}>
      <h1 className="text-xl font-semibold">{ children }</h1>
    </div>
  );
}
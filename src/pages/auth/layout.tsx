export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }} className="bg-primary-700">
      <div className="h-full">{children}</div>
    </div>
  );
}

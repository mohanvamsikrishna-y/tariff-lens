export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}

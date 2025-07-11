export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className=" bg-amber-200 h-[300px] w-full"></div>
      {children}
    </>
  );
}

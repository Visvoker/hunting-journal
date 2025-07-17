export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className=" bg-[#FDE68A] h-[300px] w-full"></div>
      {children}
    </>
  );
}

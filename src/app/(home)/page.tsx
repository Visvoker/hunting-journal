import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-zinc-100 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 ">
      <Image
        src="MapleStoryLogo.svg"
        alt="MonsterDetail"
        width={500}
        height={450}
        className=" border-2 border-black"
      />
      <div>
        <Logo />
        <h1 className="text-4xl my-6 max-w-[500px]">
          想知道怪物<span className="font-extrabold ">掉落物及裝備</span>
          之間的機率嗎？
        </h1>
        <p className="text-2xl max-w-[600px text-center">
          紀錄打寶的過程讓打怪更有趣
        </p>
        <div className="my-10 space-x-3 flex justify-end">
          <Button asChild>
            <Link href="/signup">開始狩獵</Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href="/login">登入</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

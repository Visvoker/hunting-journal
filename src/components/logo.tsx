import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/MapleStoryLogo.svg"
        alt="logo"
        width={30}
        height={30}
      />
    </Link>
  );
}

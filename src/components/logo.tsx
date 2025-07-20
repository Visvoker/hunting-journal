import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/MapleStoryLogo.svg"
        alt="logo"
        width={25}
        height={25}
      />
    </Link>
  );
}

// src/app/page.tsx
"use client"; // ⚠️ 一定要加

import { useEffect, useState } from "react";

type Monster = {
  id: string;
  name: string;
  dropRate: string;
  // 根據試算表的欄位再補
};

export default function Home() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/monsters") // ← 跟你的 route 同步
      .then((res) => {
        if (!res.ok) throw new Error(`狀態碼 ${res.status}`);
        return res.json();
      })
      .then((data: Monster[]) => {
        setMonsters(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>載入中...</p>;
  if (error) return <p className="text-red-500">抓取失敗：{error}</p>;

  console.log(monsters);

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">怪物掉落資料</h3>
      <h3>怪物名稱:</h3>
      <h4>錢:</h4>
    </div>
  );
}

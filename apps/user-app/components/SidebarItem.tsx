"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div
      className={`flex items-center p-4 pl-6 cursor-pointer transition-colors duration-200 ${
        selected
          ? "bg-purple-600 text-white"
          : "text-gray-700 hover:bg-purple-100"
      }`}
      onClick={() => router.push(href)}
    >
      <div className="pr-4">{icon}</div>
      <div
        className={`font-semibold ${selected ? "text-white" : "text-gray-700"}`}
      >
        {title}
      </div>
    </div>
  );
};

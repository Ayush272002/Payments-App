import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="shadow-lg p-6 bg-white rounded-xl bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-xl font-semibold border-b border-gray-200 pb-3 text-gray-700">
        {title}
      </h1>
      <div className="pt-4">{children}</div>
    </div>
  );
}

import Link from "next/link";

interface BottomWarningProps {
  label: string;
  buttonText: string;
  to: string;
}

export const BottomWarning = ({
  label,
  buttonText,
  to,
}: BottomWarningProps) => {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>{label}</div>
      <Link
        href={to}
        className="pointer underline cursor-pointer text-indigo-600 hover:underline pl-1"
      >
        {buttonText}
      </Link>
    </div>
  );
};

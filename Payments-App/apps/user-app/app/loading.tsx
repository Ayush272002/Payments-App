import { Spinner } from "@repo/ui/spinner";

export default function () {
  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <Spinner />
      </div>
    </div>
  );
}

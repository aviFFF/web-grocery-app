import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
    </div>
  );
}

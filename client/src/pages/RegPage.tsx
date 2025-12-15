import { ModeToggle } from "@/components/mode-toggle";
import { RegForm } from "@/components/reg-form";

export default function RegPage() {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <ModeToggle />
        <div className="flex w-full max-w-sm flex-col gap-6">
          <RegForm />
        </div>
      </div>
    </>
  );
}

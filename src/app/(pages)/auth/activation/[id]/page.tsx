import { activateUser } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

const ActivationPage = async ({ params }: Props) => {
  const result = await activateUser(params.id);
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-20 ">
      <p
        className={cn("p-5 rounded-md text-white text-3xl font-bold", {
          "bg-pink-500": !result.success,
          "bg-green-500": result.success,
        })}
      >
        {result.message}
      </p>
      <Link href="/auth/login">
        <Button>Please Login</Button>
      </Link>
    </div>
  );
};

export default ActivationPage;

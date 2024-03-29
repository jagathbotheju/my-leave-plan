import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotAuthorizedPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Header title="Not Authorized..." className="bg-red-100 text-red-500" />

      <div className="flex flex-col container mx-auto max-w-7xl">
        <div className="mt-20 flex flex-col gap-4 justify-center font-semibold text-3xl">
          <p>Your are not Authorized view this page</p>
          <p>Please contact ADMIN</p>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";
import { Suspense } from "react";

interface Props {
  params: {
    id: string;
  };
}

const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJwt(params.id);

  if (!payload) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        Link is not valid, please try again.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Header title="Resetting Password" />

      <div className="flex flex-col container mx-auto max-w-7xl mt-16 items-start">
        <Suspense fallback={<Loading />}>
          <div className="w-[40%]">
            <ResetPasswordForm id={params.id} />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

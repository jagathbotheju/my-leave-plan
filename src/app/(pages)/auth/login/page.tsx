import LoginForm from "@/components/LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = ({ searchParams }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col p-5 shadow-lg w-full md:w-[50%] lg:w-[30%] xl:w-[20%]">
        <h1 className="font-bold text-3xl mb-10 text-center">Log In</h1>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
};

export default LoginPage;

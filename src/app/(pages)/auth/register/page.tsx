import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col p-4 shadow-lg w-full md:w-[50%] lg:w-[30%] xl:w-[25%] mt-20">
        <h1 className="font-bold text-3xl my-10 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

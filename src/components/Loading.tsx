import { IoReloadSharp } from "react-icons/io5";

const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center container mx-auto mt-20">
      <IoReloadSharp className="mr-2 h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;

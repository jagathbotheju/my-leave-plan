import Link from "next/link";
// import AuthButton from "./AuthButton";
import { ThemeSwitcher } from "./ThemeSwitcher";
import AuthButton from "./AuthButton";

const Navbar = () => {
  return (
    <div className="flex w-full shadow-lg h-20 dark:bg-slate-700">
      <div className="flex items-center justify-between container max-w-6xl w-full p-5">
        <Link href="/" className="text-3xl font-semibold">
          My Leave Plan
        </Link>
        <div className="flex items-center gap-4">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

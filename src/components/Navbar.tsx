import Link from "next/link";
// import AuthButton from "./AuthButton";
import { ThemeSwitcher } from "./ThemeSwitcher";
import AuthButton from "./AuthButton";
import Image from "next/image";
import { GlowingStarsBackgroundCard } from "./ui/glowing-stars";

const Navbar = () => {
  return (
    <div className="flex w-full shadow-lg shadow-sky-600 h-20 dark:bg-slate-700 relative">
      <div className="flex items-center justify-between container max-w-6xl w-full p-5">
        <div className="flex items-center">
          <div className="flex w-[130px] h-[100px] relative p-5">
            <Image
              src="/images/summer-holidays.png"
              className="absolute mt-[10px]"
              alt="logo"
              // width={150}
              // height={50}
              fill
            />
          </div>
          <Link href="/" className="text-4xl font-bold">
            My Leave Plan
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
      {/* <GlowingStarsBackgroundCard /> */}
    </div>
  );
};

export default Navbar;

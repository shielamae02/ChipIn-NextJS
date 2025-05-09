import ChipInLogo from "@/public/chipin-logo.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <div className='flex items-center font-bold text-xl'>
      <Image src={ChipInLogo} alt='ChipIn Logo' width={40} height={40} />
      Chip
      <span className='text-yellow-400'>In</span>
    </div>
  );
};

export { Logo };

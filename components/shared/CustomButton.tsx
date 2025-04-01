import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface CustomButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonText: string;
  buttonLoadingText?: string;
  type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  buttonText,
  buttonLoadingText,
  type,
}) => {
  return (
    <Button
      type={type}
      className='w-full h-11 rounded-md'
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <>
          <Loader2Icon className='animate-spin' /> {buttonLoadingText}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};

export { CustomButton };

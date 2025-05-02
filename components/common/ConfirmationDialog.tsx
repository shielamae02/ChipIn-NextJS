import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTitle } from "../ui/alert";
import { CircleAlert } from "lucide-react";
import clsx from "clsx";

interface ConfirmationDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  actionText: string;
  variant?: "default" | "warning" | "destructive";
}

const variantStyles = {
  default: {
    title: "text-gray-800",
    action: "bg-gray-600 hover:bg-gray-700 text-white",
    icon: "text-gray-600",
  },
  warning: {
    title: "text-amber-400",
    action: "bg-amber-500 hover:bg-amber-600 text-white",
    icon: "text-amber-400",
  },
  destructive: {
    title: "text-red-700",
    action: "bg-red-700 hover:bg-red-800 text-white",
    icon: "text-red-700",
  },
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  children,
  title,
  description,
  onClick,
  actionText,
  variant = "default",
}) => {
  const styles = variantStyles[variant];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={clsx(styles.title)}>
            <AlertTitle className='flex items-center'>
              <CircleAlert className={clsx("size-5 mr-1", styles.icon)} />
              {title}
            </AlertTitle>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={clsx(styles.action)} onClick={onClick}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmationDialog };

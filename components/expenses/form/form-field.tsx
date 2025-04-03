import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string | boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => (
  <div className='grid gap-2'>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {error && typeof error === "string" && (
      <p className='text-xs text-red-400'>{error}</p>
    )}
  </div>
);

export { FormField };

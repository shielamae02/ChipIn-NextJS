import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Participant } from "@/types/participant";

interface PaidByProps {
  participant: Participant;
  isChecked: boolean;
  value: string | number;
  onCheckboxChange: (checked: boolean) => void;
  onAmountChange: (value: string) => void;
}

const PaidBy: React.FC<PaidByProps> = ({
  participant,
  isChecked,
  value,
  onCheckboxChange,
  onAmountChange,
}) => (
  <div className='flex items-center space-x-2'>
    <Checkbox
      id={`paid-${participant.id}`}
      checked={isChecked}
      onCheckedChange={onCheckboxChange}
    />
    <Label
      htmlFor={`paid-${participant.id}`}
      className='cursor-pointer text-sm font-normal flex-1'
    >
      <Image
        src={`https://api.dicebear.com/9.x/big-ears/png?seed=${participant.name}`}
        alt='Avatar'
        width={48}
        height={48}
        className='size-5 rounded-full'
      />
      {participant.name}
    </Label>
    {isChecked && (
      <Input
        type='number'
        min='0'
        placeholder='0.00'
        className='w-24 h-8'
        value={value}
        onChange={(e) => onAmountChange(e.target.value)}
      />
    )}
  </div>
);

export { PaidBy };

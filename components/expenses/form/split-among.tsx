import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Participant } from "@/types/participant";

interface SplitAmongProps {
  participant: Participant;
  checked: boolean;
  toggle: () => void;
}

const SplitAmong: React.FC<SplitAmongProps> = ({
  participant,
  checked,
  toggle,
}) => (
  <div className='flex items-center space-x-2'>
    <Checkbox
      id={`split-${participant.id}`}
      checked={checked}
      onCheckedChange={toggle}
    />
    <Label
      htmlFor={`split-${participant.id}`}
      className='cursor-pointer text-sm font-normal'
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
  </div>
);

export { SplitAmong };

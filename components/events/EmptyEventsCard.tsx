import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const EmptyEvents = () => {
  return (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center'>
        <Image
          src='/empty-events.svg'
          alt='Cute Avatar'
          width={400} 
          height={400}
        />
      </CardContent>
      <CardHeader className='text-center'>
        <CardTitle>No Events Yet</CardTitle>
        <CardDescription className='text-sm'>
          Start by adding your first event, like &quot;Dinner&quot; or
          &quot;Hotel Stay&quot;
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export { EmptyEvents };

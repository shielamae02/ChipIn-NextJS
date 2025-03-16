import { LucideProps } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { DETAILS, SOCIALS } from "@/lib/landing-data";
import { ForwardRefExoticComponent } from "react";

interface SocialsProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

interface DetailsProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  title: string;
  details: string;
}

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Contact Us
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get in Touch
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 mt-12">
          <div className="space-y-6">
            {DETAILS.map((detail, index) => (
              <Details
                key={index}
                icon={detail.icon}
                title={detail.title}
                details={detail.details}
              />
            ))}
            <div className="border rounded-lg p-6 bg-background">
              <h3 className="text-lg font-medium mb-2">Follow Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with our latest features and news.
              </p>
              <div className="flex gap-4">
                {SOCIALS.map((social, index) => (
                  <Socials key={index} icon={social.icon} />
                ))}
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export { Contact };

const Socials: React.FC<SocialsProps> = ({ icon: Icon }) => {
  return (
    <a
      href="#"
      rel="noopener noreferrer"
      target="_blank"
      className="rounded-full p-2 bg-muted hover:bg-muted/80 transition-colors"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
};

const Details: React.FC<DetailsProps> = ({ icon: Icon, title, details }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full p-2 bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{details}</p>
      </div>
    </div>
  );
};

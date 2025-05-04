import {
  Users,
  Globe,
  Clock,
  Calculator,
  Receipt,
  CreditCard,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const NavData = [
  { title: "Features", path: "#features" },
  { title: "How It Works", path: "#how-it-works" },
  { title: "Testimonials", path: "#testimonials" },
  { title: "FAQ", path: "#faq" },
  { title: "Contact", path: "#contact" },
];

export const FeaturesData = [
  {
    icon: Users,
    title: "Group Friendly",
    description:
      "Perfect for any group size. Split expenses among friends, roommates, or travel companions with ease.",
  },
  {
    icon: Globe,
    title: "Web-Based Access",
    description:
      "No app downloads required. Anyone with the link can join and participate in expense tracking.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description:
      "See changes instantly as expenses are added or modified by any group member.",
  },
  {
    icon: Calculator,
    title: "Automatic Calculations",
    description:
      "No more manual math. ChipIn handles all calculations and shows who owes what to whom.",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    description:
      "Keep a detailed record of all expenses with categories, dates, and who paid for what.",
  },
  {
    icon: CreditCard,
    title: "Settlement Plans",
    description:
      "Get clear, optimized settlement plans that minimize the number of transactions needed.",
  },
];

export const HowItWorksData = [
  {
    title: "Create a Session",
    description:
      'Start a new expense-splitting session and give it a name like "Summer Trip" or "Apartment Expenses".',
  },
  {
    title: "Invite Participants",
    description:
      "Share the session link with your group. No sign-up required for them to join and participate.",
  },
  {
    title: "Add Expenses",
    description:
      "Record expenses as they occur. Specify who paid and how the cost should be split among participants.",
  },
  {
    title: "Track in Real-Time",
    description:
      "Watch as ChipIn automatically updates balances and shows who owes what to whom in real-time.",
  },
  {
    title: "Settle Up",
    description:
      "Use the optimized settlement plan to easily square up all debts with minimal transactions.",
  },
];

export const TestimonialsData = [
  {
    name: "Sarah J.",
    position: "Travel Enthusiast",
    testimony:
      "ChipIn saved our group trip from becoming a financial nightmare. No more awkward money conversations or complicated spreadsheets. Everyone could see expenses in real-time!",
  },
  {
    name: "Michael T.",
    position: "Roommate Coordinator",
    testimony:
      "Managing apartment expenses with 4 roommates used to be a monthly headache. ChipIn has made it so simple that we actually look forward to settling up now!",
  },
  {
    name: "Elena R.",
    position: "Event Planner",
    testimony:
      "I organize group events regularly, and ChipIn has been a game-changer. The web-based access means everyone can participate without downloading yet another app.",
  },
];

export const FAQData = [
  {
    question: "Do I need to create an account to use ChipIn?",
    answer:
      "Only the person creating the expense-splitting session needs an account. All participants can join via a shared link without signing up, making it easy for everyone to participate.",
  },
  {
    question: "Is ChipIn free to use?",
    answer:
      "ChipIn offers a free tier that covers basic expense splitting for small groups. We also offer premium plans with additional features like expense history, receipt scanning, and larger group sizes.",
  },
  {
    question: "Can I split expenses unevenly?",
    answer:
      "ChipIn allows for various splitting methods: equal splits, percentage-based splits, or specific amounts for each person. This is perfect for situations where not everyone should pay the same amount.",
  },
  {
    question: "Does ChipIn integrate with payment apps?",
    answer:
      "ChipIn currently provides settlement instructions but doesn't directly process payments. However, we're working on integrations with popular payment platforms to make settling up even easier.",
  },
  {
    question: "How long does ChipIn store my expense data?",
    answer:
      "Free accounts can access their expense data for up to 30 days after the last activity. Premium accounts have extended or unlimited data retention depending on the plan.",
  },
];

export const SOCIALS = [
  { icon: Twitter, link: "" },
  { icon: Facebook, link: "" },
  { icon: Instagram, link: "" },
  { icon: Github, link: "https://github.com/shielamae02" },
];

export const DETAILS = [
  {
    icon: Mail,
    title: "Email Us",
    details: "support@chipinapp.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Finance Street, San Francisco, CA 94107",
  },
];

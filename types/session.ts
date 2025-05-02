import { Participant } from "./participant";
import { Event } from "./event";

export type Session = {
  id: string;
  name: string;
  creator: string;
  created_at: string;
  participants: Participant[];
  events: Event[];
};

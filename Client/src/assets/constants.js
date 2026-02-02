import { User, CalendarDays, UtensilsCrossed, FileCheck2,IndianRupee  } from "lucide-react";

export const STEPS = [
  { key: "personal", title: "Personal Details", subtitle: "Your contact information", icon: User },
  { key: "event", title: "Event Details", subtitle: "Event information", icon: CalendarDays },
  { key: "menu", title: "Menu Selection", subtitle: "Choose your menu", icon: UtensilsCrossed },
  { key: "payment", title: "Payment", subtitle: "Now let's set up your billing", icon: IndianRupee  },
  { key: "review", title: "Review", subtitle: "Review and confirm", icon: FileCheck2 },
];

export const paymentMethods = ['PhonePe', 'Google Pay', 'Paytm', 'other'];

export const initialData = {
  personal: { fullName: "", email: "", phone: "" },
  event: { eventName: "", guests: 50, date: "", time: "", venue: "", notes: "" },
  menu: {
    selectedItems: {
      starters: [],
      maincourse: [],
      beverages: [],
      desserts: [],
    },
    customMenuItems: [],
    estimatedPrice: 0,
  },
  payment:{
    totalPricePaid:0,
    paymentMethod:"",
    transactionId:""
  },
  
  termsAccepted: false,
};
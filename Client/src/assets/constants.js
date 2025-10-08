import { User, CalendarDays, UtensilsCrossed, FileCheck2 } from "lucide-react";

export const STEPS = [
  { key: "personal", title: "Personal Details", subtitle: "Your contact information", icon: User },
  { key: "event", title: "Event Details", subtitle: "Event information", icon: CalendarDays },
  { key: "menu", title: "Menu Selection", subtitle: "Choose your menu", icon: UtensilsCrossed },
  { key: "review", title: "Review", subtitle: "Review and confirm", icon: FileCheck2 },
];

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
    specialRequests: "",
    estimatedPrice: 0,
  },
  
  termsAccepted: false,
};

export const menuCategories = {
  starters: [
    "Sweet Kuzhi Paniyaram",
    "Kara Kuzhi Paniyaram",
    "Mysore Bonda",
    "Medu Vada",
    "Onion Pakoda",
    "Masala Vada",
    "Rava Kitchadi",
    "Upma",
    "Pongal",
    "Idli with Chutney",
    "Pani Puri",
    "Dahi Puri",
    "Aloo Tikki",
    "Samosa",
    "Bhel Puri",
    "Sev Puri",
    "Vada Pav",
    "Dabeli"
  ],
  maincourse: [
    "Pav Bhaji",
    "Kathi Roll",
    "Masala Dosa",
    "Plain Dosa",
    "Rava Dosa",
    "Onion Uttapam",
    "Tomato Uttapam",
    "Set Dosa",
    "Pesarattu",
    "Ragi Dosa",
    "Neer Dosa",
    "Adai"
  ],
  beverages: [
    "Virgin Mojito",
    "Blue Lagoon",
    "Pina Colada",
    "Strawberry Daiquiri",
    "Watermelon Cooler",
    "Mango Tango",
    "Kiwi Kiss",
    "Tropical Sunrise",
    "Berry Blast",
    "Green Apple Fizz"
  ],
  desserts: [
    "Jalebi",
    "Rasgulla",
    "Gulab Jamun",
    "Carrot Halwa",
    "Mango Kulfi",
    "Rasmalai",
    "Badam Halwa",
    "Payasam",
    "Shrikhand",
    "Malpua"
  ]
};

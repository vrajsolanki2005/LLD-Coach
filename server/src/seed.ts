import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database";
import { Problem } from "./models/Problem";

dotenv.config();

const problems = [
  {
    title: "Parking Lot",
    slug: "parking-lot",
    description:
      "Design a parking lot system that supports multiple floors, different vehicle types, parking spots, tickets and fee calculation.",

    difficulty: "Medium",

    requirements: [
      "Support multiple parking floors",
      "Support different vehicle types",
      "Assign an appropriate parking spot",
      "Generate a parking ticket",
      "Track occupied and available spots",
      "Allow vehicles to exit",
      "Calculate parking fees",
    ],

    entities: [
      "ParkingLot",
      "ParkingFloor",
      "ParkingSpot",
      "Vehicle",
      "Ticket",
      "Payment",
    ],

    evaluationCriteria: [
      "Clear separation of responsibilities",
      "Vehicle and spot abstractions",
      "Correct relationships",
      "Spot allocation",
      "Ticket lifecycle",
      "Fee calculation",
      "Extensibility for new vehicle types",
    ],

    evaluationConfig: {
      requiredEntities: [
        "ParkingLot",
        "ParkingFloor",
        "ParkingSpot",
        "Vehicle",
        "Ticket",
        "Payment",
      ],

      recommendedEntities: [
        "Car",
        "Bike",
        "Truck",
        "SpotType",
        "FeeCalculator",
      ],

      requiredBehaviors: [
        {
          name: "Parking spot allocation",
          keywords: [
            "park",
            "assign",
            "allocate",
            "findspot",
            "available",
          ],
          description:
            "The system should determine and assign an appropriate available parking spot.",
        },
        {
          name: "Vehicle exit",
          keywords: [
            "exit",
            "remove",
            "unpark",
            "checkout",
            "release",
          ],
          description:
            "The system should release a vehicle's parking spot when it exits.",
        },
        {
          name: "Ticket generation",
          keywords: [
            "ticket",
            "generateticket",
            "entry",
            "checkin",
          ],
          description:
            "The design should represent the ticket created when a vehicle enters.",
        },
        {
          name: "Fee calculation",
          keywords: [
            "fee",
            "price",
            "payment",
            "calculate",
            "charge",
          ],
          description:
            "The design should explain how parking fees are calculated and collected.",
        },
      ],

      recommendedConcepts: [
        "Vehicle abstraction",
        "Spot type abstraction",
        "Fee strategy",
        "Composition",
      ],
    },
  },

  {
    title: "Vending Machine",
    slug: "vending-machine",
    description:
      "Design a vending machine that allows users to select products, insert money, dispense products and receive change.",

    difficulty: "Easy",

    requirements: [
      "Display available products",
      "Allow product selection",
      "Accept money",
      "Validate sufficient funds",
      "Dispense products",
      "Return change",
      "Handle unavailable products",
    ],

    entities: [
      "VendingMachine",
      "Product",
      "Slot",
      "Money",
      "Payment",
    ],

    evaluationCriteria: [
      "Clear vending machine state",
      "Product selection",
      "Payment handling",
      "Inventory management",
      "Dispensing",
      "Change calculation",
    ],

    evaluationConfig: {
      requiredEntities: [
        "VendingMachine",
        "Product",
        "Slot",
        "Money",
        "Payment",
      ],

      recommendedEntities: [
        "Inventory",
        "PaymentStrategy",
        "MachineState",
      ],

      requiredBehaviors: [
        {
          name: "Product selection",
          keywords: [
            "select",
            "choose",
            "product",
          ],
          description:
            "The user should be able to select a product from the machine.",
        },
        {
          name: "Money handling",
          keywords: [
            "money",
            "payment",
            "insert",
            "coin",
            "cash",
          ],
          description:
            "The machine should accept and track inserted money.",
        },
        {
          name: "Product dispensing",
          keywords: [
            "dispense",
            "release",
            "deliver",
          ],
          description:
            "The design should represent how a selected product is dispensed.",
        },
        {
          name: "Change handling",
          keywords: [
            "change",
            "refund",
            "return",
          ],
          description:
            "The machine should return the appropriate change when necessary.",
        },
      ],

      recommendedConcepts: [
        "State pattern",
        "Payment abstraction",
        "Inventory separation",
      ],
    },
  },

  {
    title: "Library Management System",
    slug: "library-management-system",
    description:
      "Design a library management system that handles books, members, borrowing, returning and fine calculation.",

    difficulty: "Medium",

    requirements: [
      "Maintain a catalog of books with multiple copies",
      "Register and manage library members",
      "Allow members to borrow books",
      "Track due dates for borrowed books",
      "Allow members to return books",
      "Calculate fines for overdue returns",
      "Search books by title, author or genre",
    ],

    entities: [
      "Library",
      "Book",
      "BookCopy",
      "Member",
      "Loan",
      "Fine",
      "Catalog",
    ],

    evaluationCriteria: [
      "Book and copy separation",
      "Member management",
      "Loan lifecycle",
      "Fine calculation",
      "Search abstraction",
      "Extensibility",
    ],

    evaluationConfig: {
      requiredEntities: [
        "Library",
        "Book",
        "BookCopy",
        "Member",
        "Loan",
        "Fine",
      ],

      recommendedEntities: [
        "Catalog",
        "SearchService",
        "Notification",
        "Reservation",
      ],

      requiredBehaviors: [
        {
          name: "Borrow book",
          keywords: ["borrow", "checkout", "issue", "lend", "loan"],
          description: "A member should be able to borrow an available copy of a book.",
        },
        {
          name: "Return book",
          keywords: ["return", "checkin", "handback"],
          description: "A member should be able to return a borrowed book.",
        },
        {
          name: "Fine calculation",
          keywords: ["fine", "overdue", "penalty", "late", "fee"],
          description: "The system should calculate fines for books returned after the due date.",
        },
        {
          name: "Book search",
          keywords: ["search", "find", "lookup", "query", "catalog"],
          description: "Members should be able to search for books by title, author or genre.",
        },
      ],

      recommendedConcepts: [
        "Book vs copy separation",
        "Fine strategy",
        "Search abstraction",
        "Composition",
      ],
    },
  },

  {
    title: "Elevator System",
    slug: "elevator-system",
    description:
      "Design an elevator system that manages multiple elevators, floor requests, destination requests and elevator movement.",

    difficulty: "Hard",

    requirements: [
      "Support multiple elevators",
      "Accept requests from different floors",
      "Allow users to select destination floors",
      "Assign requests to elevators",
      "Move elevators between floors",
      "Track elevator state",
      "Handle multiple requests",
    ],

    entities: [
      "ElevatorSystem",
      "Elevator",
      "Request",
      "Floor",
      "Door",
    ],

    evaluationCriteria: [
      "Elevator assignment",
      "Request management",
      "State management",
      "Scheduling",
      "Movement",
      "Multiple elevator coordination",
    ],

    evaluationConfig: {
      requiredEntities: [
        "ElevatorSystem",
        "Elevator",
        "Request",
        "Floor",
        "Door",
      ],

      recommendedEntities: [
        "Scheduler",
        "ElevatorState",
        "Button",
        "Direction",
      ],

      requiredBehaviors: [
        {
          name: "Request handling",
          keywords: [
            "request",
            "call",
            "pickup",
            "floor",
          ],
          description:
            "The system should accept requests from users on different floors.",
        },
        {
          name: "Elevator assignment",
          keywords: [
            "assign",
            "select",
            "schedule",
            "dispatch",
          ],
          description:
            "The system should determine which elevator handles a request.",
        },
        {
          name: "Elevator movement",
          keywords: [
            "move",
            "up",
            "down",
            "floor",
            "destination",
          ],
          description:
            "The elevator should be able to move between floors toward requested destinations.",
        },
        {
          name: "State management",
          keywords: [
            "state",
            "idle",
            "moving",
            "door",
            "open",
            "close",
          ],
          description:
            "The design should represent important elevator states and transitions.",
        },
      ],

      recommendedConcepts: [
        "Scheduler abstraction",
        "State pattern",
        "Strategy pattern",
        "Composition",
      ],
    },
  },

  {
    title: "Movie Ticket Booking",
    slug: "movie-ticket-booking",
    description:
      "Design a movie ticket booking system that lets users browse shows, select seats, make payments and receive tickets.",
    difficulty: "Medium",
    requirements: [
      "List movies and theatres",
      "Show available screenings",
      "Allow users to select seats",
      "Prevent double booking of seats",
      "Process ticket payments",
      "Generate booking confirmations",
      "Allow booking cancellation and refunds",
    ],
    entities: [
      "Movie",
      "Theatre",
      "Screen",
      "Show",
      "Seat",
      "Booking",
      "Payment",
      "Ticket",
    ],
    evaluationCriteria: [
      "Seat availability and concurrency",
      "Booking lifecycle",
      "Payment abstraction",
      "Cancellation and refund handling",
      "Clear entity relationships",
      "Extensibility for pricing rules",
    ],
    evaluationConfig: {
      requiredEntities: ["Movie", "Theatre", "Show", "Seat", "Booking", "Payment"],
      recommendedEntities: ["Screen", "Ticket", "SeatHold", "PricingStrategy", "Refund"],
      requiredBehaviors: [
        {
          name: "Seat selection",
          keywords: ["seat", "select", "available", "hold", "reserve"],
          description: "Users should be able to view and select available seats for a show.",
        },
        {
          name: "Double booking prevention",
          keywords: ["lock", "hold", "concurrency", "transaction", "reserve"],
          description: "The design should prevent two users from booking the same seat.",
        },
        {
          name: "Payment and ticketing",
          keywords: ["payment", "charge", "ticket", "confirmation", "refund"],
          description: "The system should complete payment and issue a booking confirmation.",
        },
      ],
      recommendedConcepts: ["Seat hold", "Payment strategy", "Transaction boundary", "State machine"],
    },
  },

  {
    title: "Food Delivery Platform",
    slug: "food-delivery-platform",
    description:
      "Design a food delivery platform that connects customers, restaurants and delivery partners from order creation through delivery.",
    difficulty: "Hard",
    requirements: [
      "Allow customers to browse restaurant menus",
      "Create and update food orders",
      "Process customer payments",
      "Notify restaurants of new orders",
      "Assign delivery partners",
      "Track delivery status",
      "Handle order cancellation and refunds",
    ],
    entities: [
      "Customer",
      "Restaurant",
      "Menu",
      "MenuItem",
      "Order",
      "OrderItem",
      "DeliveryPartner",
      "Payment",
      "Delivery",
    ],
    evaluationCriteria: [
      "Order lifecycle and state management",
      "Restaurant and delivery boundaries",
      "Assignment strategy",
      "Payment and refund handling",
      "Notification abstraction",
      "Low coupling between services",
    ],
    evaluationConfig: {
      requiredEntities: ["Customer", "Restaurant", "Menu", "Order", "Payment", "Delivery"],
      recommendedEntities: ["OrderItem", "DeliveryPartner", "AssignmentStrategy", "NotificationService", "Refund"],
      requiredBehaviors: [
        {
          name: "Order lifecycle",
          keywords: ["order", "confirm", "prepare", "ready", "cancel", "deliver"],
          description: "The design should model important order states and valid transitions.",
        },
        {
          name: "Delivery assignment",
          keywords: ["assign", "driver", "delivery", "dispatch", "nearby", "partner"],
          description: "The system should assign an appropriate delivery partner to an order.",
        },
        {
          name: "Payment handling",
          keywords: ["payment", "charge", "refund", "transaction", "wallet"],
          description: "The design should separate payment processing from order coordination.",
        },
      ],
      recommendedConcepts: ["State pattern", "Strategy pattern", "Event notifications", "Service boundaries"],
    },
  },

  {
    title: "Ride Sharing Service",
    slug: "ride-sharing-service",
    description:
      "Design a ride sharing service that matches riders with drivers, tracks trips, calculates fares and processes payments.",
    difficulty: "Hard",
    requirements: [
      "Allow riders to request a trip",
      "Find nearby available drivers",
      "Match a driver to a rider",
      "Track driver and trip locations",
      "Calculate fares based on trip details",
      "Process rider payments",
      "Support trip cancellation and ratings",
    ],
    entities: [
      "Rider",
      "Driver",
      "Vehicle",
      "RideRequest",
      "Trip",
      "Location",
      "Fare",
      "Payment",
      "Rating",
    ],
    evaluationCriteria: [
      "Matching strategy",
      "Trip state management",
      "Location tracking",
      "Fare calculation",
      "Driver availability",
      "Extensibility for pricing and matching rules",
    ],
    evaluationConfig: {
      requiredEntities: ["Rider", "Driver", "RideRequest", "Trip", "Location", "Payment"],
      recommendedEntities: ["Vehicle", "FareCalculator", "MatchingStrategy", "Rating", "TripState"],
      requiredBehaviors: [
        {
          name: "Driver matching",
          keywords: ["match", "assign", "nearby", "available", "driver", "dispatch"],
          description: "The system should select an available driver for a ride request.",
        },
        {
          name: "Trip tracking",
          keywords: ["trip", "location", "start", "arrive", "complete", "track"],
          description: "The design should represent trip states and location updates.",
        },
        {
          name: "Fare calculation",
          keywords: ["fare", "price", "surge", "distance", "time", "calculate"],
          description: "The system should calculate fares using replaceable pricing rules.",
        },
      ],
      recommendedConcepts: ["Matching strategy", "Fare strategy", "State machine", "Location service"],
    },
  },
];

const seed = async () => {
  try {
    await connectDatabase();

    await Problem.deleteMany({});

    await Problem.insertMany(problems);

    console.log("Problems seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
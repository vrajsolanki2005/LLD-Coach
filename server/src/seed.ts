import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { Problem } from "./models/Problem";

dotenv.config();

const problems = [
  {
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "Medium",

    description:
      "Design a parking lot system that supports multiple floors, different vehicle types, parking spots, vehicle entry and exit, and fee calculation.",

    requirements: [
      "The parking lot can have multiple floors.",
      "The system should support cars, motorcycles, and trucks.",
      "Different types of vehicles require different parking spots.",
      "A vehicle should receive a parking ticket when entering.",
      "The system should find an appropriate available parking spot.",
      "A vehicle should be able to exit the parking lot.",
      "The system should calculate the parking fee.",
    ],

    entities: [
      "ParkingLot",
      "ParkingFloor",
      "ParkingSpot",
      "Vehicle",
      "Car",
      "Motorcycle",
      "Truck",
      "Ticket",
      "Payment",
    ],

    evaluationCriteria: [
      "Clear responsibility assignment",
      "Low coupling",
      "High cohesion",
      "Appropriate abstractions",
      "Extensibility",
      "Reasonable use of design patterns",
    ],
  },

  {
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "Easy",

    description:
      "Design a vending machine that allows users to select products, insert money, receive products, and receive change.",

    requirements: [
      "The machine should display available products.",
      "A user should be able to select a product.",
      "The user should be able to insert money.",
      "The machine should validate whether sufficient money was inserted.",
      "The machine should dispense the selected product.",
      "The machine should return remaining change.",
      "The machine should handle unavailable products.",
    ],

    entities: [
      "VendingMachine",
      "Product",
      "Inventory",
      "Coin",
      "Payment",
      "ProductSlot",
    ],

    evaluationCriteria: [
      "State management",
      "Responsibility assignment",
      "Abstraction",
      "Extensibility",
      "Low coupling",
      "Error handling",
    ],
  },

  {
    title: "Elevator System",
    slug: "elevator-system",
    difficulty: "Hard",

    description:
      "Design an elevator system for a building with multiple floors and multiple elevators that can handle requests from users.",

    requirements: [
      "The building has multiple floors.",
      "The system can have multiple elevators.",
      "Users can request an elevator from a floor.",
      "Users can select a destination floor.",
      "The system should decide which elevator should handle a request.",
      "The elevator should move between floors.",
      "The system should support different elevator states.",
      "The system should handle multiple requests.",
    ],

    entities: [
      "ElevatorSystem",
      "Elevator",
      "Floor",
      "ElevatorRequest",
      "ElevatorController",
      "SchedulingStrategy",
    ],

    evaluationCriteria: [
      "Separation of responsibilities",
      "Scheduling abstraction",
      "State management",
      "Extensibility",
      "Concurrency considerations",
      "Low coupling",
    ],
  },
];

const seed = async (): Promise<void> => {
  try {
    await connectDatabase();
    await Problem.deleteMany({});
    await Problem.insertMany(problems);

    console.log("Problems seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
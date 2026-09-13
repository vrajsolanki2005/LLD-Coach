
import { describe, expect, it } from "vitest";
import { RuleBasedEvaluator } from "./ruleBasedEvaluator";
import { IProblem } from "../models/Problem";
import { ISubmission } from "../models/Submission";

const problem = {
  title: "Parking Lot",
  slug: "parking-lot",
  description: "Parking lot design problem",

  difficulty: "Medium",

  requirements: [
    "Park vehicles",
    "Generate tickets",
    "Calculate fees",
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
    "Responsibilities",
    "Relationships",
    "Extensibility",
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

    recommendedEntities: ["FeeCalculator"],

    requiredBehaviors: [
      {
        name: "Parking spot allocation",
        keywords: [
          "park",
          "assign",
          "allocate",
          "available",
        ],
        description:
          "The system should allocate a parking spot.",
      },

      {
        name: "Ticket generation",
        keywords: [
          "ticket",
          "entry",
          "checkin",
        ],
        description:
          "The system should create a ticket.",
      },

      {
        name: "Fee calculation",
        keywords: [
          "fee",
          "price",
          "payment",
          "calculate",
        ],
        description:
          "The system should calculate fees.",
      },
    ],

    recommendedConcepts: [
      "Vehicle abstraction",
      "Fee strategy",
    ],
  },
} as unknown as IProblem;

const completeSubmission = {
  classes: [
    {
      name: "ParkingLot",
      responsibility:
        "Coordinates floors and parking operations.",
      methods: [
        "findAvailableSpot",
        "parkVehicle",
      ],
    },

    {
      name: "ParkingFloor",
      responsibility:
        "Tracks parking spots on a floor.",
      methods: [
        "findAvailableSpot",
      ],
    },

    {
      name: "ParkingSpot",
      responsibility:
        "Represents an individual parking location.",
      methods: [
        "occupy",
        "release",
      ],
    },

    {
      name: "Vehicle",
      responsibility:
        "Represents a vehicle entering the parking lot.",
      methods: [
        "getType",
      ],
    },

    {
      name: "Ticket",
      responsibility:
        "Tracks vehicle entry and exit information.",
      methods: [
        "close",
      ],
    },

    {
      name: "Payment",
      responsibility:
        "Represents payment for parking.",
      methods: [
        "calculateFee",
        "pay",
      ],
    },
  ],

  relationships: [
    {
      from: "ParkingLot",
      to: "ParkingFloor",
      type: "Composition",
    },

    {
      from: "ParkingFloor",
      to: "ParkingSpot",
      type: "Composition",
    },

    {
      from: "ParkingLot",
      to: "Vehicle",
      type: "Association",
    },

    {
      from: "ParkingLot",
      to: "Ticket",
      type: "Association",
    },

    {
      from: "ParkingLot",
      to: "Payment",
      type: "Dependency",
    },
  ],

  explanation:
    "ParkingLot coordinates the workflow because each class has a focused responsibility. ParkingFloor manages availability while ParkingSpot owns occupancy. Vehicle is kept as an abstraction so new vehicle types can be introduced later. Payment handles fee calculation. The tradeoff is that the design uses more classes, but this reduces coupling and improves extensibility.",
} as unknown as ISubmission;

describe("RuleBasedEvaluator", () => {
  it("gives strong completeness feedback for a complete design", async () => {
    const evaluator = new RuleBasedEvaluator();

    const result = await evaluator.evaluate(
      problem,
      completeSubmission
    );

    expect(result.overallScore).toBeGreaterThanOrEqual(7);

    expect(result.issues).not.toContainEqual(
      expect.objectContaining({
        title: "Missing core design entities",
      })
    );
  });

  it("detects missing required entities", async () => {
    const evaluator = new RuleBasedEvaluator();

    const submission = {
      ...completeSubmission,

      classes:
        completeSubmission.classes.slice(0, 3),
    } as unknown as ISubmission;

    const result = await evaluator.evaluate(
      problem,
      submission
    );

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Missing core design entities",
          severity: "high",
        }),
      ])
    );
  });

  it("detects missing required behavior", async () => {
    const evaluator = new RuleBasedEvaluator();

    /*
     * Remove every "parking allocation" signal
     * from the design.
     *
     * The evaluator searches the entire submission,
     * so removing it only from ParkingLot is not enough.
     */
    const submission = {
      ...completeSubmission,

      classes: [
        {
          name: "ParkingLot",
          responsibility:
            "Coordinates facility floors.",
          methods: [
            "manageFloors",
          ],
        },

        {
          name: "ParkingFloor",
          responsibility:
            "Contains locations on a floor.",
          methods: [
            "getLocations",
          ],
        },

        {
          name: "ParkingSpot",
          responsibility:
            "Represents an individual location.",
          methods: [
            "occupy",
            "release",
          ],
        },

        {
          name: "Vehicle",
          responsibility:
            "Represents a vehicle entering the facility.",
          methods: [
            "getType",
          ],
        },

        {
          name: "Ticket",
          responsibility:
            "Tracks vehicle entry and exit information.",
          methods: [
            "close",
          ],
        },

        {
          name: "Payment",
          responsibility:
            "Represents payment for the facility.",
          methods: [
            "calculateFee",
            "pay",
          ],
        },
      ],

      explanation:
        "The design separates responsibilities between domain classes. Payment handles fee calculation and Ticket handles entry information.",
    } as unknown as ISubmission;

    const result = await evaluator.evaluate(
      problem,
      submission
    );

    expect(
      result.issues.some(
        (issue) =>
          issue.title ===
          "Missing behavior: Parking spot allocation"
      )
    ).toBe(true);
  });

  it("detects invalid relationships", async () => {
    const evaluator = new RuleBasedEvaluator();

    const submission = {
      ...completeSubmission,

      relationships: [
        {
          from: "ParkingLot",
          to: "DoesNotExist",
          type: "Association",
        },
      ],
    } as unknown as ISubmission;

    const result = await evaluator.evaluate(
      problem,
      submission
    );

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Invalid relationships",
          severity: "high",
        }),
      ])
    );
  });

  it("flags weak design reasoning", async () => {
    const evaluator = new RuleBasedEvaluator();

    const submission = {
      ...completeSubmission,

      explanation:
        "I created these classes.",
    } as unknown as ISubmission;

    const result = await evaluator.evaluate(
      problem,
      submission
    );

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Limited design reasoning",
          severity: "medium",
        }),
      ])
    );
  });

  it("flags classes with no responsibility", async () => {
    const evaluator = new RuleBasedEvaluator();

    const submission = {
      ...completeSubmission,

      classes: [
        {
          name: "ParkingLot",
          responsibility: "",
          methods: [],
        },
      ],
    } as unknown as ISubmission;

    const result = await evaluator.evaluate(
      problem,
      submission
    );

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Missing core design entities",
        }),

        expect.objectContaining({
          title:
            "Classes without clear responsibilities",
        }),
      ])
    );
  });
});


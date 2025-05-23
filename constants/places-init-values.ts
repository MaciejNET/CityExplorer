import {Place} from "@/schemas/place";
import {uuid} from "expo-modules-core";

export const initPlaces: Place[] = [
  {
    id: uuid.v4(),
    name: "Central Park",
    city: "New York",
    description:
      "A sprawling green oasis in the heart of New York City offering scenic views and recreational areas.",
    location: {latitude: 40.785091, longitude: -73.968285},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Golden Gate Bridge",
    city: "San Francisco",
    description:
      "An iconic suspension bridge known for its stunning views and engineering excellence.",
    location: {latitude: 37.8199, longitude: -122.4783},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "The Louvre",
    city: "Paris",
    description:
      "The world’s largest art museum, home to thousands of artworks including the Mona Lisa.",
    location: {latitude: 48.8606, longitude: 2.3376},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Colosseum",
    city: "Rome",
    description:
      "An ancient amphitheater renowned for its historical significance and gladiatorial contests.",
    location: {latitude: 41.8902, longitude: 12.4922},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Tokyo Tower",
    city: "Tokyo",
    description:
      "A communications and observation tower offering panoramic views of Tokyo’s bustling cityscape.",
    location: {latitude: 35.6586, longitude: 139.7454},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Sydney Opera House",
    city: "Sydney",
    description:
      "A world-class performing arts center known for its unique and innovative architecture.",
    location: {latitude: -33.8568, longitude: 151.2153},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Buckingham Palace",
    city: "London",
    description:
      "The official residence of the British monarch, located in the heart of London.",
    location: {latitude: 51.5014, longitude: -0.1419},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Christ the Redeemer",
    city: "Rio de Janeiro",
    description:
      "An iconic statue of Jesus Christ overlooking Rio de Janeiro from the top of Corcovado Mountain.",
    location: {latitude: -22.9519, longitude: -43.2105},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Great Wall of China",
    city: "Beijing",
    description:
      "A historical series of fortifications built to protect ancient Chinese states against invasions.",
    location: {latitude: 40.4319, longitude: 116.5704},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Machu Picchu",
    city: "Cusco",
    description:
      "A 15th-century Incan citadel set high in the Andes Mountains, celebrated for its archaeological significance.",
    location: {latitude: -13.1631, longitude: -72.5450},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Pyramids of Giza",
    city: "Giza",
    description:
      "Ancient Egyptian pyramids built as tombs for pharaohs, exemplifying the wonders of ancient engineering.",
    location: {latitude: 29.9792, longitude: 31.1342},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Niagara Falls",
    city: "Niagara",
    description:
      "A group of massive waterfalls on the border between Canada and the United States, famed for their raw power and beauty.",
    location: {latitude: 43.0962, longitude: -79.0377},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Burj Khalifa",
    city: "Dubai",
    description:
      "The tallest building in the world and a marvel of modern engineering, offering spectacular views of Dubai.",
    location: {latitude: 25.1972, longitude: 55.2744},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Santorini",
    city: "Santorini",
    description:
      "A picturesque island in the Aegean Sea celebrated for its white-washed buildings and breathtaking sunsets.",
    location: {latitude: 36.3932, longitude: 25.4615},
    photoIds: [],
  },
  {
    id: uuid.v4(),
    name: "Yellowstone National Park",
    city: "Wyoming",
    description:
      "America's first national park, renowned for its geothermal features, diverse wildlife, and scenic landscapes.",
    location: {latitude: 44.4280, longitude: -110.5885},
    photoIds: [],
  },
];

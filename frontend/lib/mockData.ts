/**
 * Datos simulados para PETZO
 * Proporciona datos mock para mascotas, usuarios y categorías
 */

export interface MockPet {
  id: string;
  name: string;
  species: "perro" | "gato";
  breed: string;
  age: string;
  ageInMonths: number;
  size: "pequeño" | "mediano" | "grande";
  gender: "macho" | "hembra";
  city: string;
  description: string;
  images: string[];
  status: "disponible" | "adoptado" | "reservado";
  publishedDate: string;
  owner: {
    name: string;
    type: "refugio" | "particular";
    contact: string;
  };
  characteristics: string[];
  vaccinated: boolean;
  sterilized: boolean;
}

export const mockPets: MockPet[] = [
  {
    id: "1",
    name: "Max",
    species: "perro",
    breed: "Golden Retriever",
    age: "2 años",
    ageInMonths: 24,
    size: "grande",
    gender: "macho",
    city: "Madrid",
    description:
      "Max es un perro muy cariñoso y juguetón. Le encanta jugar con niños y otros perros. Es perfecto para familias activas que disfruten del aire libre.",
    images: [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-12-01",
    owner: {
      name: "Refugio Animales Felices",
      type: "refugio",
      contact: "info@animalesfelices.com",
    },
    characteristics: ["Activo", "Sociable", "Entrenado", "Bueno con niños"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "2",
    name: "Luna",
    species: "gato",
    breed: "Siamés",
    age: "1 año",
    ageInMonths: 12,
    size: "mediano",
    gender: "hembra",
    city: "Barcelona",
    description:
      "Luna es una gatita elegante y cariñosa. Le gusta observar desde lugares altos y es muy curiosa. Perfecta para apartamentos.",
    images: [
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-11-28",
    owner: {
      name: "María García",
      type: "particular",
      contact: "maria@email.com",
    },
    characteristics: ["Tranquila", "Independiente", "Limpia", "Curiosa"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "3",
    name: "Rocky",
    species: "perro",
    breed: "Pastor Alemán",
    age: "3 años",
    ageInMonths: 36,
    size: "grande",
    gender: "macho",
    city: "Valencia",
    description:
      "Rocky es un perro leal y protector. Ha recibido entrenamiento básico y es excelente guardián. Ideal para casas con jardín.",
    images: [
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-11-25",
    owner: {
      name: "Refugio La Esperanza",
      type: "refugio",
      contact: "contacto@laesperanza.org",
    },
    characteristics: ["Leal", "Protector", "Inteligente", "Obediente"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "4",
    name: "Mimi",
    species: "gato",
    breed: "Persa",
    age: "6 meses",
    ageInMonths: 6,
    size: "pequeño",
    gender: "hembra",
    city: "Sevilla",
    description:
      "Mimi es una gatita juguetona y adorable. Le encanta que la mimen y es muy cariñosa. Perfecta como primera mascota.",
    images: [
      "https://images.unsplash.com/photo-1573865526739-10c1dd7e9e9a?w=800&q=80",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-12-02",
    owner: {
      name: "Carlos Ruiz",
      type: "particular",
      contact: "carlos@email.com",
    },
    characteristics: ["Juguetona", "Cariñosa", "Tranquila", "Sociable"],
    vaccinated: true,
    sterilized: false,
  },
  {
    id: "5",
    name: "Thor",
    species: "perro",
    breed: "Husky Siberiano",
    age: "4 años",
    ageInMonths: 48,
    size: "grande",
    gender: "macho",
    city: "Zaragoza",
    description:
      "Thor es un perro enérgico que necesita mucho ejercicio. Es ideal para personas activas que disfruten del senderismo y actividades al aire libre.",
    images: [
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-11-30",
    owner: {
      name: "Refugio Norte",
      type: "refugio",
      contact: "info@refugionorte.es",
    },
    characteristics: ["Enérgico", "Aventurero", "Sociable", "Fuerte"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "6",
    name: "Nala",
    species: "gato",
    breed: "Bengalí",
    age: "2 años",
    ageInMonths: 24,
    size: "mediano",
    gender: "hembra",
    city: "Málaga",
    description:
      "Nala es una gata activa y curiosa. Le encanta explorar y jugar. Es perfecta para personas que buscan una compañera interactiva.",
    images: [
      "https://images.unsplash.com/photo-1491485880348-85d48a9e5312?w=800&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-12-03",
    owner: {
      name: "Ana López",
      type: "particular",
      contact: "ana@email.com",
    },
    characteristics: ["Activa", "Curiosa", "Inteligente", "Juguetona"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "7",
    name: "Buddy",
    species: "perro",
    breed: "Labrador",
    age: "1 año",
    ageInMonths: 12,
    size: "grande",
    gender: "macho",
    city: "Bilbao",
    description:
      "Buddy es un perro alegre y amigable. Adora nadar y jugar con pelotas. Es excelente con niños y otras mascotas.",
    images: [
      "https://images.unsplash.com/photo-1594149929063-dc26e0115370?w=800&q=80",
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-11-29",
    owner: {
      name: "Refugio Costa Verde",
      type: "refugio",
      contact: "contacto@costaverde.com",
    },
    characteristics: ["Amigable", "Juguetón", "Bueno con niños", "Nadador"],
    vaccinated: true,
    sterilized: true,
  },
  {
    id: "8",
    name: "Cleo",
    species: "gato",
    breed: "Gato Común Europeo",
    age: "5 años",
    ageInMonths: 60,
    size: "mediano",
    gender: "hembra",
    city: "Granada",
    description:
      "Cleo es una gata tranquila y cariñosa. Le gusta dormir en lugares cómodos y recibir caricias. Ideal para personas mayores o vida tranquila.",
    images: [
      "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    ],
    status: "disponible",
    publishedDate: "2024-11-27",
    owner: {
      name: "Refugio Milagros",
      type: "refugio",
      contact: "info@milagros.es",
    },
    characteristics: ["Tranquila", "Cariñosa", "Independiente", "Limpia"],
    vaccinated: true,
    sterilized: true,
  },
];

export const getpets = (): MockPet[] => {
  return mockPets;
};

export const getPetById = (id: string): MockPet | undefined => {
  return mockPets.find((pet) => pet.id === id);
};

export const getPetsBySpecies = (species: "perro" | "gato"): MockPet[] => {
  return mockPets.filter((pet) => pet.species === species);
};

export const getPetsByCity = (city: string): MockPet[] => {
  return mockPets.filter(
    (pet) => pet.city.toLowerCase() === city.toLowerCase()
  );
};

export const getAvailablePets = (): MockPet[] => {
  return mockPets.filter((pet) => pet.status === "disponible");
};

export const getRelatedPets = (currentPetId: string, limit: number = 3): MockPet[] => {
  const currentPet = getPetById(currentPetId);
  if (!currentPet) return [];

  return mockPets
    .filter(
      (pet) =>
        pet.id !== currentPetId &&
        pet.species === currentPet.species &&
        pet.status === "disponible"
    )
    .slice(0, limit);
};

export const filterPets = (filters: {
  species?: "perro" | "gato";
  size?: "pequeño" | "mediano" | "grande";
  gender?: "macho" | "hembra";
  city?: string;
}): MockPet[] => {
  return mockPets.filter((pet) => {
    if (filters.species && pet.species !== filters.species) return false;
    if (filters.size && pet.size !== filters.size) return false;
    if (filters.gender && pet.gender !== filters.gender) return false;
    if (
      filters.city &&
      pet.city.toLowerCase() !== filters.city.toLowerCase()
    )
      return false;
    return true;
  });
};

export const getCities = (): string[] => {
  return Array.from(new Set(mockPets.map((pet) => pet.city))).sort();
};

export const getBreedsBySpecies = (species: "perro" | "gato"): string[] => {
  return Array.from(
    new Set(
      mockPets.filter((pet) => pet.species === species).map((pet) => pet.breed)
    )
  ).sort();
};


/**
 * Script para generar enlaces directos de creación de índices
 * Ejecuta consultas de prueba para que Firestore genere los enlaces
 */

import { db } from "../config/firebaseAdmin";

async function generateIndexLinks() {
  if (!db) {
    console.error("❌ Firestore no está inicializado");
    process.exit(1);
  }

  console.log("🔍 Ejecutando consultas de prueba para generar enlaces de índices...\n");
  console.log("⚠️  Los enlaces aparecerán en los errores si faltan índices.\n");
  console.log("=" .repeat(60));

  const queries = [
    {
      name: "pets - ownerId + createdAt",
      collection: "pets",
      query: () => db!.collection("pets").where("ownerId", "==", "_test").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "pets - city + type + createdAt",
      collection: "pets",
      query: () => db!.collection("pets").where("city", "==", "_test").where("type", "==", "dog").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "favorites - userId + createdAt",
      collection: "favorites",
      query: () => db!.collection("favorites").where("userId", "==", "_test").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "favorites - petId + createdAt",
      collection: "favorites",
      query: () => db!.collection("favorites").where("petId", "==", "_test").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "adoptionRequests - petId + createdAt",
      collection: "adoptionRequests",
      query: () => db!.collection("adoptionRequests").where("petId", "==", "_test").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "adoptionRequests - requesterId + createdAt",
      collection: "adoptionRequests",
      query: () => db!.collection("adoptionRequests").where("requesterId", "==", "_test").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "adoptionRequests - ownerId + status + createdAt",
      collection: "adoptionRequests",
      query: () => db!.collection("adoptionRequests").where("ownerId", "==", "_test").where("status", "==", "pending").orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "messages - conversationId + createdAt",
      collection: "messages",
      query: () => db!.collection("messages").where("conversationId", "==", "_test").orderBy("createdAt", "asc").limit(1),
    },
    {
      name: "messages - receiverId + read + createdAt",
      collection: "messages",
      query: () => db!.collection("messages").where("receiverId", "==", "_test").where("read", "==", false).orderBy("createdAt", "desc").limit(1),
    },
    {
      name: "conversations - participants + updatedAt",
      collection: "conversations",
      query: () => db!.collection("conversations").where("participants", "array-contains", "_test").orderBy("updatedAt", "desc").limit(1),
    },
  ];

  const links: Array<{ name: string; link?: string; error?: string }> = [];

  for (const { name, query } of queries) {
    try {
      await query().get();
      console.log(`✅ ${name} - Índice existe o no es necesario`);
    } catch (error: any) {
      if (error.code === 9 && error.details) {
        const linkMatch = error.details.match(/https:\/\/[^\s]+/);
        if (linkMatch) {
          const link = linkMatch[0];
          links.push({ name, link });
          console.log(`\n📋 ${name}`);
          console.log(`🔗 ${link}\n`);
        } else {
          links.push({ name, error: error.details });
          console.log(`\n❌ ${name} - Error: ${error.details}\n`);
        }
      } else {
        console.log(`⚠️  ${name} - Error: ${error.message}`);
      }
    }
  }

  console.log("\n" + "=" .repeat(60));
  console.log("\n📝 RESUMEN DE ENLACES GENERADOS:\n");

  if (links.length === 0) {
    console.log("✅ Todos los índices necesarios ya existen o no se generaron enlaces.");
  } else {
    links.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      if (item.link) {
        console.log(`   🔗 ${item.link}\n`);
      } else if (item.error) {
        console.log(`   ⚠️  ${item.error}\n`);
      }
    });
  }

  console.log("\n💡 INSTRUCCIONES:");
  console.log("1. Copia cada enlace y ábrelo en tu navegador");
  console.log("2. Firebase creará el índice automáticamente");
  console.log("3. Espera a que el estado cambie a 'Habilitado'");
  console.log("4. Los índices pueden tardar unos minutos en construirse\n");

  process.exit(0);
}

generateIndexLinks().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});



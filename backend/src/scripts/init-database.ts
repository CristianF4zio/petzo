/**
 * Script de inicialización de la base de datos
 * Crea las colecciones y estructura inicial con documentos de ejemplo
 * para que aparezcan en la consola de Firebase
 * 
 * Ejecutar con: npm run init-db
 * o: tsx src/scripts/init-database.ts
 */

import { db, firebaseAdmin } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";

async function initializeDatabase() {
  try {
    if (!db || !firebaseAdmin) {
      console.error("❌ Firebase Admin no está inicializado");
      console.log("💡 Asegúrate de tener las credenciales configuradas en .env");
      process.exit(1);
    }

    console.log("🚀 Inicializando base de datos Firestore...\n");

    // Verificar conexión
    const testDoc = await db.collection("_test").doc("connection").get();
    console.log("✅ Conexión a Firestore establecida\n");

    const now = Date.now();

    // Crear documentos de ejemplo en cada colección para que aparezcan en la consola
    console.log("📝 Creando colecciones con documentos de ejemplo...\n");

    // 1. Colección: pets
    const petsRef = db.collection(COLLECTIONS.PETS);
    const petsSnapshot = await petsRef.limit(1).get();
    if (petsSnapshot.empty) {
      await petsRef.doc("_example").set({
        name: "Ejemplo de Mascota",
        type: "dog",
        age: 2,
        sex: "male",
        city: "Buenos Aires",
        description: "Este es un documento de ejemplo. Puedes eliminarlo.",
        photoUrl: "",
        ownerId: "_example_owner",
        createdAt: now,
        updatedAt: now,
        status: "available",
        views: 0,
        likes: 0,
      });
      console.log(`   ✅ ${COLLECTIONS.PETS} - Documento de ejemplo creado`);
    } else {
      console.log(`   ⏭️  ${COLLECTIONS.PETS} - Ya existe`);
    }

    // 2. Colección: favorites
    const favoritesRef = db.collection(COLLECTIONS.FAVORITES);
    const favoritesSnapshot = await favoritesRef.limit(1).get();
    if (favoritesSnapshot.empty) {
      await favoritesRef.doc("_example").set({
        userId: "_example_user",
        petId: "_example_pet",
        createdAt: now,
      });
      console.log(`   ✅ ${COLLECTIONS.FAVORITES} - Documento de ejemplo creado`);
    } else {
      console.log(`   ⏭️  ${COLLECTIONS.FAVORITES} - Ya existe`);
    }

    // 3. Colección: adoptionRequests
    const adoptionRequestsRef = db.collection(COLLECTIONS.ADOPTION_REQUESTS);
    const adoptionRequestsSnapshot = await adoptionRequestsRef.limit(1).get();
    if (adoptionRequestsSnapshot.empty) {
      await adoptionRequestsRef.doc("_example").set({
        petId: "_example_pet",
        requesterId: "_example_user",
        ownerId: "_example_owner",
        status: "pending",
        message: "Este es un documento de ejemplo. Puedes eliminarlo.",
        createdAt: now,
        updatedAt: now,
      });
      console.log(`   ✅ ${COLLECTIONS.ADOPTION_REQUESTS} - Documento de ejemplo creado`);
    } else {
      console.log(`   ⏭️  ${COLLECTIONS.ADOPTION_REQUESTS} - Ya existe`);
    }

    // 4. Colección: messages
    const messagesRef = db.collection(COLLECTIONS.MESSAGES);
    const messagesSnapshot = await messagesRef.limit(1).get();
    if (messagesSnapshot.empty) {
      await messagesRef.doc("_example").set({
        conversationId: "_example_conversation",
        senderId: "_example_user1",
        receiverId: "_example_user2",
        content: "Este es un documento de ejemplo. Puedes eliminarlo.",
        read: false,
        createdAt: now,
      });
      console.log(`   ✅ ${COLLECTIONS.MESSAGES} - Documento de ejemplo creado`);
    } else {
      console.log(`   ⏭️  ${COLLECTIONS.MESSAGES} - Ya existe`);
    }

    // 5. Colección: conversations
    const conversationsRef = db.collection("conversations");
    const conversationsSnapshot = await conversationsRef.limit(1).get();
    if (conversationsSnapshot.empty) {
      await conversationsRef.doc("_example").set({
        participants: ["_example_user1", "_example_user2"],
        createdAt: now,
        updatedAt: now,
        unreadCount: {
          "_example_user1": 0,
          "_example_user2": 0,
        },
      });
      console.log(`   ✅ conversations - Documento de ejemplo creado`);
    } else {
      console.log(`   ⏭️  conversations - Ya existe`);
    }

    // Limpiar documento de prueba
    await db.collection("_test").doc("connection").delete();

    console.log("\n✅ Base de datos inicializada correctamente!");
    console.log("\n📋 Colecciones disponibles en la consola:");
    console.log(`   - ${COLLECTIONS.USERS}`);
    console.log(`   - ${COLLECTIONS.PETS}`);
    console.log(`   - ${COLLECTIONS.FAVORITES}`);
    console.log(`   - ${COLLECTIONS.ADOPTION_REQUESTS}`);
    console.log(`   - ${COLLECTIONS.MESSAGES}`);
    console.log(`   - conversations`);
    console.log("\n💡 Los documentos de ejemplo tienen el ID '_example' y puedes eliminarlos cuando quieras.");
    console.log("   Las colecciones ahora son visibles en la consola de Firebase.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };


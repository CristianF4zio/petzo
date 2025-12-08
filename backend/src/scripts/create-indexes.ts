/**
 * Script para crear índices de Firestore usando la API REST de Firebase
 * 
 * NOTA: Este script requiere permisos de administrador en el proyecto Firebase.
 * Si no tienes permisos, los índices se crearán automáticamente cuando
 * Firestore detecte consultas que los requieran.
 */

import * as fs from "fs";
import * as path from "path";

interface IndexField {
  fieldPath: string;
  order?: "ASCENDING" | "DESCENDING";
  arrayConfig?: "CONTAINS";
}

interface Index {
  collectionGroup: string;
  queryScope: string;
  fields: IndexField[];
}

interface IndexesFile {
  indexes: Index[];
}

const indexesPath = path.join(__dirname, "../../firestore.indexes.json");
const projectId = "petzo-c1dd5";

console.log("📋 Leyendo archivo de índices...\n");

try {
  const indexesFile: IndexesFile = JSON.parse(
    fs.readFileSync(indexesPath, "utf-8")
  );

  console.log(`✅ Encontrados ${indexesFile.indexes.length} índices para crear\n`);
  console.log("=" .repeat(60));
  console.log("\n📝 INSTRUCCIONES PARA CREAR ÍNDICES MANUALMENTE:\n");
  console.log("=" .repeat(60));
  console.log("\n1. Abre: https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes\n");
  console.log("2. Haz clic en 'Agregar índice' y crea cada uno:\n");

  indexesFile.indexes.forEach((index, i) => {
    console.log(`\n--- Índice ${i + 1}/${indexesFile.indexes.length} ---`);
    console.log(`Colección: ${index.collectionGroup}`);
    console.log(`Campos:`);
    
    index.fields.forEach((field, j) => {
      if (field.arrayConfig) {
        console.log(`  ${j + 1}. ${field.fieldPath} → Array contiene`);
      } else {
        console.log(`  ${j + 1}. ${field.fieldPath} → ${field.order === "ASCENDING" ? "Ascendente" : "Descendente"}`);
      }
    });
  });

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 NOTA: Los índices también se crearán automáticamente");
  console.log("   cuando Firestore detecte consultas que los requieran.\n");
  console.log("   Puedes continuar desarrollando y crear los índices");
  console.log("   cuando aparezcan los mensajes de error en la consola.\n");

} catch (error: any) {
  console.error("❌ Error al leer el archivo de índices:");
  console.error(error.message);
  process.exit(1);
}


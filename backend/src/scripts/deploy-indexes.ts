import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const indexesPath = path.join(__dirname, "../../firestore.indexes.json");

console.log("🚀 Intentando desplegar índices de Firestore...\n");

try {
  // Verificar que el archivo existe
  if (!fs.existsSync(indexesPath)) {
    throw new Error(`No se encontró el archivo: ${indexesPath}`);
  }

  console.log(`✅ Archivo encontrado: ${indexesPath}\n`);

  // Ejecutar el comando de Firebase CLI
  console.log("📤 Ejecutando: firebase deploy --only firestore:indexes\n");
  
  try {
    const output = execSync("firebase deploy --only firestore:indexes", {
      cwd: path.join(__dirname, "../.."),
      encoding: "utf-8",
      stdio: "pipe",
    });
    
    console.log(output);
    console.log("\n✅ Índices desplegados correctamente!");
  } catch (cliError: any) {
    console.error("\n⚠️  No se pudieron desplegar los índices mediante CLI.");
    console.error("   Esto puede deberse a permisos insuficientes.\n");
    console.error("   Error:", cliError.message);
    
    if (cliError.stdout) {
      console.error("\nSalida:", cliError.stdout);
    }
    
    if (cliError.stderr) {
      console.error("\nError:", cliError.stderr);
    }
    
    // Mostrar instrucciones alternativas
    console.log("\n" + "=".repeat(60));
    console.log("\n💡 SOLUCIÓN ALTERNATIVA:\n");
    console.log("Los índices se crearán automáticamente cuando Firestore");
    console.log("detecte consultas que los requieran.\n");
    console.log("Puedes continuar desarrollando y crear los índices");
    console.log("cuando aparezcan los mensajes de error en la consola de Firebase.\n");
    console.log("O bien, créalos manualmente en:");
    console.log("https://console.firebase.google.com/project/petzo-c1dd5/firestore/indexes\n");
    console.log("=".repeat(60) + "\n");
  }
} catch (error: any) {
  console.error("\n❌ Error:");
  console.error(error.message);
  process.exit(1);
}


import { db } from "@/lib/db";
import { pwdCrypt } from "../src/helpers/pwd";
import { textFirstName } from "../src/helpers/text";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

const seedUser = {
  email: process.env.SEED_USER_EMAIL,
  fullName: process.env.SEED_USER_FULL_NAME,
  password: process.env.SEED_USER_PASSWORD,
};

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  if (!seedUser.email || !seedUser.fullName || !seedUser.password) {
    console.error("❌ Variáveis de ambiente não configuradas.");
    process.exit(1);
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email: seedUser.email },
    });

    if (existingUser) {
      console.log("ℹ️  Usuário administrador já existe no banco de dados.");
      return;
    }

    console.log("👤 Criando usuário administrador...");

    const passwordCrypt = await pwdCrypt(seedUser.password);
    const displayName = textFirstName(seedUser.fullName);

    const user = await db.user.create({
      data: {
        email: seedUser.email,
        fullName: seedUser.fullName,
        displayName,
        password: passwordCrypt,
      },
    });

    if (user) {
      console.log("✅ Usuário administrador criado com sucesso!");
      console.log(`📧 Email: ${seedUser.email}`);
      console.log(`🔑 Senha: ${seedUser.password}`);
      console.log(`👤 Nome: ${user.fullName}`);
      console.log(`🏷️  Display Name: ${user.displayName}`);
    } else {
      console.error("❌ Erro ao criar usuário administrador.");
      process.exit(1);
    }

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

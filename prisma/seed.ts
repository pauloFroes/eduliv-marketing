import { PrismaClient } from "./generated";
import { pwdCrypt } from "../src/helpers/pwd";
import { textFirstName } from "../src/helpers/text";

const prisma = new PrismaClient();

const seedUser = {
  email: "admin@eduliv.com",
  fullName: "Administrador EduLIV",
  password: "admin123456",
};

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: seedUser.email },
    });

    if (existingUser) {
      console.log("ℹ️  Usuário administrador já existe no banco de dados.");
      return;
    }

    // Criar usuário administrador
    console.log("👤 Criando usuário administrador...");

    const passwordCrypt = await pwdCrypt(seedUser.password);
    const displayName = textFirstName(seedUser.fullName);

    const user = await prisma.user.create({
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
    await prisma.$disconnect();
  });

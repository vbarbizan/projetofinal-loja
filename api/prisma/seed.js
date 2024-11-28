import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Crie a senha hash para o administrador
  const hashedPassword = await bcrypt.hash("matheus", 10);

  // Insira o administrador no banco de dados
  const admin = await prisma.user.upsert({
    where: { email: "matheus" },
    update: {},
    create: {
      nome: "matheus",
      email: "matheus@matheus.com",
      telefone: "11999999999",
      password: hashedPassword,
      role: "ADMIN",
      cpf: "887778888888",
      endereco: {
        create: {
          cep: "12345-678",
          cidade: "São Paulo",
          bairro: "Centro",
          logradouro: "Rua do Admin",
          complemento: "Apto 1001",
          numero: "123",
        },
      },
      imagem: "https://placehold.co/400x400",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

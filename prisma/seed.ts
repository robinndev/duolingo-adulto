import { PrismaClient, Category, PlayerColor } from "@prisma/client";

const prisma = new PrismaClient();

const casa: Array<[string, number]> = [
  ["Lavar pratos", 1],
  ["Dar banho no cachorro", 3],
  ["Levar o cachorro para passear", 2],
  ["Lavar o banheiro", 5],
  ["Arrumar sala + mesa do computador", 3],
  ["Limpar o fogão", 2],
  ["Arrumar a varanda", 3],
  ["Lavar + estender roupas", 4],
  ["Arrumar guarda-roupa", 4],
  ["Varrer a casa toda", 3],
  ["Aspirar a casa toda", 3],
  ["Passar pano em 1 cômodo", 2],
  ["Passar pano em 2 cômodos", 4],
  ["Passar pano em 3 ou mais cômodos", 6],
  ["Fazer almoço", 3],
  ["Fazer café/janta", 2],
  ["Limpar espelhos", 2],
  ["Limpar portas", 2],
  ["Levar o lixo", 1],
  ["Limpar caixinha de areia", 2],
];

const casal: Array<[string, number]> = [
  ["Fazer algo que deixe o parceiro genuinamente feliz", 3],
  ["Ato romântico", 3],
  ["Planejar algo para o parceiro e realizar", 5],
  ["Preparar uma surpresa para o parceiro", 5],
  ["Fazer uma refeição que o parceiro gosta", 3],
  ["Organizar um date", 4],
  ["Fazer uma noite sem celular juntos", 3],
  ["Fazer algo que o parceiro queria fazer", 3],
  ["Ajudar o parceiro em algo sem ele pedir", 3],
  ["Fazer uma atividade nova juntos", 4],
  ["Planejar um passeio surpresa", 5],
  ["Ir à academia", 2],
  ["Cumprir a dieta durante o dia inteiro", 2],
  ["Tomar 3 banhos no dia", 1],
];

async function main() {
  await prisma.player.upsert({
    where: { color: PlayerColor.NAVY },
    update: {},
    create: { name: process.env.PLAYER_NAVY_NAME ?? "Ele", color: PlayerColor.NAVY },
  });
  await prisma.player.upsert({
    where: { color: PlayerColor.PINK },
    update: {},
    create: { name: process.env.PLAYER_PINK_NAME ?? "Ela", color: PlayerColor.PINK },
  });

  for (const [name, points] of casa) {
    await prisma.activity.upsert({
      where: { name_category: { name, category: Category.CASA } },
      update: { points },
      create: { name, points, category: Category.CASA },
    });
  }
  for (const [name, points] of casal) {
    await prisma.activity.upsert({
      where: { name_category: { name, category: Category.CASAL } },
      update: { points },
      create: { name, points, category: Category.CASAL },
    });
  }

  console.log("Seed concluído ✅");
}

main().finally(() => prisma.$disconnect());

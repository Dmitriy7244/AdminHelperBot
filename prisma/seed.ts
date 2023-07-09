import env from "env"
import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.str("DATABASE_URL"),
    },
  },
})

const dinosaurData: Prisma.DinosaurCreateInput[] = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull.",
  },
  {
    name: "Acanthopholis",
    description: "No, it's not a city in Greece.",
  },
]

for (const u of dinosaurData) {
  const dinosaur = await prisma.dinosaur.create({
    data: u,
  })
  console.log(`Created dinosaur with id: ${dinosaur.id}`)
}
console.log(`Seeding finished.`)

await prisma.$disconnect()

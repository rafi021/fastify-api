import { env } from "./config/env";
import { logger } from "./utils/logger";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { buildServer } from "./utils/server";
import { db } from "./db";

async function graceFullShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}
async function main() {
  const app = await buildServer();

  app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const signals = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    console.log("Got signal: " + signal);
    process.on(signal, () => graceFullShutdown({ app }));
  }
  // logger.info("Server is running on port 3000");
}

main();

import { env } from "./config/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";

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

  const signals = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    console.log("Got signal: " + signal);
    process.on(signal, () => graceFullShutdown({ app }));
  }
  // logger.info("Server is running on port 3000");
}

main();

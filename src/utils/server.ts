import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/applications/application.route";

export async function buildServer() {
  const app = fastify({
    logger: logger,
  });

  // register the plugins

  // register routes
  app.register(applicationRoutes, { prefix: "/api/applications" });
  return app;
}

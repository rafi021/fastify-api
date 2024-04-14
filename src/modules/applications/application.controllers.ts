import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./application.schemas";
import { createApplication } from "./application.services";

export async function createApplicationHandler(
  request: FastifyRequest<{
    Body: CreateApplicationBody;
  }>,
  response: FastifyReply
) {
  const { name } = request.body;

  const application = await createApplication({
    name,
  });

  return {
    application,
  };
}

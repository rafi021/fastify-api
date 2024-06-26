import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserSchema } from "./user.schema";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/role.services";
import {
  assignRoleToUser,
  createUser,
  getUsersByApplication,
} from "./user.services";

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserSchema;
  }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);
    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super admin user",
        extensions: {
          code: "APPLICATION_ALREADY_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
      extensions: {
        code: "ROLE_NOT_FOUND",
        roleName: roleName,
      },
    });
  }

  try {
    const user = await createUser(data);
    // assign a role to the user
    await assignRoleToUser({
      userId: user.id,
      roleId: role.id,
      applicationId: data.applicationId,
    });
    return user;
  } catch (error) {}
}

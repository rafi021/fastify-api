import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./application.schemas";
import { createApplication, getApplications } from "./application.services";
import { createRole } from "../roles/role.services";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";

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

  const superAdminRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as Array<string>,
  });

  const applicationUserRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });

  const [superAdminRole, applicationUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    applicationUserRolePromise,
  ]);

  if (superAdminRole.status === "rejected") {
    throw new Error("Error creating superadmin role");
  }

  if (applicationUserRole.status === "rejected") {
    throw new Error("Error creating application user role");
  }

  return {
    application,
    superAdminRole: superAdminRole.value,
    applicationUserRole: applicationUserRole.value,
  };
}

export async function getApplicationshandler() {
  return getApplications();
}

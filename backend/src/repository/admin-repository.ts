import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

class AdminRepository {
  constructor() {}

  async findAllUsers() {
    try {
      logger.debug("[AdminRepository] Fetching all users");
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: { role: "asc" },
      });
    } catch (error) {
      logger.error("[AdminRepository] Error fetching users:", error);
      throw error;
    }
  }

  async findAllApplications() {
    try {
      logger.debug("[AdminRepository] Fetching all applications");
      return await prisma.application.findMany({
        orderBy: { dateTime: "desc" },
      });
    } catch (error) {
      logger.error("[AdminRepository] Error fetching applications:", error);
      throw error;
    }
  }

  async findApplicationById(id: string) {
    try {
      logger.debug(`[AdminRepository] Finding application with ID: ${id}`);
      return await prisma.application.findUnique({ where: { id } });
    } catch (error) {
      logger.error(`[AdminRepository] Error finding application ${id}:`, error);
      throw error;
    }
  }

  async updateApplicationStatus(id: string, status: string, adminId: string) {
    try {
      logger.debug(`[AdminRepository] Updating application ${id} to status ${status}`);
      return await prisma.application.update({
        where: { id },
        data: {
          status,
          approvedBy: { connect: { id: adminId } },
        },
      });
    } catch (error) {
      logger.error(`[AdminRepository] Error updating application status ${id}:`, error);
      throw error;
    }
  }
}

export default AdminRepository;
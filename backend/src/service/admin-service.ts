import AdminRepository from "../repository/admin-repository";
import logger from "../utils/logger";

class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async getAllUsers() {
    try {
      logger.debug("[AdminService] Fetching all users");
      return await this.adminRepository.findAllUsers();
    } catch (error) {
      logger.error("[AdminService] Error fetching all users:", error);
      throw error;
    }
  }

  async getAllApplications() {
    try {
      logger.debug("[AdminService] Fetching all applications");
      return await this.adminRepository.findAllApplications();
    } catch (error) {
      logger.error("[AdminService] Error fetching all applications:", error);
      throw error;
    }
  }

  async approveOrRejectApplication(
    id: string,
    status: string,
    adminId: string
  ) {
    try {
      logger.debug(
        `[AdminService] Processing application ${id} with status ${status}`
      );
      const application = await this.adminRepository.findApplicationById(id);
      if (!application) {
        logger.warn(`[AdminService] Application ${id} not found`);
        throw new Error("Application not found");
      }
      if (status !== "APPROVED" && status !== "REJECTED") {
        logger.warn(
          `[AdminService] Invalid status '${status}' for application ${id}`
        );
        throw new Error("Invalid status");
      }
      return await this.adminRepository.updateApplicationStatus(
        id,
        status,
        adminId
      );
    } catch (error) {
      logger.error(`[AdminService] Error updating application ${id}:`, error);
      throw error;
    }
  }
}


export default AdminService;
// src/services/loanService.ts
import LoanRepository from "../repository/loan-repository";
import logger from "../utils/logger";

class LoanService {
  private loanRepository: LoanRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
  }

  async approveAndCreateLoan(appId: string, adminId: string) {
    try {
      const application = await this.loanRepository.findApplication(appId);
      if (!application) throw new Error("Application not found");

      await this.loanRepository.approveApplication(appId, adminId);

      const { amount: principal, tenure, userId } = application;
      const annualInterestRate = 12;

      // Don't store EMI since it's not in the schema
      return await this.loanRepository.createLoan({
        applicationId: appId,
        userId,
        interestRate: annualInterestRate,
        principalLeft: principal,
        tenureMonths: tenure,
      });
    } catch (error) {
      logger.error(`[LoanService] Error approving and creating loan for ${appId}:`, error);
      throw error;
    }
  }

  async getLoanDetails(loanId: string) {
    try {
      return await this.loanRepository.getLoanDetails(loanId);
    } catch (error) {
      logger.error(`[LoanService] Error fetching loan details for ${loanId}:`, error);
      throw error;
    }
  }

  async getUserLoans(userId: string) {
    try {
      return await this.loanRepository.getUserLoans(userId);
    } catch (error) {
      logger.error(`[LoanService] Error fetching loans for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserTotalLoan(userId: string) {
    try {
      const loans = await this.loanRepository.getTotalLoanPrincipal(userId);
      return loans.reduce((sum, loan) => sum + Math.max(loan.principalLeft, 0), 0);
    } catch (error) {
      logger.error(`[LoanService] Error calculating total loan for user ${userId}:`, error);
      throw error;
    }
  }

  async getLoanStats() {
    try {
      return await this.loanRepository.getLoanStatistics();
    } catch (error) {
      logger.error("[LoanService] Error fetching loan statistics:", error);
      throw error;
    }
  }
}

export default LoanService;

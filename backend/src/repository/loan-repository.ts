// src/repositories/loanRepository.ts
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

class LoanRepository {

  async findApplication(appId: string) {
    try {
      logger.debug(`[LoanRepository] Fetching application ${appId}`);
      return await prisma.application.findUnique({ where: { id: appId } });
    } catch (error) {
      logger.error(`[LoanRepository] Error fetching application ${appId}:`, error);
      throw error;
    }
  }

  async approveApplication(appId: string, adminId: string) {
    try {
      logger.info(`[LoanRepository] Approving application ${appId}`);
      return await prisma.application.update({
        where: { id: appId },
        data: {
          status: "APPROVED",
          approvedBy: { connect: { id: adminId } },
        },
      });
    } catch (error) {
      logger.error(`[LoanRepository] Error approving application ${appId}:`, error);
      throw error;
    }
  }

  async createLoan(data: any) {
    try {
      logger.info(`[LoanRepository] Creating loan for user ${data.userId}`);
      return await prisma.loan.create({ data });
    } catch (error) {
      logger.error(`[LoanRepository] Error creating loan:`, error);
      throw error;
    }
  }

  async getLoanDetails(loanId: string) {
    try {
      return await prisma.loan.findUnique({
        where: { id: loanId },
        include: { transactions: true },
      });
    } catch (error) {
      logger.error(`[LoanRepository] Error fetching loan details for ${loanId}:`, error);
      throw error;
    }
  }

  async getUserLoans(userId: string) {
    try {
      return await prisma.loan.findMany({
        where: { userId },
        include: {
          transactions: true,
          application: true,
        },
      });
    } catch (error) {
      logger.error(`[LoanRepository] Error fetching user loans for ${userId}:`, error);
      throw error;
    }
  }

  async getTotalLoanPrincipal(userId: string) {
    try {
      return await prisma.loan.findMany({
        where: { userId },
        select: { principalLeft: true },
      });
    } catch (error) {
      logger.error(`[LoanRepository] Error fetching loan principals for ${userId}:`, error);
      throw error;
    }
  }

  async getLoanStatistics() {
    try {
      const [totalLoans, totalUsers, disbursedCash, repaidLoans, approvedLoans] = await Promise.all([
        prisma.loan.count(),
        prisma.user.count(),
        prisma.application.aggregate({
          where: { status: "APPROVED" },
          _sum: { amount: true },
        }),
        prisma.loan.count({ where: { principalLeft: { lte: 0 } } }),
        prisma.loan.findMany({
          select: { principalLeft: true, interestRate: true, tenureMonths: true },
        }),
      ]);

      let totalSavings = 0;
      approvedLoans.forEach((loan) => {
        totalSavings += (loan.principalLeft * loan.interestRate * loan.tenureMonths) / 100;
      });

      logger.info(`[LoanRepository] Computed statistics:
        Total Loans: ${totalLoans},
        Total Users: ${totalUsers},
        Total Disbursed Cash: ${disbursedCash._sum.amount ?? 0},
        Total Savings: ${totalSavings},
        Repaid Loans Count: ${repaidLoans}`);

      return {
        totalLoans,
        totalUsers,
        totalDisbursedCash: disbursedCash._sum.amount ?? 0,
        totalSavings,
        repaidLoansCount: repaidLoans,
        totalCashReceived: totalSavings + (disbursedCash._sum.amount ?? 0),
      };
    } catch (error) {
      logger.error(`[LoanRepository] Error computing loan statistics:`, error);
      throw error;
    }
  }
}


export default LoanRepository;
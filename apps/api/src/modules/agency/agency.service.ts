import { ApiError } from "@/utils/api-error";
import { AgencyRepository } from "./agency.repository";
import { Prisma } from "@estateos/database";

export class AgencyService {
  static async createAgency(data: Prisma.AgencyCreateInput) {
    const existing = await AgencyRepository.findBySlug(data.slug);
    if (existing) {
      throw ApiError.badRequest("Agency with this slug already exists");
    }

    return AgencyRepository.create(data);
  }

  static async getAgency(id: string) {
    const agency = await AgencyRepository.findById(id);
    if (!agency || agency.status === "DELETED") {
      throw ApiError.notFound("Agency not found");
    }
    return agency;
  }

  static async getAllAgencies(skip = 0, take = 20) {
    return AgencyRepository.findAll({ skip, take });
  }

  static async updateAgency(id: string, data: Prisma.AgencyUpdateInput) {
    // Ensure agency exists
    await this.getAgency(id);
    return AgencyRepository.update(id, data);
  }

  static async deleteAgency(id: string) {
    await this.getAgency(id);
    return AgencyRepository.delete(id);
  }

  static async updateSettings(agencyId: string, data: Prisma.AgencySettingsUpdateInput) {
    await this.getAgency(agencyId);
    return AgencyRepository.updateSettings(agencyId, data);
  }
}

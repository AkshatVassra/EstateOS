import { ApiError } from "@/utils/api-error";
import { TaskRepository } from "./task.repository";
import { Prisma, TaskStatus } from "@estateos/database";
import type { z } from "zod";
import type { createTaskSchema, updateTaskSchema } from "./task.validator";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export class TaskService {
  static async createTask(agencyId: string, data: CreateTaskInput) {
    const dbData: Prisma.TaskUncheckedCreateInput = {
      ...data,
      agencyId,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
    };
    return TaskRepository.create(dbData);
  }

  static async getTask(id: string, agencyId: string) {
    const task = await TaskRepository.findById(id, agencyId);
    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    return task;
  }

  static async getAllTasks(agencyId: string, skip = 0, take = 20, status?: string, leadId?: string) {
    return TaskRepository.findAll(agencyId, { skip, take, status: status as TaskStatus | undefined, leadId });
  }

  static async updateTask(id: string, agencyId: string, data: UpdateTaskInput) {
    await this.getTask(id, agencyId);
    const updateData: Prisma.TaskUncheckedUpdateInput = {
      ...data,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
    };
    return TaskRepository.update(id, agencyId, updateData);
  }

  static async deleteTask(id: string, agencyId: string) {
    await this.getTask(id, agencyId);
    return TaskRepository.delete(id, agencyId);
  }
}

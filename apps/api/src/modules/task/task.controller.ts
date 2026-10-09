import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { TaskService } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.validator";
import { AuthContext } from "@/utils/route-handler";

export class TaskController {
  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = createTaskSchema.parse(body);
    const task = await TaskService.createTask(auth.agencyId, data);
    return ApiResponse.success("Task created successfully", task, 201);
  }

  static async getAll(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const status = url.searchParams.get("status") || undefined;
    const leadId = url.searchParams.get("leadId") || undefined;
    
    const tasks = await TaskService.getAllTasks(auth.agencyId, skip, take, status, leadId);
    return ApiResponse.success("Tasks fetched successfully", tasks);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    const task = await TaskService.getTask(id, auth.agencyId);
    return ApiResponse.success("Task fetched successfully", task);
  }

  static async update(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const data = updateTaskSchema.parse(body);
    const task = await TaskService.updateTask(id, auth.agencyId, data);
    return ApiResponse.success("Task updated successfully", task);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await TaskService.deleteTask(id, auth.agencyId);
    return ApiResponse.success("Task deleted successfully");
  }
}

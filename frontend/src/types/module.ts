export interface Module {
  id: number;
  name: string;
  content: string;
  description: string;
  category: string;
  create_time: number;
  update_time: number;
}

export interface ModuleFormData {
  name: string;
  content: string;
  description: string;
  category: string;
}
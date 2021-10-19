export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  // putById: (id: string, resource: any) => Promise<string>;
  getById: (id: string) => Promise<any>;
  // deleteUser: (id: string) => Promise<string>;
  patchById: (id: string, resource: any) => Promise<any>;
}

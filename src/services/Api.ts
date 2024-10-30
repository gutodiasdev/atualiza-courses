import { setupAxiosClient } from '@/lib/api';
import { AxiosInstance } from 'axios';

export class Api {
  private static _instance: Api;
  private api: AxiosInstance;

  constructor() {
    this.api = setupAxiosClient();
  }

  public static instance() {
    if (!Api._instance) {
      Api._instance = new Api();
    }

    return Api._instance;
  }

  public me() {
    return this.api.get('me');
  }

  public async login(username: string, password: string): Promise<{ token: string }> {
    return await this.api.post('login', { email: username, password });
  }

  public getMessages(collection_item_id: number) {
    return this.api.get(`messages/${collection_item_id}`);
  }

  public sendMessage(collection_item_id: number, text: string) {
    return this.api.post(`messages/${collection_item_id}`, { text });
  }

  public getTasks(collection_item_id: number) {
    return this.api.get(`tasks/${collection_item_id}`);
  }

  public getCollectionItems(type: 'consultoria' | 'projetos' | 'campanhas', query?: string) {
    return this.api.get(`collections-items/${type}${query ? `?query=${query}` : ''}`);
  }

  public getCollection(type: 'consultoria' | 'projetos' | 'campanhas', query?: string) {
    return this.api.get(`collection/${type}${query ? `?query=${query}` : ''}`);
  }

  public getCollectionItem(id: number) {
    return this.api.get(`collection-item/${id}`);
  }

  public updateTask(collection_item_id: number, task_id: number, status: string) {
    return this.api.put(`tasks/${collection_item_id}/${task_id}`, { status });
  }

  public support(message: string) {
    return this.api.post('/user/support', { message });
  }

  public getClients(type: 'teacher' | 'student') {
    return this.api.get('/clientes/' + type);
  }

  public addUser(data: Partial<any>, role: string) {
    return this.api.post('/user', { ...data, role });
  }

  public updateUser(id: number, data: Partial<any>, role: string) {
    return this.api.put('/user/' + id, { ...data, role });
  }

  public addCourse(data: Partial<any>) {
    return this.api.post('/course', { ...data });
  }

  public updateCourse(id: number, data: Partial<any>) {
    return this.api.put('/course/' + id, { ...data });
  }

  public getCourses() {
    return this.api.get('/courses');
  }
}

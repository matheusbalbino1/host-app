import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClient } from '../shared/models/client.model';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

interface IRequest<T> {
  clients: Array<T>;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://boasorte.teddybackoffice.com.br';
  private selectedClients: number[] = [];

  constructor(private http: HttpClient) {}

  getSelectedClients() {
    return this.selectedClients;
  }

  addClient(addClient: IClient) {
    this.selectedClients = [
      ...this.selectedClients.filter((client) => client !== addClient.id),
      addClient.id,
    ];
  }

  removeClient(removedClient: IClient) {
    this.selectedClients = [
      ...this.selectedClients.filter((client) => client !== removedClient.id),
    ];
  }

  cleanSelectedClients() {
    this.selectedClients = [];
  }

  getClients(filters: {
    page: number;
    limit: number;
  }): Observable<IRequest<IClient>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/users`, { params }) as Observable<
      IRequest<IClient>
    >;
  }

  getClient(id: number): Observable<IClient> {
    return this.http.get(`${this.apiUrl}/users/${id}`) as Observable<IClient>;
  }

  createClient(data: Partial<IClient>): Observable<IClient> {
    console.log('CHAMOU CREATE CLIENT');
    return this.http.post(`${this.apiUrl}/users`, data) as Observable<IClient>;
  }

  updateClient(id: number, data: Partial<IClient>): Observable<IClient> {
    return this.http.patch(
      `${this.apiUrl}/users/${id}`,
      data
    ) as Observable<IClient>;
  }

  deleteClient(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      responseType: 'text',
    }) as Observable<string>;
  }

  handleError(error: HttpErrorResponse, messageService: MessageService) {
    const getMessage = () => {
      if (!error) return 'Erro desconhecido';
      if (error?.error?.message) {
        return error.error.message;
      }

      if (error?.error?.rtext) {
        return error.error.text;
      }

      if (error?.error?.message && typeof error.error.message === 'object') {
        return error.error.message[0];
      }
    };

    messageService.add({
      severity: 'error',
      summary: 'Ocorreu um erro',
      detail: getMessage(),
      life: 3000,
    });
  }
}

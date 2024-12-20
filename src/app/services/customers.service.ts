import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCustomers(): Observable<any[]> {
    const token = this.authService.getToken();  // Recupera o token usando o AuthService

    // Verifica se o token existe e cria os cabeçalhos
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders();

    return this.http.get<any[]>(this.apiUrl, { headers });  // Faz a requisição GET com o cabeçalho
  }

  createCustomer(customer: any): Observable<any> {
    const token = this.authService.getToken();  // Recupera o token usando o AuthService

    // Verifica se o token existe e cria os cabeçalhos
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders();

    return this.http.post<any[]>(this.apiUrl, customer,  { headers });  // criando um cliente e passando o token
  }

  updateCustomer(cpf: string, customerData: any): Observable<any> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.put(this.apiUrl, customerData, { headers });
  }

  deleteCustomer(cpf: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Adiciona o token no cabeçalho
    const body = { cpf }; // Envia o CPF no corpo da requisição
    return this.http.delete(this.apiUrl, { headers, body });
  }
}

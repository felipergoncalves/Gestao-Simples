import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSales(): Observable<any[]> {
    const token = this.authService.getToken();  // Recupera o token usando o AuthService

    // Verifica se o token existe e cria os cabeçalhos
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders();

    return this.http.get<any[]>(this.apiUrl, { headers });  // Faz a requisição GET com o cabeçalho
  }

  createSale(saleData: any): Observable<any> {
    const token = this.authService.getToken(); // Token do usuário autenticado
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log("Data está chegando assim: ", saleData);

    return this.http.post(this.apiUrl, saleData, { headers });
  }

  getSalesByCustomerId(customerId: string): Observable<any> {
    const token = this.authService.getToken(); // Token do usuário autenticado
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/${customerId}`, { headers });
  }

  getSalesReportByCustomerId(customerId: string): Observable<any> {
    const token = this.authService.getToken(); // Token do usuário autenticado
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/report/${customerId}`, { headers });
  }

  getSalesByPeriod(startDate: string, endDate: string): Observable<any> {
    const token = this.authService.getToken(); // Token do usuário autenticado
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(
      `${this.apiUrl}/report/period`,
      { start_date: startDate, end_date: endDate },
      { headers }
    );
  }
}

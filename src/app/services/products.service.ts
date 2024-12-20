import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // getProducts(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  getProducts(): Observable<any[]> {
    const token = this.authService.getToken();  // Recupera o token usando o AuthService

    // Verifica se o token existe e cria os cabeçalhos
    const headers = token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders();

    return this.http.get<any[]>(this.apiUrl, { headers });  // Faz a requisição GET com o cabeçalho
  }

  // Função para pegar o produto pelo ID
  getProductById(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Adiciona o token no cabeçalho
    return this.http.get<any>(`${this.apiUrl}/${id}`, {headers});
  }

  // createProduct(product: any): Observable<any> {
  //   return this.http.post(this.apiUrl, product);
  // }

  createProduct(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Adiciona o token no cabeçalho
    return this.http.post(this.apiUrl, formData, {headers});
  }

  updateProduct(product: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Adiciona o token no cabeçalho
    return this.http.put(this.apiUrl, product, {headers});
  }

  deleteProduct(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Adiciona o token no cabeçalho
    return this.http.delete(`${this.apiUrl}/${id}`, {headers});
  }
}

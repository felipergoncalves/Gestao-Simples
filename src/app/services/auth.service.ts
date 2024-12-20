import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(this.apiUrl, body);
  }

  // Função para salvar o token no localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);  // Salva o token no localStorage
    // console.log("Token chegou aqui: ", token);
  }

  // Função para recuperar o token do localStorage
  getToken(): string | null {
    // console.log("Peguei o token aqui no Get: ", localStorage.getItem(this.tokenKey))
    return localStorage.getItem(this.tokenKey);  // Recupera o token do localStorage
  }

  // Função para remover o token do localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);  // Remove o token do localStorage
  }

  logout() {
    // Lógica de logout (por exemplo, limpar o token de autenticação)
    this.removeToken();
  }
}

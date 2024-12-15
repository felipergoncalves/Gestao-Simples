import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Disponível globalmente
})
export class AuthService {
  login(email: string, password: string): boolean {
    // Simulação de login
    if (email === 'teste@gmail.com' && password === 'Teste123') {
      localStorage.setItem('token', 'mock-token');
      return true;
    }
    return false;
  }
  logout() {
    // Lógica de logout (por exemplo, limpar o token de autenticação)
    localStorage.removeItem('authToken');
  }
}

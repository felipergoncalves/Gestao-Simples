import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Supondo que você tenha um serviço de autenticação

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterModule],
  standalone: true,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();  // Método para fazer logout
    this.router.navigate(['/login']);  // Redireciona para a página de login
  }
}
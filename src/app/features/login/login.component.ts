import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackMessageComponent } from '../../shared/feedback-message/feedback-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, FeedbackMessageComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isPasswordVisible = false;
  errorMessage = '';
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showFeedback('Preencha todos os campos corretamente.', 'error');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.session?.access_token) {
          console.log("Token aqui: ", response.session?.access_token)
          this.authService.setToken(response.session.access_token); // Salva o token no localStorage
          this.showFeedback('Login realizado com sucesso!', 'success');
          this.router.navigate(['/dashboard']);  // Navega para a página do dashboard após o login
        }
      },
      error: (err) => {
        this.showFeedback('Erro ao fazer login! Verifique seus dados.', 'error');
        // alert('Login inválido!');
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }

  showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;

    setTimeout(() => {
      this.feedbackMessage = '';
    }, 5000);
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  // Importando FormBuilder, FormGroup e Validators
import { Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productForm: FormGroup;  // Definindo o FormGroup
  product: any = {
    id: 1,
    name: 'Sofá',
    price: 1200.90,
    description: 'Sofá revestido em couro legítimo, com estrutura em madeira maciça e pés em metal cromado.',
    category: 'Móvel',
    image_url: 'https://via.placeholder.com/400x300' // Imagem mockada
  };
  isLoading: boolean = false;
  isModalOpen: boolean = false;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    // Inicializando o FormGroup com FormBuilder
    this.productForm = this.fb.group({
      name: [this.product.name, [Validators.required]],
      price: [this.product.price, [Validators.required]],
      stock: [this.product.stock, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      category: [this.product.category, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchProduct();
  }

  fetchProduct() {
    this.isLoading = true;
    this.http
      .get('https://back-end-projeto-web2.onrender.com/products')
      .subscribe({
        next: (response: any) => {
          this.product = response[0]; // Pega apenas o primeiro produto
          this.isLoading = false;
          this.productForm.patchValue(this.product);  // Atualiza o formulário com os dados do produto
        },
        error: (err) => {
          console.error('Erro ao carregar o produto:', err);
          this.isLoading = false;
        }
      });
  }

  saveProduct() {
    if (this.productForm.valid) {
      console.log('Produto salvo:', this.productForm.value);
      alert('Produto atualizado com sucesso!');
    } else {
      console.log('Formulário inválido');
    }
  }

  cancelEdit() {
    this.router.navigate(['/produtos']);
  }

  openConfirmModal() {
    this.isModalOpen = true;
  }

  closeConfirmModal() {
    this.isModalOpen = false;
  }

  deleteProduct() {
    console.log('Produto excluído:', this.product.id);
    this.http.delete(`https://back-end-projeto-web2.onrender.com/products/${this.product.id}`).subscribe({
      next: () => {
        alert('Produto excluído com sucesso!');
        this.router.navigate(['/produtos']);
      },
      error: () => {
        alert('Erro ao excluir o produto.');
      },
    });
  }

}

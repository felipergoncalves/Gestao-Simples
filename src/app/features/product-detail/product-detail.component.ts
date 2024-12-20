import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ProductsService } from '../../services/products.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productForm: FormGroup;
  product: any = {};  // Inicialize o produto como um objeto vazio
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  productId: number = 0;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Pegando o ID do produto na URL
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.fetchProduct();
  }

  fetchProduct() {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response: any) => {
        this.product = response;  // Atualiza o produto com os dados da API
        console.log("Produto preenchido: ", this.product[0].name);
        this.isLoading = false;

        // Preenchendo o formulário campo por campo
        this.productForm.controls['name'].setValue(this.product[0].name || '');
        this.productForm.controls['price'].setValue(this.product[0].price || '');
        this.productForm.controls['stock'].setValue(this.product[0].stock || '');
        this.productForm.controls['description'].setValue(this.product[0].description || '');

        // Caso o stock não esteja no response, inicialize com um valor padrão
        if (this.product[0].stock === undefined) {
          this.productForm.controls['stock'].setValue(0);  // Exemplo de valor padrão
        }
      },
      error: (err) => {
        console.error('Erro ao carregar o produto:', err);
        this.isLoading = false;
      },
    });
  }



  saveProduct() {
    if (this.productForm.valid) {
      // Prepara o objeto do produto com os dados do formulário
      const productData = {
        ...this.productForm.value,  // Obtém todos os dados do formulário
        id: this.product[0].id         // Inclui o ID do produto
      };

      // Chama o serviço para atualizar o produto
      this.productService.updateProduct(productData).subscribe({
        next: (response: any) => {
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
          alert('Erro ao atualizar o produto.');
        }
      });
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
    this.productService.deleteProduct(this.product[0].id).subscribe({
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

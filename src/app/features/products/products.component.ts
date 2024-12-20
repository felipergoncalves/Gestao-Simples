import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';  // Ajuste o caminho do serviço conforme necessário
import { HeaderComponent } from '../../core/header/header.component';
import { FilterComponent } from '../../filter/filter.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, FilterComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: any[] = [];
  showModal: boolean = false;
  newProduct: any = {
    name: '',
    price: null,
    stock: null,
    description: '',
    image_url: null,
    brand: '',
  };
  imagePreview: string | undefined;
  loading: boolean = false;
  filteredProducts: any[] = [];

  constructor(private productService: ProductsService) {}

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      price: null,
      stock: null,
      description: '',
      image_url: null,
      brand: '',
    };
    this.imagePreview = undefined;
  }

  onFilterChange(searchQuery: string) {
    this.loading = true;
    setTimeout(() => {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.loading = false;
    }, 500);
  }

  // Função chamada quando um arquivo é selecionado
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Gerar a pré-visualização da imagem
      this.imagePreview = URL.createObjectURL(file);
      this.newProduct.image_url = file; // Salvar o arquivo da imagem no objeto
    }
  }

  // Função para salvar o produto
  saveProduct(): void {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price);
    formData.append('stock', this.newProduct.stock);
    formData.append('description', this.newProduct.description);
    formData.append('brand', this.newProduct.brand);

    // Se uma imagem foi selecionada, anexe-a ao formData
    if (this.newProduct.image_url) {
      formData.append('image', this.newProduct.image_url, this.newProduct.image_url.name);
    }

    // Enviar os dados para o backend
    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.closeModal();  // Fechar o modal após sucesso
      },
      error: (err) => {
        console.error('Erro ao cadastrar produto:', err);
        alert('Erro ao cadastrar produto.');
      },
    });
  }
}

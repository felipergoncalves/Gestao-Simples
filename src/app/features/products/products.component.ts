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
  };
  imagePreview: string | undefined;
  loading: boolean = false;
  filteredProducts: any[] = [];
  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.fetchProducts();
  }

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
    };
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
    formData.set('name', this.newProduct.name);
    formData.set('price', this.newProduct.price.toString());
    formData.set('stock', this.newProduct.stock.toString());
    formData.set('description', this.newProduct.description);

    console.log('New Product:', this.newProduct);
    // Se uma imagem foi selecionada, anexe-a ao formData

    // Enviar os dados para o backend
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.closeModal();  // Fechar o modal após sucesso
        this.fetchProducts();
      },
      error: (err) => {
        console.error('Erro ao cadastrar produto:', err);
        alert('Erro ao cadastrar produto.');
      },
    });
  }

  fetchProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error('Erro ao buscar produtos:', err),
    });
  }
}

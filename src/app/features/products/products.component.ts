import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { FilterComponent } from '../../filter/filter.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, FilterComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;

  // Variáveis do Modal
  showModal: boolean = false;
  newProduct: any = {
    name: '',
    description: '',
    price: null,
    stock: null,
    image_url: ''
  };

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao buscar produtos:', err);
      }
    });
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      console.log('Arquivo selecionado:', file);
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
    this.imagePreview = '';
  }

  saveProduct() {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.fetchProducts();
        this.closeModal();
      },
      error: (err) => console.error('Erro ao cadastrar produto:', err)
    });
  }

  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      price: null,
      stock: null,
      image_url: ''
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { FilterComponent } from '../../filter/filter.component';
import { FormBuilder, FormArray, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../services/customers.service';
import { ProductsService } from '../../services/products.service';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [HeaderComponent, FilterComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
})
export class VendasComponent implements OnInit {
  saleForm!: FormGroup;
  clients: any[] = [];
  availableProducts: any[] = [];
  sales: any[] = [];
  filteredSales: any[] = [];
  showModal: boolean = false;
  loading: boolean = false;
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private salesService: SalesService
  ) {}

  ngOnInit() {
    this.fetchClients();
    this.fetchProducts();
    this.fetchSales();

    this.saleForm = this.fb.group({
      customer_id: [null, Validators.required],
      products: this.fb.array([]),
    });
  }

  get products(): FormArray {
    return this.saleForm.get('products') as FormArray;
  }

  addProduct() {
    this.products.push(
      this.fb.group({
        product_id: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.products.controls.reduce((sum, control) => {
      const product = this.availableProducts.find(
        (p) => p.id === control.value.product_id
      );
      return sum + (product?.price || 0) * control.value.quantity;
    }, 0);
  }

  saveSale() {
    if (this.saleForm.invalid) return;

    const saleData = {
      ...this.saleForm.value,
      total: this.total,
    };

    this.salesService.createSale(saleData).subscribe({
      next: () => {
        console.log('Venda cadastrada com sucesso!');
        this.closeModal();
      },
      error: (err) => console.error('Erro ao cadastrar venda:', err),
    });
  }

  closeModal() {
    this.saleForm.reset();
    this.products.clear();
    this.showModal = false;
    this.total = 0;
  }

  fetchClients() {
    this.customersService.getCustomers().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Erro ao buscar clientes:', err),
    });
  }

  fetchProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => (this.availableProducts = data),
      error: (err) => console.error('Erro ao buscar produtos:', err),
    });
  }

  fetchSales() {
    this.loading = true;
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.filteredSales = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao buscar vendas:', err);
      },
    });
  }

  getCustomerName(customerId: number): string {
    const customer = this.clients.find((c) => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  }

  formatSaleDate(date: any): string {
    const saleDate = new Date(date.year, date.month - 1, date.day);
    return saleDate.toLocaleDateString('pt-BR');
  }

  onFilterChange(searchQuery: string) {
    this.loading = true;
    setTimeout(() => {
      this.filteredSales = this.sales.filter((sale) =>
        sale.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.loading = false;
    }, 500);
  }

  openSaleModal() {
    this.showModal = true;
  }
}

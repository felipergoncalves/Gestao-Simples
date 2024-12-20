import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormGroupName, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { CustomersService } from '../../services/customers.service';
import { ProductsService } from '../../services/products.service';
import { HeaderComponent } from '../../core/header/header.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../filter/filter.component';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FilterComponent],
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
    private salesService: SalesService,
    private customersService: CustomersService,
    private productsService: ProductsService
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

  onProductChange(index: number) {
    const product = this.products.at(index).get('product_id')?.value;
    this.calculateTotal();  // Recalcula o total sempre que mudar
  }

  addProduct() {
    const productGroup = this.fb.group({
      product_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    // Recalcula o total sempre que o valor do produto ou quantidade mudar
    productGroup.valueChanges.subscribe(() => this.calculateTotal());

    this.products.push(productGroup);
    this.calculateTotal(); // Recalcula ao adicionar o produto
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.products.controls.reduce((sum, control) => {
      const product = this.availableProducts.find(
        (p) => p.id == control.value.product_id
      );
      const subtotal = (product?.price || 0) * control.value.quantity;
      return sum + subtotal;
    }, 0);
  }

  saveSale() {
    const customerId = this.saleForm.get('customer_id')?.value;
    if (!customerId || customerId === '') {
      console.error('Cliente não selecionado.');
      return;
    }

    if (this.products.length === 0) {
      console.error('Nenhum produto adicionado.');
      return;
    }

    if (this.total <= 0) {
      console.error('Total inválido.');
      return;
    }

    const saleData = {
      ...this.saleForm.value,
      total: this.total,
    };

    console.log('Dados enviados para o back-end:', saleData);
    this.salesService.createSale(saleData).subscribe({
      next: () => {
        alert('Venda criada com sucesso!');
        this.closeModal();
        this.fetchSales();
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
      next: (data) => {
        this.availableProducts = data;
        this.calculateTotal(); // Recalcula o total após carregar produtos
      },
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

  getCustomerName(customerId: string): string {
    const customer = this.clients.find((c) => c.cpf === customerId);
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

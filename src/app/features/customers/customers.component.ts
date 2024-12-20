import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { FilterComponent } from '../../filter/filter.component';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderComponent, FilterComponent, CommonModule, ConfirmModalComponent, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  loading: boolean = false;
  isModalOpen: boolean = false;
  showModal: boolean = false;
  editingClient: any = null;
  selectedClientId: string | null = null;
  newClient: any = {
    cpf: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  constructor(private customerService: CustomersService) {}

  ngOnInit() {
    this.fetchClients();
  }

  fetchClients() {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao buscar clientes:', err);
      }
    });
  }

  onFilterChange(searchQuery: string) {
    this.loading = true;
    setTimeout(() => {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.loading = false;
    }, 500);
  }

  openConfirmModal(client: any) {
    this.selectedClientId = client;
    this.isModalOpen = true;
  }

  closeConfirmModal() {
    this.isModalOpen = false;
    this.selectedClientId = null;
  }

  openModal() {
    this.editingClient = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  cleanDocument(cpf: string): string {
    return cpf.toString().replace(/[.\-]/g, '');
  }

  deleteCustomer() {
    if (this.selectedClientId) {
      this.customerService.deleteCustomer(this.cleanDocument(this.selectedClientId)).subscribe({
        next: () => {
          console.log('Cliente excluído com sucesso');
          this.closeConfirmModal();  // Fecha o modal
          this.fetchClients();  // Recarrega a lista de clientes
        },
        error: (err) => {
          console.error('Erro ao excluir cliente:', err);
        }
      });
    }
  }

  saveClient() {
    if (this.editingClient) {
      this.customerService.updateCustomer(this.editingClient.id, this.editingClient).subscribe({
        next: () => {
          alert('Cliente editado com sucesso!');
          this.fetchClients();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao editar cliente:', err)
      });
    } else {
      this.customerService.createCustomer(this.newClient).subscribe({
        next: () => {
          alert('Cliente cadastrado com sucesso!');
          this.fetchClients();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao cadastrar cliente:', err)
      });
    }
  }

  openEditModal(client: any) {
    this.editingClient = { ...client };
    this.showModal = true;
  }

  resetForm() {
    this.editingClient = null;
    this.newClient = {
      cpf: '',
      name: '',
      address: '',
      phone: '',
      email: ''
    };
  }
}

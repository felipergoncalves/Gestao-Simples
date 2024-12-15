import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {

}

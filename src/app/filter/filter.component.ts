import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  searchQuery: string = '';

  @Output() filterChanged = new EventEmitter<string>();

  applyFilter() {
    this.filterChanged.emit(this.searchQuery);
  }
}

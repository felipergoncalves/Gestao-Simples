import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HeaderComponent } from '../../core/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    Chart.register(...registerables); // Registra os componentes do Chart.js
    const ctx = (document.getElementById('salesChart') as HTMLCanvasElement).getContext('2d');

    new Chart(ctx!, {
      type: 'line',
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`), // Dias de 1 a 30
        datasets: [
          {
            label: 'Quantidade de Vendas',
            data: this.generateRandomData(30),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#007bff',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quantidade de Vendas' }
          },
          x: {
            title: { display: true, text: 'Dias' }
          }
        }
      }
    });
  }

  // Gera dados fictícios para o gráfico
  private generateRandomData(count: number): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
  }
}

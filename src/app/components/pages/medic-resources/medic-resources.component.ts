import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-medic-resources',
  standalone: true,
  imports: [RouterModule, CardModule, ButtonModule],
  templateUrl: './medic-resources.component.html',
  styleUrl: './medic-resources.component.css',
})
export class MedicResourcesComponent {
  cardContent: any[] = [
    { title: 'Técnicas de relajación', image: 'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png', description: 'Técnicas para combatir la ansiedad', link: 'https://www.verabelpropiedades.com'},
  { title: 'Técnicas de relajación', image: 'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png', description: 'Técnicas para combatir la ansiedad impulsadas por doctores y naturistas, con gran conocimiento en el campo', link: 'https://www.verabelpropiedades.com'}
  
  ]
}

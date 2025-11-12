import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MedicResourcesService } from '../../../shared/services/medic-resources.service';
import {
  ApiNewsResponseArticle,
  MedicResourceTable,
} from '../../../shared/interfaces/MedicResources.interface';

@Component({
  selector: 'app-medic-resources',
  standalone: true,
  imports: [RouterModule, CardModule, ButtonModule],
  templateUrl: './medic-resources.component.html',
  styleUrl: './medic-resources.component.css',
})
export class MedicResourcesComponent implements OnInit {
  constructor(private medicResourcesService: MedicResourcesService) {}
  ngOnInit() {
    this.listArticles();
  }
  nextPage!: string;
  isLoading: boolean = false;

  cardContent: MedicResourceTable[] = [
    // {
    //   title: 'Técnicas de relajación',
    //   image:
    //     'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png',
    //   description: 'Técnicas para combatir la ansiedad',
    //   link: 'https://www.verabelpropiedades.com',
    // },
    // {
    //   title: 'Técnicas de relajación',
    //   image:
    //     'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png',
    //   description:
    //     'Técnicas para combatir la ansiedad impulsadas por doctores y naturistas, con gran conocimiento en el campo',
    //   link: 'https://www.verabelpropiedades.com',
    // },
  ];

  listArticles() {
    this.isLoading = true;
    this.medicResourcesService.searchArticles().subscribe({
      next: (response) => {
        if (response.status == 'success') {
          console.log('data result', response);
          this.cardContent = response.results.map(
            (x: ApiNewsResponseArticle) => ({
              title: x.title || 'Se produjo un error',
              description: x.description || 'Se produjo un error',
              image: x.image_url,
              link: x.link,
            })
          );
          this.nextPage = response.nextPage;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener los artículos', err);
        this.isLoading = false;
      },
    });
  }

  loadMoreArticles(nextPage: string) {
    if (nextPage && !this.isLoading) {
      this.isLoading = true;
    }
    this.medicResourcesService.searchArticlesNextPages(nextPage).subscribe({
      next: (response) => {
        this.cardContent = [
          ...this.cardContent,
          ...response.results.map((x: ApiNewsResponseArticle) => ({
            title: x.title || 'Se produjo un error',
            description: x.description || 'Se produjo un error',
            image: x.image_url,
            link: x.link,
          })),
        ];
        this.nextPage = response.nextPage;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los artículos', err);
        this.isLoading = false;
      },
    });
  }
}

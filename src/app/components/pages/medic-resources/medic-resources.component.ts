import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
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
export class MedicResourcesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(private medicResourcesService: MedicResourcesService) {}
  ngOnInit() {
    this.listArticles();
  }
  nextPage!: string;
  isLoading: boolean = false;
  private observer!: IntersectionObserver;
  @ViewChild('loadMoreRef') loadMoreRef!: ElementRef;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupObserver();
    }, 100);
  }

  private setupObserver(): void {
    const scrollContainer = this.findScrollContainer(
      this.loadMoreRef.nativeElement
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('Intersection triggered:', {
          isIntersecting: target.isIntersecting,
          hasNextPage: !!this.nextPage,
          isLoading: this.isLoading,
        });

        if (target.isIntersecting && this.nextPage && !this.isLoading) {
          console.log('Loading more articles...');
          this.loadMoreArticles(this.nextPage);
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    if (this.loadMoreRef) {
      this.observer.observe(this.loadMoreRef.nativeElement);
    }
  }

  private findScrollContainer(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;

    while (parent) {
      const overflow = window.getComputedStyle(parent).overflow;
      const overflowY = window.getComputedStyle(parent).overflowY;

      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return null;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

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

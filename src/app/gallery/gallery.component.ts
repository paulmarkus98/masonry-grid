import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { UnsplashService } from '../services/unsplash.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import {animate, style} from '@angular/animations';
import { fromEvent } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements AfterViewInit {

  images: any[] = [];
  visibleImages: any[] = [];
  currentPage = 0;
  isLoading = false;
  private intersectionObserver!: IntersectionObserver;
  @ViewChild('loadingSpinner') loadingSpinner!: ElementRef;

  constructor(private unsplashService: UnsplashService) {}

  public options: NgxMasonryOptions = {
    fitWidth: true,
    gutter: 5,
    resize: true,
    animations: {
      show: [
        style({opacity: 0}),
        animate('400ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('400ms ease-in', style({opacity: 0})),
      ]
    }
  };

  ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            this.loadNextBatch();
          }
        });
      },
      {
        threshold: 1,
      }
    );
    this.intersectionObserver.observe(this.loadingSpinner.nativeElement);
    fromEvent(window, 'scroll')
      .pipe(
        debounceTime(200),
        map(() => window.scrollY),
        filter(scrollY => scrollY === 0 && this.currentPage > 0)
      )
      .subscribe(() => this.onScrollUp());
  }

  loadImages(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      console.log('Batch: ', this.currentPage);
      this.unsplashService.getImages(this.currentPage)
        .subscribe((newImages) => {
          this.images =  [...newImages, ...this.visibleImages];
          this.visibleImages = this.images.slice(0, 40);
          console.log('Images: ', this.visibleImages);
          this.isLoading = false;
        })
    }
  }

  loadNextBatch(): void {
    this.currentPage++;
    this.loadImages();
  }

  loadPreviousBatch(): void {
    this.currentPage--;
    this.loadImages();
  }

  onScrollUp(): void {
    if (window.scrollY === 0 && this.currentPage > 0) {
      this.loadPreviousBatch();
    }
  }
}

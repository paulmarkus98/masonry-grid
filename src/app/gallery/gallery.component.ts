import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { UnsplashService } from '../services/unsplash.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import {animate, style} from '@angular/animations';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements AfterViewInit {

  images: any[] = [];
  currentPage = 0;
  isLoading = false;
  batchSize = 20;
  maxImages = 2 * this.batchSize;
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
    this.loadImages();    // Initial load images
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            console.log('Loading spinner Observed!');
            this.loadNextBatch();
          }
        });
      },
      {
        threshold: 1,
      }
    );
    this.intersectionObserver.observe(this.loadingSpinner.nativeElement);
  }

  loadImages(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.unsplashService.getImages(this.currentPage)
        .subscribe((newImages) => {
          this.images = [...this.images, ...newImages];
          console.log(this.images);
          this.isLoading = false;
        })
    }
  }

  loadNextBatch(): void {
    this.currentPage++;
    console.log('CurrentPage: ', this.currentPage);
    this.loadImages();
  }

  loadPreviousBatch(): void {
    this.currentPage--;
    console.log('CurrentPage: ', this.currentPage);
    this.loadImages();
  }

  onScrollUp(): void {
    if (window.scrollY === 0 && this.currentPage > 1) {
      console.log('SCROL UP');
      this.loadPreviousBatch();
      const previousBatch = this.images.slice(this.batchSize, this.batchSize * 2);
      this.images = [...previousBatch, ...this.images];

      if (this.images.length > this.maxImages) {
        this.images = this.images.slice(0, this.maxImages);
      }
    }
  }
}

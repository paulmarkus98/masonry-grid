import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiKey = 'YlMJsQ7MUokAhNze7-Iiqa3AjMFcHKSuaaIUInkx--E';
  private apiUrl = 'https://api.unsplash.com/photos/';
  private batchSize = 20;

  constructor(private http: HttpClient) {}

  getImages(page: number): Observable<any> {
    const apiUrl = `${this.apiUrl}?client_id=${this.apiKey}&page=${page}&per_page=${this.batchSize}`;
    return this.http.get(apiUrl);
  }
}

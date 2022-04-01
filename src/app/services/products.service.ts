import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiURLProducts = environment.apiURL + 'products'
  apiURLProductsGallery = environment.apiURL + 'products/gallery-images'

  constructor(private http: HttpClient) { }

  getProducts(): Observable <Product[]> {
    return this.http.get<Product[]>(this.apiURLProducts)
  }

  getProduct(productId: string): Observable <Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`)
  }

  getProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLProducts}/get/count`).pipe(map((objectValue: any) => objectValue.productCount));
  }

  createProduct(productData: FormData): Observable <Product>{
    return this.http.post<Product>(this.apiURLProducts, productData)
  }

  updateProduct(productData: FormData, productid: string): Observable <Product>{
    return this.http.put<Product>(`${this.apiURLProducts}/${productid}`, productData)
  }

  updateProductGallery(productData: FormData, productid: string): Observable <Product>{
    return this.http.put<Product>(`${this.apiURLProductsGallery}/${productid}`, productData)
  }

  deleteProduct(productId: string): Observable <Object>{
    return this.http.delete<Object>(`${this.apiURLProducts}/${productId}`)
  }
}

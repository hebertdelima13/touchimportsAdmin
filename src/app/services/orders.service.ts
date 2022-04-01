import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  apiURLOrders = environment.apiURL + 'orders'

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders)
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`)
  }

  getOrdersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiURLOrders}/get/count`).pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiURLOrders}/get/totalsales`).pipe(map((objectValue: any) => objectValue.totalsales));
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order)
  }

  // updateOrder(orderStatus: {status: string}, orderId: string): Observable <Order>{
  //   return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus)
  // }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${order.id}`, order)
  }

  deleteOrder(orderId: string): Observable<Object> {
    return this.http.delete<Object>(`${this.apiURLOrders}/${orderId}`)
  }
}

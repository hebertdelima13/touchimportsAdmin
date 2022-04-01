import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = []
  endsubs$: Subject<boolean> = new Subject()

  constructor(private ordersService: OrdersService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this._getOrders()
  }

  ngOnDestroy() {
    this.endsubs$.next(true)
    this.endsubs$.complete()
  }

  _getOrders() {
    this.ordersService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe((orders) => {
      this.orders = orders
    })
  }

  deleteOrder(orderId: any) {
    this.ordersService
      .deleteOrder(orderId)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(
        () => {
          this._getOrders();
          this.toastr.success('Categoria atualizada com sucesso!', '', {
            progressBar: true,
            timeOut: 2000
          });
        }
      );
  }

  showOrder(orderId: any) {
    this.router.navigateByUrl(`pedidos/${orderId}`)
  }
}

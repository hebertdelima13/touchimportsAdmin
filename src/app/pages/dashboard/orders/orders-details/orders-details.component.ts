import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders.service';
import { ORDER_STATUS } from 'src/app/pages/dashboard/orders/order-constants'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {

  order: any = Order
  selectedStatus: any
  orderStatuses: any = []

  form!: FormGroup;
  isSubmitted: boolean = false
  editmode = false
  currentOrderId: string

  constructor(private formBuilder: FormBuilder, private ordersService: OrdersService, private route: ActivatedRoute, private toastr: ToastrService, private location: Location) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      status: ['', Validators.required]
    })
    this._mapOrderStatus()
    this._getOrder()
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmitted = true
    if(this.form.invalid) {
      return;
    }

    const order: Order = {
      id: this.currentOrderId,
      status: this.form.controls['status'].value
    }

    if(this.editmode) {
      this._updateOrder(order)
    } 
    
    // console.log(this.form.controls['name'].value)
    // console.log(this.form.controls['icon'].value)
  }

  private _updateOrder(order: Order) {
    this.ordersService.updateOrder(order).subscribe(res => {
      this.toastr.success('Pedido atualizado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('O pedido não pode ser atualizado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.editmode = true
        this.currentOrderId = params['id']
        this.ordersService.getOrder(params['id']).subscribe(order => {
          this.form.controls['status'].setValue(order.status)
        })
      }
    })
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key:any) => {
      return {
        name: ORDER_STATUS[key].label
      }
    })
  }

  // onStatusChange(event:any) {
  //   this.ordersService.updateOrder({status: event.value}, this.order.id).subscribe(order => {
  //     console.log(order)
  //   })
  // }

  private _getOrder() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.ordersService.getOrder(params['id']).subscribe(order => {
          this.order = order
          this.selectedStatus = order.status
        })
      }
    })
  }
}

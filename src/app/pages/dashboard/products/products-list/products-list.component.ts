import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = []
  p: number = 1;
  endsubs$: Subject<boolean> = new Subject()

  constructor(private productsService: ProductsService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this._getProducts()
  }

  ngOnDestroy() {
    this.endsubs$.next(true)
    this.endsubs$.complete()
  }

  private _getProducts() {
    this.productsService.getProducts().pipe(takeUntil(this.endsubs$)).subscribe(products => {
      this.products = products
    })
  }

  updateProduct(productid: string) {
    this.router.navigateByUrl(`produtos/form/${productid}`)
  }
  
  deleteProduct(productid: string) {
    this.productsService.deleteProduct(productid).subscribe(res => {
      this._getProducts()
      this.toastr.success('Produto deletado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
    }, (error) => {
      this.toastr.error('O produto não pode ser deletado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = []
  endsubs$: Subject<boolean> = new Subject()

  constructor(private categoriesService: CategoriesService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this._getCategories()
  }

  ngOnDestroy() {
    this.endsubs$.next(true)
    this.endsubs$.complete()
  }

  deleteCategory(categoryId: string) {
    this.categoriesService.deleteCategory(categoryId).subscribe(res => {
      this._getCategories()
      this.toastr.success('Categoria deletada com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
    }, (error) => {
      this.toastr.error('A categoria não pode ser deletada!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  updateCategory(categoryid: string) {
    this.router.navigateByUrl(`categorias/form/${categoryid}`)
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((cats) => {
      this.categories = cats
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup;
  isSubmitted: boolean = false
  editmode = false
  currentCategoryId: string
  title = 'Adicionar Categoria'
  titleButton = 'ADICIONAR'

  constructor(private formBuilder: FormBuilder, private categoriesService: CategoriesService, private toastr: ToastrService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required]
    })
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmitted = true
    if(this.form.invalid) {
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.form.controls['name'].value,
      icon: this.form.controls['icon'].value
    }

    if(this.editmode) {
      this._updateCategory(category)
    } else {
      this._addCategory(category)
    }
    
    // console.log(this.form.controls['name'].value)
    // console.log(this.form.controls['icon'].value)
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe(res => {
      this.toastr.success('Categoria adicionada com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('A categoria não pode ser adicionada!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe(res => {
      this.toastr.success('Categoria atualizada com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('A categoria não pode ser atualizada!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.editmode = true
        this.currentCategoryId = params['id']
        this.title = 'Editar Categoria'
        this.titleButton = 'EDITAR'
        this.categoriesService.getCategory(params['id']).subscribe(category => {
          this.form.controls['name'].setValue(category.name)
          this.form.controls['icon'].setValue(category.icon)
        })
      }
    })
  }
}

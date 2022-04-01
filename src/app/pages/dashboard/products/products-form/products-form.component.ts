import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {

  editmode = false
  form: FormGroup
  isSubmitted = false
  title = 'Adicionar Produto'
  titleButton = 'ADICIONAR'
  imageDisplay: any | ArrayBuffer
  imageDisplays: any | ArrayBuffer
  currentProductId: string
  categories: Category[] = []
  multipleImages: []

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private categoriesService: CategoriesService, private productsService: ProductsService, private toastr: ToastrService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._initForm()
    this._getCategories()
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmitted = true
    if(this.form.invalid) {
      return;
    }

    const productFormData = new FormData()

    Object.keys(this.form.controls).map((key) => {
      // console.log(key)
      // console.log(this.form.controls[key].value)
      productFormData.append(key, this.form.controls[key].value)
    })

    if(this.editmode) {
      this._updateProduct(productFormData)
      this._updateProductGallery(productFormData)
    } else {
      this._addProduct(productFormData)
    }

  }

  onImageUpload(event: any) {
    const file = event.target.files[0]
    if(file) {
      this.form.patchValue({image: file})
      this.form.get('image')?.updateValueAndValidity()
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file)
    }
  }

  onImageUploads(event: any) {
    const files = event.target.files
    if(event.target.files.length > 0) {
      this.multipleImages = event.target.files;
      this.form.patchValue({images: files})
      this.form.get('images')?.updateValueAndValidity()
      const fileReader = new FileReader()
      fileReader.readAsDataURL = () => {
        this.imageDisplays = fileReader.result
      }
      fileReader.readAsDataURL(files)
    }
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories
    })
  }

  private _addProduct(productData: FormData) {
    for(let img of this.multipleImages){
      productData.append('images', img);
    }
    this.productsService.createProduct(productData).subscribe(res => {
      this.toastr.success('Produto adicionado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('O produto não pode ser adicionado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      images: ['', Validators.required],
      isFeatured: [false]
    })
  }

  private _updateProduct(productFormData: FormData) {
    this.productsService.updateProduct(productFormData, this.currentProductId).subscribe(res => {
      this.toastr.success('Produto atualizado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('O produto não pode ser atualizado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _updateProductGallery(productFormData: FormData) {
    for(let img of this.multipleImages){
      productFormData.append('images', img);
    }
    this.productsService.updateProductGallery(productFormData, this.currentProductId).subscribe(res => {
      this.toastr.success('Produto atualizado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
    }, (error) => {
      this.toastr.error('O produto não pode ser atualizado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.editmode = true
        this.currentProductId = params['id']
        this.title = 'Editar Produto'
        this.titleButton = 'EDITAR'
        this.productsService.getProduct(params['id']).subscribe(product => {
          this.form.controls['name'].setValue(product.name)
          this.form.controls['category'].setValue(product.category?.id)
          this.form.controls['brand'].setValue(product.brand)
          this.form.controls['price'].setValue(product.price)
          this.form.controls['countInStock'].setValue(product.countInStock)
          this.form.controls['isFeatured'].setValue(product.isFeatured)
          this.form.controls['description'].setValue(product.description)
          this.form.controls['richDescription'].setValue(product.richDescription)
          this.imageDisplay = product.image
          this.imageDisplays= product.images
          console.log(product.images)
          this.form.controls['image'].setValidators([])
          this.form.controls['image'].updateValueAndValidity()
          this.form.controls['images'].setValidators([])
          this.form.controls['images'].updateValueAndValidity()
        })
      }
    })
  }

  // selectMultipleImage(event:any){
  //   if (event.target.files.length > 0) {
  //     this.multipleImages = event.target.files;
  //   }
  // }

  //ANGULAR TEXTEDITOR

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '100px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'no',
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: 'Poppins',
      defaultFontSize: '14px',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
};

}

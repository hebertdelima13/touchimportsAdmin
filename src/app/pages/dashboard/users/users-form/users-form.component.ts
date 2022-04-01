import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {

  form!: FormGroup;
  isSubmitted: boolean = false
  editmode = false
  currentUserId: string
  title = 'Adicionar Usuário'
  titleButton = 'ADICIONAR'

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private toastr: ToastrService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    })
    this._checkEditMode()
  }
  
  onSubmit() {
    this.isSubmitted = true
    if(this.form.invalid) {
      return;
    }

    const user: User = {
      id: this.currentUserId,
      name: this.form.controls['name'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      phone: this.form.controls['phone'].value,
      isAdmin: this.form.controls['isAdmin'].value,
      street: this.form.controls['street'].value,
      apartment: this.form.controls['apartment'].value,
      zip: this.form.controls['zip'].value,
      city: this.form.controls['city'].value,
      country: this.form.controls['country'].value
    }

    if(this.editmode) {
      this._updateUser(user)
    } else {
      this._addUser(user)
    }
    
    // console.log(this.form.controls['name'].value)
    // console.log(this.form.controls['icon'].value)
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe(res => {
      this.toastr.success('Usuário adicionado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('O usuário não pode ser adicionado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe(res => {
      this.toastr.success('Usuário atualizado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
      timer(2000).toPromise().then(done => {
        this.location.back()
      })
    }, (error) => {
      this.toastr.error('O usuário não pode ser atualizado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.editmode = true
        this.currentUserId = params['id']
        this.title = 'Editar Usuário'
        this.titleButton = 'EDITAR'
        this.usersService.getUser(params['id']).subscribe(user => {
          this.form.controls['name'].setValue(user.name)
          this.form.controls['email'].setValue(user.email)
          this.form.controls['phone'].setValue(user.phone)
          this.form.controls['isAdmin'].setValue(user.isAdmin)
          this.form.controls['street'].setValue(user.street)
          this.form.controls['apartment'].setValue(user.apartment)
          this.form.controls['zip'].setValue(user.zip)
          this.form.controls['city'].setValue(user.city)
          this.form.controls['country'].setValue(user.country)
          this.form.controls['password'].setValidators([])
          this.form.controls['password'].updateValueAndValidity()
        })
      }
    })
  }
}

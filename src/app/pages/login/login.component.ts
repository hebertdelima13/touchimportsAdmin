import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup
  isSubmitted = false
  authError = false
  authMessage = 'E-mail ou senha incorreta'

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private localstorageService: LocalstorageService, private router: Router) { }

  ngOnInit(): void {
    this._initLoginForm()
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({ 
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true

    if(this.loginFormGroup.invalid) return;

    this.auth.login(this.loginFormGroup.controls['email'].value, this.loginFormGroup.controls['password'].value).subscribe((user) => {
      this.authError = false
      this.localstorageService.setToken(user.token)
      this.router.navigate(['/'])
    }, (error: HttpErrorResponse) => {
      this.authError = true
      if(error.status !== 400) {
        this.authMessage = 'Erro no servidor, tente mais tarde!'
      }
    })
  }

}

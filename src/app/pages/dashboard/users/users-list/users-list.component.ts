import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = []
  endsubs$: Subject<boolean> = new Subject()

  constructor(private usersService: UsersService, private toastr: ToastrService, private router: Router) { }


  ngOnInit(): void {
    this._getUsers()
  }

  ngOnDestroy() {
    this.endsubs$.next(true)
    this.endsubs$.complete()
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId).subscribe(res => {
      this._getUsers()
      this.toastr.success('Usuário deletado com sucesso!', '', {
        progressBar: true,
        timeOut: 2000
      });
    }, (error) => {
      this.toastr.error('O usuário não pode ser deletado!', '', {
        progressBar: true,
        timeOut: 2000
      }) ;
    })
  }

  updateUser(userid: string) {
    this.router.navigateByUrl(`usuarios/form/${userid}`)
  }

  private _getUsers() {
    this.usersService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe(users => {
      this.users = users
    })
  }

}

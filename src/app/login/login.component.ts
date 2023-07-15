import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.apiService.jwtUserToken.subscribe(token => {
      if (token) {
        this.router.navigateByUrl('/').then();
      }
    });
  }

  login(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    const {username, password} = loginForm.value;
    this.apiService.login(username, password);
    return loginForm.reset();

  }
}
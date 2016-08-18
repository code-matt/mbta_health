import { Component, OnInit } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'signup',
  template: `
    <signup-form></signup-form>
  `
})

export class SignupPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router){
  }
  
  ngOnInit(){
    // if(this.authService.isLoggedIn){
    //   this.router.navigate(['index'])
    // }
  }
}
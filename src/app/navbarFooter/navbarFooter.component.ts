import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-navbarFooter',
  templateUrl: './navbarFooter.component.html',
  styleUrls: ['./navbarFooter.component.css']
})
export class NavbarComponentFooter implements OnInit {



  userEmail: string | null = null;
  userRol: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {


  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl,  } from '@angular/forms';
import { HttpService } from '../../sevices/http.service';
import { EApiUrls } from '../../core/enums/api-urls.enums';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
  ) {
    this.signInForm = this.fb.group({
      email : [''],
      password : [''],
    });
  }

  ngOnInit() {
  }

  onSubmitForm() {
    const controls = this.signInForm
    const user = {
      email: controls.value.email,
      password: controls.value.password
    }

    this.http.post(EApiUrls.AUTH_SIGNIN, user).subscribe((value: {token: string}) =>{
      localStorage.setItem('token', value.token);
      controls.reset()
      this.router.navigate(['/main']);
    },
    error => {
      // error - объект ошибки
    });

  }

}

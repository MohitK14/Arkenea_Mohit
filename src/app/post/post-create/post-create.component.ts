import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  postForm: FormGroup;
  submitted= false;
  showError= false;
  //emailPattern= '/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;';
  emailPattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";
  mode= "create";
  userId;
  post: Post

  constructor(private formBuilder: FormBuilder, 
              private postService: PostsService, 
              private router: Router, private  route: ActivatedRoute
              ) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    });

    this.route.paramMap.subscribe((paramMap)=>{
      if(paramMap.has('userId')){
        this.mode= "edit";
        this.userId= paramMap.get('userId');
        this.postService.getUserWitId(this.userId).subscribe(data=>{
          this.userData(data);
        });
      }
      else{
        this.mode= "create";
        this.userId= null;
      }
    })
  }

  userData(data){
    this.postForm.setValue({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email
    });
  }

  onSubmit(){
    console.log(this.postForm)
    this.showError= false;
    if(this.postForm.invalid){
      this.showError= true
      return;
    }

    const tempData={
      firstName: this.postForm.value.firstName,
      lastName: this.postForm.value.lastName,
      email: this.postForm.value.email,
      phone: this.postForm.value.phone
    }
    if(this.mode=="create"){
      console.log(this.mode);
      this.postService.addUser(tempData.firstName, tempData.lastName, tempData.email, tempData.phone);
    }
    else{
      console.log(this.mode);
      this.postService.updateUser(tempData, this.userId);
    }
    
    this.postForm.reset();
    this.router.navigate(["/users-list"]);
  }

}

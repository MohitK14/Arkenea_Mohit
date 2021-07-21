import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

const blb    = new Blob(["Lorem ipsum sit"], {type: "text/plain"});
const reader = new FileReader();

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  postForm: FormGroup;
  submitted= false;
  showError= false;
  //emailPattern= '/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;';
  emailPattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";
  mode= "create";
  userId;
  post: Post;
  imagePreview;
  emailCheckStatus: Subscription;
  emailError= false;
  isLoading = false;
  userList;
  postDataSubscription: Subscription

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
      image: new FormControl('', [Validators.required]),
    });

    this.route.paramMap.subscribe((paramMap)=>{
      if(paramMap.has('userId')){
        this.mode= "edit";
        this.userId= paramMap.get('userId');
        this.isLoading= true;
        this.postService.getUserWithId(this.userId).subscribe(data=>{
          console.log(data);
          this.isLoading= false;
          this.userData(data);
        });
      }
      else{
        this.mode= "create";
        this.userId= null;
      }
    })

    this.emailCheckStatus= this.postService.getPostsUpdateListener().subscribe(data=>{
      if(data){
        this.userList= data
      
      }
    });
    this.userListData();
  }

  userListData(){
    this.userList= this.postService.getUsers();
  }

  userData(data){
    this.postForm.setValue({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      image: data.imagePath
    });
  }

  imageEvent(event){
    const file= (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('email').updateValueAndValidity();

    const reader= new FileReader();
    reader.onload= ()=>{
      this.imagePreview= reader.result
    }
    reader.readAsDataURL(file);
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
      phone: this.postForm.value.phone,
      image: this.postForm.value.image

    }
    if(this.mode=="create"){
      let uniqueEmail= this.userList.find(x=> x.email==tempData.email);

      if(!uniqueEmail){
        this.postService.addUser(tempData.firstName, tempData.lastName, tempData.email, tempData.phone, tempData.image);
        this.navigateData();
      }
      else{
        this.emailError= true;
      }
      
    }
    else{
      
      this.postService.updateUser(tempData, this.userId);
      this.navigateData();
    }
    
  }

  navigateData(){
    setTimeout(()=>{
      this.router.navigate(["/users-list"]);
      this.postForm.reset();
    },1000)
  }

  ngOnDestroy(){
    this.emailCheckStatus.unsubscribe();
    //this.postDataSubscription.unsubscribe();
  }
}

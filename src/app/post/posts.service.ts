import { stringify } from '@angular/compiler/src/util';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators"
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as EventEmitter from 'events';

@Injectable({providedIn: 'root'})

export class PostsService{
    public posts:Post[]=[];
    public postUpdated: any= new Subject();

    constructor(private http: HttpClient){}

    getUsers(){
         
        this.http.get<{message: string, posts: any}>
        ('http://localhost:3000/api/userList')
        .pipe(map((postData)=>{
             return postData.posts.map(post=>{
                 return{
                    firstName: post.firstName,
                    lastName: post.lastName,
                    phone: post.phone,
                    email: post.email,
                    id: post._id,
                    imagePath: post.imagePath
                 }
             });
         }))
         .subscribe(transformedData=>{
            this.posts= transformedData;
            this.postUpdated.next([...this.posts])
         })
    }

    getPostsUpdateListener(){
         return this.postUpdated.asObservable();
    }

    addUser(firstName: string, lastName:string, email: string, phone: string, image:File){
        // const post: Post = {
        //     id: null, 
        //     firstName: firstName, 
        //     lastName: lastName, 
        //     email: email, 
        //     phone: phone
        // };
        const postData = new FormData();
        postData.append("firstName", firstName);
        postData.append("lastName", lastName);
        postData.append("email", email);
        postData.append("phone", phone);
        postData.append("image", image);
        
        this.http.post<{message: string, post: Post}>("http://localhost:3000/api/createUser", postData)
        .subscribe(data=>{
            console.log(data);
            const post: Post = {
                id: null, 
                firstName: firstName, 
                lastName: lastName, 
                email: email, 
                phone: phone,
                imagePath: data.post['_doc'].imagePath
            };
            // const id= data.postId;
            // post.id= id
            console.log(post);
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
        },
            error=>{
                this.postUpdated.next([false]);
            }
        );

    }

    getUserWithId(id){
         return this.http.get<{_id:string, firstName: string, lastName:String, email:string, phone:string, imagePath: string}>
         ("http://localhost:3000/api/user/"+id);
        //return {...this.posts.find(x=>x.id==id)}
    }

    updateUser(data, id){
        console.log(data);
        let userData: Post | FormData
        if(typeof(data.image==='object')){
            console.log('object')
            userData = new FormData();
            userData.append("id", id);
            userData.append("firstName", data.firstName);
            userData.append("lastName", data.lastName);
            userData.append("email", data.email);
            userData.append("phone", data.phone);
            userData.append("image", data.image);
        }
        else{
            console.log('no object')
            userData= {
                id: id, 
                firstName: data.firstName, 
                lastName: data.lastName, 
                email: data.email, 
                phone: data.phone,
                imagePath: data.image
            }        
        }
        console.log(userData);
        // const post: Post= {
        //     id: id,
        //     firstName: data?.firstName,
        //     lastName: data?.lastName,
        //     email: data?.email,
        //     phone: data?.phone,
        //     imagePath: data?.imagePath
        // };
        this.http.put("http://localhost:3000/api/user/"+id, userData)
        .subscribe((result)=>{
            console.log(result);
            const updatedPost = [...this.posts];
            const oldPostIndex= updatedPost.findIndex(x=>x.id===id);
            const post:Post={
                id: id,
                firstName: data.firstName, 
                lastName: data.lastName, 
                email: data.email, 
                phone: data.phone,
                imagePath: data.image
            }
            updatedPost[oldPostIndex]= post;
            this.posts= updatedPost;
            this.postUpdated.next([...this.posts]);
        })
    }

     deleteUser(postId: string){
         this.http.delete("http://localhost:3000/api/user/"+postId)
         .subscribe(()=>{
             const postUpdated= this.posts.filter(x=> x.id!== postId);
             this.posts= postUpdated;
             this.postUpdated.next([...this.posts]);
         })
     }
}
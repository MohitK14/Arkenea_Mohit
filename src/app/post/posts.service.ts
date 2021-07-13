import { stringify } from '@angular/compiler/src/util';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators"
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({providedIn: 'root'})

export class PostsService{
    public posts:Post[]=[];
    public postUpdated= new Subject();

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
                    id: post._id
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

    addUser(firstName: string, lastName:string, email: string, phone: number){
        const post: Post = {id: null, firstName: firstName, lastName: lastName, email: email, phone: phone};
        
        this.http.post<{message: string, postId: string}>("http://localhost:3000/api/createUser", post).subscribe(data=>{
            
            const id= data.postId;
            post.id= id
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
        });

    }

    getUserWitId(id){
         return this.http.get<{_id:string, firstName: string, lastName:String, email:string, phone:string}>
         ("http://localhost:3000/api/user/"+id);
        //return {...this.posts.find(x=>x.id==id)}
    }

    updateUser(data, id){
        console.log(data);
        const post: Post= {
            id: id,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            phone: data?.phone
        };
        this.http.put("http://localhost:3000/api/user/"+id, post)
        .subscribe((result)=>{
            console.log(result);
            const updatedPost = [...this.posts];
            const oldPostIndex= updatedPost.findIndex(x=>x.id===id);
            updatedPost[oldPostIndex]= post;
            this.posts= updatedPost;
            this.postUpdated.next([...this.posts]);
        })
    }

     deletePost(postId: string){
         this.http.delete("http://localhost:3000/api/user/"+postId)
         .subscribe(()=>{
             const postUpdated= this.posts.filter(x=> x.id!== postId);
             this.posts= postUpdated;
             this.postUpdated.next([...this.posts]);
         })
     }
}
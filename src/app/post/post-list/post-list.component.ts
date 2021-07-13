import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  postData:Post[]= [];
  postDataSubscription: Subscription;

  constructor(private postService: PostsService, private router: Router) { }

    ngOnInit() {
      this.postService.getUsers();
      this.postDataSubscription= this.postService.getPostsUpdateListener().subscribe((posts: Post[])=>{
                                  setTimeout(()=>{
                                    this.postData= posts;
                                  }, 1000)
                                  console.log(this.postData);
                                });
                                
    }

    onDelete(data){
      this.postService.deleteUser(data);
    }

    // onEdit(data){
    //   this.router.navigate(['/edit', data.id])
    //   this.post
    // }
    
    ngOnDestroy(){
      this.postDataSubscription.unsubscribe();
    }

}

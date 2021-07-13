import { NgModule } from "@angular/core";
import { RouterModule, Router } from "@angular/router";

import { PostListComponent } from "./post/post-list/post-list.component"
import { PostCreateComponent } from "./post/post-create/post-create.component"

const routes=[
    { path:'', component: PostListComponent, pathMatch: 'full'  },
    { path:'users-list', component: PostListComponent },
    { path:'create', component: PostCreateComponent },
    { path:'edit/:userId', component: PostCreateComponent },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

    export class AppRoutingModule{

    }
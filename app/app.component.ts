import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errorSubs: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {
  }

  ngOnInit() {
    this.fetchPost();
    this.errorSubs = this.postsService.error.
                  subscribe(errorMessage=>{
                                            this.isFetching = false;
                                            this.error=errorMessage as any
                                          });
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title,postData.content)
                .subscribe(x=>{
                                this.loadedPosts.push({title:postData.title,content:postData.content});                                
                              },
                          e=>{
                              this.postsService.error.next(e.message);
                          });
  }

  onFetchPosts() {
    this.fetchPost();
  }

  private fetchPost(){
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts = posts;
    },error=>
    {   
        this.isFetching = false;
        this.error = error.message;
    });
  }

  onClearPosts() {
    this.postsService.deleteAllPosts().subscribe(x=>{this.loadedPosts = [];});;
  }

  onHandleError(){
    this.error= null;
  }

  ngOnDestroy(): void {
    this.errorSubs.unsubscribe();
  }
}

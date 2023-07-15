import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TodoComponent } from '../todo/todo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  todos: any = [];
  movies: any = []
  LikedMovies: any = []
  filteredTodos: any[] = [];
  filteredMovies: any[] = []
  filteredLikedMovies: any[] = []

  constructor(private apiService: ApiService,
              private dialog: MatDialog,
              private toast: ToastrService
              ) {
  }

  ngOnInit(): void {
    // this.apiService.getAllTodos().subscribe((todos) => {
    //   this.todos = todos;
    //   this.filteredTodos = this.todos;
    // });
    this.apiService.getAllMovies().subscribe((movies) => {
      this.movies = movies;
      this.filteredMovies = this.movies.results;
      
    });
    
    this.apiService.getAllLikedMovies().subscribe((LikedMovies) => {
      this.LikedMovies = LikedMovies;
      this.filteredLikedMovies = this.LikedMovies;
      
    });
    
  }

  // tslint:disable-next-line:typedef
  // filterChanged(ev: MatSelectChange) {
  //   const value = ev.value;
  //   this.filteredTodos = this.todos;
  //   if (value) {
  //     this.filteredTodos = this.filteredTodos.filter(t => t.status === value);
  //     console.log(this.filteredTodos);
  //   } else {
  //     this.filteredTodos = this.todos;
  //   }
  // }

  filterChangedMovies(ev: MatSelectChange) {
    const value = ev.value;
    this.filteredLikedMovies = this.LikedMovies;
    if (value) {
      this.filteredMovies = this.filteredLikedMovies.filter(t => t.vote_count != true);
      
      
    } else {
      this.filteredMovies = this.movies.results;
      this.ngOnInit()
    }
    
  }

  // tslint:disable-next-line:typedef
  openDialog() {
    const dialogRef = this.dialog.open(TodoComponent, {
      width: '500px',
      hasBackdrop: true,
      role: 'dialog',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      // this.apiService.createTodo(data.title, data.description).subscribe((result: any) => {
      //   console.log(result);
      //   this.todos.push(result);
      //   this.filteredTodos = this.todos;
      // });
    });
  }

  // tslint:disable-next-line:typedef
  statusChanged(ev: MatSelectChange, todoId: number, index: number) {
    const value = ev.value;
    // this.apiService.updateStatus(value, todoId).subscribe(todo => {
    //   this.todos[index] = todo;
    //   this.filteredTodos = this.todos;
    // });
  }

  like(id: string, original_language: string, original_title: string, overview: string, title: string, vote_average: number, vote_count: number , poster_path: string) {
    if (confirm('Do you want to like this Movie?')) {
      this.apiService.likeMovie(id, original_language, original_title, overview, title, vote_average, vote_count , poster_path).subscribe(res => {

        // @ts-ignore
        // if (res.success) {
        //   this.todos = this.todos.filter((t: any) => t.id !== id);
        //   this.filteredTodos = this.todos;
        // }
        this.toast.success('Movie Liked', '', {
          timeOut: 700,
          positionClass: 'toast-top-center'
        })
      });
    }
  }

  // tslint:disable-next-line:typedef
  delete(id: number) {
    if (confirm('Do you want to remove the Todo?')) {
      // this.apiService.deleteTodo(id).subscribe(res => {

      //   // @ts-ignore
      //   if (res.success) {
      //     this.todos = this.todos.filter((t: any) => t.id !== id);
      //     this.filteredTodos = this.todos;
      //   }
      // });
    }
  }
}

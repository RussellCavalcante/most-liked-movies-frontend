import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token = '';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:3000';
  private Movies_api = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'
  private token_movie_api = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmVmMTU5NGRmMjljNzJkNmRhYWM1YTNjYTQ3YzUxYiIsInN1YiI6IjY0YjA5MGJiZDIzNmU2MDBjNTg2OGVmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGc3pP_CwXSFtKNE9s6svzaIxkXrkZSi3sOMpvZsv9o';

  constructor(private http: HttpClient,
              private router: Router,
              private toast: ToastrService) {
    const fetchedToken = localStorage.getItem('act');

    if (fetchedToken) {
      this.token = atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }

  }

  get jwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  
  getAllMovies(): Observable<any> {
    return this.http.get(`${this.Movies_api}`, {
      headers: {
        Authorization: `Bearer ${this.token_movie_api}`
      }
    });
  }
  /* Getting All Todos */
  getAllTodos(): Observable<any> {
    return this.http.get(`${this.API_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getAllLikedMovies(): Observable<any> {
    return this.http.get(`${this.API_URL}/movies`, {
      headers: {
        Authorization: `${this.token}`
      }
    });
  }

  login(email: string, password: string) {

    this.http.post(`${this.API_URL}/auth`, {email, password})
      // @ts-ignore
      .subscribe((res: { acessToken: string }) => {
        this.token = res.acessToken;

        if (this.token) {
          this.toast.success('Login successful, redirecting now...', '', {
            timeOut: 700,
            positionClass: 'toast-top-center'
          }).onHidden.toPromise().then(() => {
            this.jwtToken$.next(this.token);
            localStorage.setItem('act', btoa(this.token));
            this.router.navigateByUrl('/').then();
          });
        }
      }, (err: HttpErrorResponse) => {
        this.toast.error('Authentication failed, try again', '', {
          timeOut: 1000
        });
      });
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.token = '';
    this.jwtToken$.next(this.token);
    this.toast.success('Logged out succesfully', '', {
      timeOut: 500
    }).onHidden.subscribe(() => {
      localStorage.removeItem('act');
      this.router.navigateByUrl('/login').then();
    });
    return '';
  }

  register(name: string, password: string, phone: number, email: string, cpf: string, typeUser: number) {

    return this.http.post(`${this.API_URL}/user`, {name, password, phone, email, cpf, typeUser})
  }

  // tslint:disable-next-line:typedef

  likeMovie(id_movie: string, original_language: string, original_title: string, overview: string, title: string, vote_average: number, vote_count: number , poster_path: string) {
    return this.http.post(`${this.API_URL}/movies`, {id_movie, original_language, original_title, overview, title, vote_average, vote_count , poster_path}, {
      headers: {
        Authorization: `${this.token}`
      }
    });
  }

  createTodo(title: string, description: string) {
    return this.http.post(`${this.API_URL}/todos`, {title, description}, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  // tslint:disable-next-line:typedef
  updateStatus(statusValue: string, todoId: number) {
    return this.http.patch(`${this.API_URL}/todos/${todoId}`, {status: statusValue}, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(
      tap(res => {
        if (res) {
          this.toast.success('Status updated successfully', '', {
            timeOut: 1000
          });
        }
      })
    );
  }

  deleteTodo(todoId: number) {
    return this.http.delete(`${this.API_URL}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(
      tap(res => {
        // @ts-ignore
        if (res.success) {
          this.toast.success('Todo deleted successfully');
        }
      })
    );
  }
}

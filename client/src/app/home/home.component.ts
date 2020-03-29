import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf, fromEvent, Subject, throwError} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieComponent } from '../movie/movie.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GenreService } from '../genre.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'imdb_score', 'genre', 'director', '99popularity'];
  exampleDatabase: ExampleHttpDatabase | null;
  resultsLength = 0;
  isLoadingResults = true;
  search = '';
  isLoggedIn:boolean = false;
  movieSource = new MatTableDataSource<any>([]);

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  genreCtrl = new FormControl();
  filteredGenres: Observable<string[]>;
  genres: string[] = [];
  allGenres: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  clickStream = new Subject();

  constructor(
    private _httpClient: HttpClient,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private genre: GenreService,
  ) {
    this.filteredGenres = this.genreCtrl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => genre ? this._filter(genre) : this.allGenres.slice()));
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.clickStream)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.search,
            this.genres.join(',')
            );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.movies;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.movieSource.data = data);
  }

  ngOnInit(): void {
    this.auth.isAuthenticated.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      if (this.isLoggedIn) {
        this.displayedColumns.push('actions')
      } else {
        this.displayedColumns = this.displayedColumns
          .filter(x => x !== 'actions')
      }
    });

    this.genre.fetchList()
      .subscribe((data: any)  => {
        this.allGenres = data;
        this.genreCtrl.setValue('');
      });
  }

  createUpdateMovie(row) {
    const dialogRef = this.dialog.open(MovieComponent, {
      data: row || {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (row._id && result) {
        row.name = result.name;
        row.director = result.director;
        row.imdb_score.$numberDecimal = result.imdb_score;
        row['99popularity'].$numberDecimal = result['99popularity'];
        row.genre = result.genre.slice();

        this.showError('Movie details updated.');
      }
    }); 
  }

  removeMovie(row, index) {  
    this._httpClient.delete(`http://localhost:5000/api/movies/${row._id}`)
      .pipe(
        map(res => res),
        catchError((err) => throwError(err))
      )
      .subscribe(
        () => {
          this.movieSource.data.splice(index, 1);
          this.movieSource._updateChangeSubscription();
          this.showError('Movie deleted successfully');
        },
        (err) => this.showError('Something went wrong')
        );
  }

  showError(msg) {
    this.snackBar.open(msg, null, {
      duration: 2000,
    });
  }


  // filter
  selected(event: MatAutocompleteSelectedEvent): void {
    this.genres.push(event.option.viewValue);
    this.genreInput.nativeElement.value = '';
    this.genreCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGenres.filter(genre => genre.toLowerCase().indexOf(filterValue) === 0);
  }

  remove(genre: string): void {
    const index = this.genres.indexOf(genre);

    if (index >= 0) {
      this.genres.splice(index, 1);
    }
  }
}

export class ExampleHttpDatabase {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(
    sort: string, order: string, page: number, search: string, genre: string
  ): Observable<any> {
    const href = 'http://localhost:5000/api/movies';
    const requestUrl =
        `${href}?search=${search}&genre=${genre}&sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<any>(requestUrl, {
      headers: this.headers.append('ignoreAuthModule', 'true'),
    });
  }
}
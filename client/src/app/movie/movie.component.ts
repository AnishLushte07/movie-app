import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GenreService } from '../genre.service';
import { Observable, of, throwError } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { startWith, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})

export class MovieComponent implements OnInit {
  movie: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  genreCtrl = new FormControl();
  filteredGenres: Observable<string[]>;
  genres: string[] = [];
  allGenres: string[] = [];
  newGenres = [];
  isEdit = false;
  type = 'Add';

  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private dialogRef: MatDialogRef<MovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genre: GenreService,
    private http: HttpClient,
  ) {
    this.data = this.data || {};
    this.isEdit = !!this.data._id;
    this.movie = new FormGroup({
      name: new FormControl({ value: null, disabled: this.isEdit }, [Validators.required]),
      director: new FormControl(null, [Validators.required]),
      imdb_score: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]),
      '99popularity': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]),
      genre: new FormControl(null, [])
    });

    this.filteredGenres = this.genreCtrl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => genre ? this._filter(genre) : this.allGenres.slice()));
  }

  ngOnInit(): void {
    this.genres = this.data.genre || [];
    this.genre.fetchList()
      .subscribe((data: any) => {
        this.allGenres = data;
        this.genreCtrl.setValue('');
      });

    if (this.isEdit) {
      this.type = 'Edit';
      this.movie.patchValue({
        name: this.data.name,
        director: this.data.director,
        imdb_score: this.data.imdb_score.$numberDecimal,
        '99popularity': this.data['99popularity'].$numberDecimal,
        genre: this.data.genre,
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const lValue = value.trim().toLowerCase();
      const exist = this.allGenres.some(genre => genre.toLowerCase() === lValue);
      if (!exist) {
        this.genres.push(value.trim());
        this.newGenres.push(value.trim());
      }
    }

    if (input) {
      input.value = '';
    }

    this.genreCtrl.setValue(null);
  }

  remove(genre: string): void {
    const index = this.genres.indexOf(genre);
    const newIndex = this.newGenres.indexOf(genre);

    if (index >= 0) {
      this.genres.splice(index, 1);
      this.newGenres.splice(newIndex, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    const lValue = value.toLowerCase();
    const exist = this.genres.some(genre => genre.toLowerCase() === lValue);
    if (!exist) {
      this.genres.push(value);
    }
    this.genreInput.nativeElement.value = '';
    this.genreCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGenres.filter(genre => genre.toLowerCase().indexOf(filterValue) === 0);
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.genres.length) return;

    this.movie.patchValue({ genre: this.genres });
    const method = this.isEdit ? 'put' : 'post';
    let url = 'api/movies';

    if (this.isEdit) url = `${url}/${this.data._id}`;

    this.http[method](url, {
      ...this.movie.value,
      new_genres: this.newGenres,
    })
      .pipe(
        map(res => res),
        catchError((err) => throwError(err))
      )
      .subscribe(
        () => {
          if (this.newGenres) this.genre.updateGenres(this.newGenres);
          this.dialogRef.close(this.movie.value);
        },
        (err) => console.log(err)
      );
  }
}

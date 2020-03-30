import { NgModule } from '@angular/core';

// Navigation

// import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

// Buttons & Indicators

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Layout

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';

import {
    MatFormFieldModule,
} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'

@NgModule({
  imports: [
    MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    MatToolbarModule, MatDividerModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule, MatAutocompleteModule, MatChipsModule, MatSnackBarModule,
    MatMenuModule
    
  ],
  exports: [
    MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    MatToolbarModule, MatDividerModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule, MatTableModule, MatPaginatorModule,
    MatDialogModule, MatAutocompleteModule, MatChipsModule, MatSnackBarModule,
    MatMenuModule
  ],
})

export class AngularMaterialModule { }
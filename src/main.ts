import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { GridComponent } from './app/components/grid/grid.component';
import { provideRouter } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule),
        provideAnimations(),
        provideRouter([
            { path: 'visualizer', component: GridComponent },
            { path: '', redirectTo: '/visualizer', pathMatch: 'full' },
        ])
    ]
})
  .catch(err => console.error(err));

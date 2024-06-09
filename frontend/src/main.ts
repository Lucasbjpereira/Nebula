import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './app/home/home.component';

bootstrapApplication(HomeComponent, {
  providers: [importProvidersFrom(HttpClientModule)]
})
  .catch(err => console.error(err));

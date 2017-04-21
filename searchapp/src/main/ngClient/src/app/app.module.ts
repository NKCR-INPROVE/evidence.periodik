import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { RouterModule }   from '@angular/router';

import {Store, StoreModule} from "@ngrx/store";
import {SearchReducer} from "./reducers/search.reducer";

import { BsDropdownModule } from 'ng2-bootstrap';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { AppState } from './app.state';
import { AppService } from './services/app.service';
import { SearchService } from './services/search.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OCasopisuComponent } from './components/o-casopisu/o-casopisu.component';
import { PokynyComponent } from './components/pokyny/pokyny.component';
import { ArchivComponent } from './components/archiv/archiv.component';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { FreeTextComponent } from './components/free-text/free-text.component';
import { JournalDetailsComponent } from './components/journal-details/journal-details.component';
import { ArticleResultComponent } from './components/article-result/article-result.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ArticleViewerComponent } from './components/article-viewer/article-viewer.component';
import { ArchivItemComponent } from './components/archiv-item/archiv-item.component';



//const storeManager = StoreModule.provideStore({ currentSearch: SearchReducer });

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    OCasopisuComponent,
    PokynyComponent,
    ArchivComponent,
    SearchComponent,
    HomeComponent,
    FreeTextComponent,
    JournalDetailsComponent,
    ArticleResultComponent,
    BreadcrumbsComponent,
    ArticleViewerComponent,
    PdfViewerComponent,
    ArchivItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    SlimLoadingBarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [Http]
            }
        }),
    //StoreModule, storeManager,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'archiv', component: ArchivComponent },
      { path: 'pro-autory', component: PokynyComponent ,
      children:[
        { path: '', component: FreeTextComponent},
        { path: '**', component: FreeTextComponent}
        
      ]},
      { path: 'o-casopisu', component: OCasopisuComponent,
      children:[
        { path: '', component: FreeTextComponent},
        { path: '**', component: FreeTextComponent}
        
      ]},
      { path: 'kontakt', component: FreeTextComponent },
      { path: 'e-shop', component: FreeTextComponent },
      { path: 'hledat', component: SearchComponent },
      { path: 'article/:pid', component: ArticleViewerComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ])
  ],
  providers: [AppState, AppService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { RouterModule }   from '@angular/router';

import { BsDropdownModule, ModalModule, CollapseModule, TypeaheadModule, TooltipModule, AlertModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NouisliderModule } from 'ng2-nouislider';

import { FileUploadModule } from 'ng2-file-upload';

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
import { ArchivItemLeftComponent } from './components/archiv-item-left/archiv-item-left.component';
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component';
import { SearchTabsComponent } from './components/search-tabs/search-tabs.component';
import { SearchAuthorsComponent } from './components/search-authors/search-authors.component';
import { SearchGenresComponent } from './components/search-genres/search-genres.component';
import { SearchKeywordsComponent } from './components/search-keywords/search-keywords.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ArticleInfoComponent } from './components/article-info/article-info.component';
import { ActualComponent } from './components/actual/actual.component';
import { FreePageComponent } from './components/free-page/free-page.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from "./services/auth-guard";
import { SafeHtmlPipe } from './services/safe-html.pipe';
import { TestComponent } from './components/test/test.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
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
    ArchivItemComponent,
    ArchivItemLeftComponent,
    SearchCriteriaComponent,
    SearchTabsComponent,
    SearchAuthorsComponent,
    SearchGenresComponent,
    SearchKeywordsComponent,
    PaginationComponent,
    ArticleInfoComponent,
    ActualComponent,
    FreePageComponent,
    LoginComponent,
    AdminComponent,
    SafeHtmlPipe,
    TestComponent
  ],
  imports: [
    BrowserModule,
    //FormsModule,
    HttpClientModule,
    NouisliderModule,
    PdfViewerModule,
    BsDropdownModule.forRoot(), ModalModule.forRoot(), CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
  FileUploadModule,
    
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    //StoreModule, storeManager,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'test', component: TestComponent },
      { path: 'actual', component: ActualComponent },
      { path: 'archiv', component: ArchivComponent },
      //{ path: 'archiv/:pid', component: ArchivComponent },
      { path: 'pro-autory', component: PokynyComponent ,
      children:[
        { path: '', component: FreePageComponent},
        { path: '**', component: FreePageComponent}
        
      ]},
      { path: 'o-casopisu', component: OCasopisuComponent,
      children:[
        { path: '', component: FreePageComponent},
        { path: '**', component: FreePageComponent}
        
      ]},
      { path: 'kontakt', component: FreePageComponent },
      { path: 'e-shop', component: FreePageComponent },
      { path: 'hledat', component: SearchComponent,
      children:[
        { path: '', redirectTo: 'cokoliv', pathMatch: 'full'},
        { path: 'cokoliv', component: SearchCriteriaComponent},
        { path: 'cokoliv/:criteria', component: SearchCriteriaComponent },
        { path: 'autory', component: SearchAuthorsComponent},
        { path: 'keywords', component: SearchKeywordsComponent},
        { path: 'rubriky', component: SearchGenresComponent}
        
      ]},
      { path: 'article/:pid', component: ArticleViewerComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'prihlaseni', component: LoginComponent },
      { path: 'admin', 
        canActivate: [AuthGuard],component: AdminComponent },
    ])
  ],
  providers: [AppState, AppService, SearchService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

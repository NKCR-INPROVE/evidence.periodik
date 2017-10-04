import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MaterializeModule } from 'ng2-materialize'; // _app

import { AppComponent } from './app.component';
import { SeznamCasopisuComponent } from './components/seznam-casopisu/seznam-casopisu.component';
import { OProjektuComponent } from './components/o-projektu/o-projektu.component';
import { VydavateleComponent } from './components/vydavatele/vydavatele.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FacetsComponent } from './components/facets/facets.component';
import { SeznamItemComponent } from './components/seznam-casopisu/seznam-item/seznam-item.component';
import { SortBarComponent } from './components/seznam-casopisu/sort-bar/sort-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SeznamCasopisuComponent,
    OProjektuComponent,
    VydavateleComponent,
    KontaktComponent,
    HeaderComponent,
    FooterComponent,
    FacetsComponent,
    SeznamItemComponent,
    SortBarComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule.forRoot(), // _app
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: 'seznam-casopisu', component: SeznamCasopisuComponent },
      { path: 'o-projektu', component: OProjektuComponent },
      { path: 'vydavatele', component: VydavateleComponent },
      { path: 'kontakt', component: KontaktComponent },
      { path: '', redirectTo: 'seznam-casopisu', pathMatch: 'full' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

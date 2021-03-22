import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HeaderComponent} from './header/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { FormComponent } from './body/form/form.component';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmEmailComponent } from './body/confirm-email/confirm-email.component'
import {ErrorInterceptor} from './error-interceptor'
import { ErrorComponent } from './error/error.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import {FooterComponent} from './footer/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PubgsplitplayersComponent } from './splitplayers/pubgsplitplayers.component';
import {FreeadComponent} from './body/form/freead/freead.component';
import {LoginadminComponent} from './body/form/loginadmin/loginadmin.component';
import { SoloreportthehackerComponent } from './body/form/soloreportthehacker/soloreportthehacker.component';
import { RegisterduopubgComponent } from './body/form/registerduopubg/registerduopubg.component';
import { RegistersquadpubgComponent } from './body/form/registersquadpubg/registersquadpubg.component';
import { RegistersquadpubgmemberComponent } from './body/form/registersquadpubgmember/registersquadpubgmember.component';
import { RegisterduopubgmemberComponent } from './body/form/registerduopubgmember/registerduopubgmember.component';
import { DuopubgComponent } from './splitplayers/duopubg/duopubg.component';
import { SquadpubgComponent } from './splitplayers/squadpubg/squadpubg.component';
import { DuoreportthehackerComponent } from './body/form/duoreportthehacker/duoreportthehacker.component';
import { SquadreportthehackerComponent } from './body/form/squadreportthehacker/squadreportthehacker.component';
import { PaidadComponent } from './body/form/paidad/paidad.component';
import { SiteadmincontrolComponent } from './siteadmincontrol/siteadmincontrol.component';
import { FreeAdDuoPubgComponent } from './body/form/free-ad-duo-pubg/free-ad-duo-pubg.component';
import { FreeAdSquadPubgComponent } from './body/form/free-ad-squad-pubg/free-ad-squad-pubg.component';
import { FreeAdConfirmEmailComponent } from './body/confirm-email/free-ad-confirm-email/free-ad-confirm-email.component';
import { DuoteamleaderComponent } from './body/confirm-email/duoteamleader/duoteamleader.component';
import { DuomemberComponent } from './body/confirm-email/duomember/duomember.component';
import { SquadteamleaderComponent } from './body/confirm-email/squadteamleader/squadteamleader.component';
import { SquadmemberComponent } from './body/confirm-email/squadmember/squadmember.component';
import { FreeAdDuoConfirmEmailComponent } from './body/confirm-email/free-ad-duo-confirm-email/free-ad-duo-confirm-email.component';
import { FreeAdSquadConfirmEmailComponent } from './body/confirm-email/free-ad-squad-confirm-email/free-ad-squad-confirm-email.component';
import { SolohackerComponent } from './body/confirm-email/solohacker/solohacker.component';
import { DuohackerComponent } from './body/confirm-email/duohacker/duohacker.component';
import { SquadhackerComponent } from './body/confirm-email/squadhacker/squadhacker.component';
import {AuthInterceptor} from './body/auth-interceptor';
import {AdminsolopubgComponent} from './siteadmincontrol/adminsolopubg/adminsolopubg.component'
import {AdminduopubgComponent} from './siteadmincontrol/adminduopubg/adminduopubg.component'
import {AdminsquadpubgComponent} from './siteadmincontrol/adminsquadpubg/adminsquadpubg.component';
import { AdminpaidadsComponent } from './siteadmincontrol/adminpaidads/adminpaidads.component'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    ConfirmEmailComponent,
    ErrorComponent,
    FooterComponent,
    HomeComponent,
    PubgsplitplayersComponent,
    FreeadComponent,
    LoginadminComponent,
    SoloreportthehackerComponent,
    RegisterduopubgComponent,
    RegistersquadpubgComponent,
    RegistersquadpubgmemberComponent,
    RegisterduopubgmemberComponent,
    DuopubgComponent,
    SquadpubgComponent,
    DuoreportthehackerComponent,
    SquadreportthehackerComponent,
    PaidadComponent,
    SiteadmincontrolComponent,
    FreeAdDuoPubgComponent,
    FreeAdSquadPubgComponent,
    FreeAdConfirmEmailComponent,
    DuoteamleaderComponent,
    DuomemberComponent,
    SquadteamleaderComponent,
    SquadmemberComponent,
    FreeAdDuoConfirmEmailComponent,
    FreeAdSquadConfirmEmailComponent,
    SolohackerComponent,
    DuohackerComponent,
    SquadhackerComponent,
    AdminsolopubgComponent,
    AdminduopubgComponent,
    AdminsquadpubgComponent,
    AdminpaidadsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    FlexLayoutModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS , useClass: AuthInterceptor, multi:true},
    {provide:HTTP_INTERCEPTORS , useClass:ErrorInterceptor , multi:true}
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }

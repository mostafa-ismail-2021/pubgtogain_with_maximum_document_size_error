import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import {FormComponent} from './body/form/form.component';
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
import { ConfirmEmailComponent } from './body/confirm-email/confirm-email.component'
import { FreeAdDuoPubgComponent } from './body/form/free-ad-duo-pubg/free-ad-duo-pubg.component';
import { FreeAdSquadPubgComponent } from './body/form/free-ad-squad-pubg/free-ad-squad-pubg.component';
import { SiteadmincontrolComponent } from './siteadmincontrol/siteadmincontrol.component';
import { FreeAdConfirmEmailComponent } from './body/confirm-email/free-ad-confirm-email/free-ad-confirm-email.component';
import {DuoteamleaderComponent} from './body/confirm-email/duoteamleader/duoteamleader.component'
import { DuomemberComponent } from './body/confirm-email/duomember/duomember.component';
import { SquadteamleaderComponent } from './body/confirm-email/squadteamleader/squadteamleader.component';
import { SquadmemberComponent } from './body/confirm-email/squadmember/squadmember.component';
import { FreeAdDuoConfirmEmailComponent } from './body/confirm-email/free-ad-duo-confirm-email/free-ad-duo-confirm-email.component';
import { FreeAdSquadConfirmEmailComponent } from './body/confirm-email/free-ad-squad-confirm-email/free-ad-squad-confirm-email.component';
import { SolohackerComponent } from './body/confirm-email/solohacker/solohacker.component';
import { DuohackerComponent } from './body/confirm-email/duohacker/duohacker.component';
import { SquadhackerComponent } from './body/confirm-email/squadhacker/squadhacker.component';
import {AuthGuard} from './body/auth.guard';
import {AdminsolopubgComponent} from './siteadmincontrol/adminsolopubg/adminsolopubg.component'
import {AdminduopubgComponent} from './siteadmincontrol/adminduopubg/adminduopubg.component'
import {AdminsquadpubgComponent} from './siteadmincontrol/adminsquadpubg/adminsquadpubg.component'
import { AdminpaidadsComponent } from './siteadmincontrol/adminpaidads/adminpaidads.component'


const routes: Routes = [
  { path: 'register/solopubg', component: FormComponent },
  { path: 'playerdate/solopubg', component: PubgsplitplayersComponent },
  { path: 'hacker/solopubg', component: SoloreportthehackerComponent },
  { path: 'register/freeadsolopubg', component: FreeadComponent },
  { path: 'register/soloconfirmEmail', component: ConfirmEmailComponent },
  { path: 'register/soloconfirmEmailFreeAd', component: FreeAdConfirmEmailComponent },
  { path: 'register/soloconfirmEmailHacker', component: SolohackerComponent },

  { path: 'register/duopubgteamleader', component: RegisterduopubgComponent },
  { path: 'register/duopubgmember', component: RegisterduopubgmemberComponent },
  { path: 'playerdate/duopubg', component: DuopubgComponent },
  { path: 'hacker/duopubg', component: DuoreportthehackerComponent },
  { path: 'register/freeadduopubg', component: FreeAdDuoPubgComponent },
  { path: 'register/duoteamleaderconfirmEmail', component: DuoteamleaderComponent },
  { path: 'register/duomemberconfirmEmail', component: DuomemberComponent },
  { path: 'register/duoconfirmEmailFreeAd', component: FreeAdDuoConfirmEmailComponent },
  { path: 'register/duoconfirmEmailHacker', component: DuohackerComponent },
  
  { path: 'register/Squadpubgteamleader', component: RegistersquadpubgComponent },
  { path: 'register/Squadpubgmember', component: RegistersquadpubgmemberComponent },
  { path: 'playerdate/Squadpubg', component: SquadpubgComponent },
  { path: 'hacker/Squadpubg', component: SquadreportthehackerComponent },
  { path: 'register/freeadsquadpubg', component: FreeAdSquadPubgComponent },
  { path: 'register/squadteamleaderconfirmEmail', component: SquadteamleaderComponent },
  { path: 'register/squadmemberconfirmEmail', component: SquadmemberComponent },
  { path: 'register/squadconfirmEmailFreeAd', component: FreeAdSquadConfirmEmailComponent },
  { path: 'register/squadconfirmEmailHacker', component: SquadhackerComponent },

  { path: 'admincontrol', component: SiteadmincontrolComponent ,canActivate : [AuthGuard]},
  { path: 'solo/admincontrol', component: AdminsolopubgComponent ,canActivate : [AuthGuard]},
  { path: 'duo/admincontrol', component: AdminduopubgComponent ,canActivate : [AuthGuard]},
  { path: 'squad/admincontrol', component: AdminsquadpubgComponent ,canActivate : [AuthGuard]},
  { path: 'paidads/admincontrol', component: AdminpaidadsComponent ,canActivate : [AuthGuard]},

  { path: 'register/paidad', component: PaidadComponent },
  { path: 'loginadmin', component: LoginadminComponent},
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }

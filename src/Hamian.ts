import {
  Authenticator, ButtonStyle, Chain,
   User
} from 'universal-authenticator-library'
import {HamianConfig} from 'hamian';
import Hamian from 'hamian'
import { UALHamianUser } from './HamianUser';
import { Name } from './interfaces'
import {HamianLogo} from './HamianLogo'
export class UALHamianOption{
  appId:string='';
}
export class UalHamian extends Authenticator {
  hamian!:Hamian;
  users:UALHamianUser[]=[];
  config:HamianConfig;
  constructor(chains: Chain[],config:HamianConfig)
  {
    super(chains);
    this.config=config;
  }
  async init(): Promise<void> { 
    this.hamian=new Hamian(this.config.appId,this.config.serverUrl,this.config.botName);
    var profile = this.hamian.getprofile();
    if(profile)
    {
      this.users=[new UALHamianUser(profile)]
    }
    return;
  }
  reset(): void {
    this.users=[];
  }
  isErrored(): boolean {
    return false;
  }
  getOnboardingLink(): string {
    return 'https://telegram.org/apps'
  }
  getError(): any {
    return null;
  }
  isLoading(): boolean {
    return false;
  }
  getStyle(): ButtonStyle {
    return {
      icon: HamianLogo,
      text: Name,
      textColor: 'white',
      background: '#3650A2'
    }
  }
  shouldRender(): boolean {
    return !this.isLoading()
  }
  shouldAutoLogin(): boolean {
    return true;
  }
  async shouldRequestAccountName(): Promise<boolean> {
    return false;
  }
  login(accountName?: string): Promise<User[]> {
    console.log('accountName',accountName)
    return new Promise((res,rej)=>{
      this.hamian.login().then(( )=>{
        var user=this.hamian.getprofile();
        if(!user)
          return rej()
        res([new UALHamianUser(user)])
      })
      .catch((exp:any)=>{
        rej(exp)
      })
    });
  }
  async logout(): Promise<void> {
    this.hamian.logout();
    return;
  }
  requiresGetKeyConfirmation(): boolean {
    return false
  }
  getName(): string {
    return 'hamian';
  }
}
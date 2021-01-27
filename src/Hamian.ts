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
  error:string="";
  constructor(chains: Chain[],config:HamianConfig)
  {
    super(chains);
    this.config=config;
    if(!this.config.appId)
    {
      this.config.useChainId=true;
      this.config.appId=chains[0].chainId.substr(0,20);
    }
  }
  async init(): Promise<void> { 
    this.hamian=new Hamian(this.config.appId,this.config.serverUrl,this.config.botName,this.config.useChainId,this.config.appTitle);
    var profile = this.hamian.getprofile();
    if(profile)
    {
      this.users=[new UALHamianUser(profile,this.hamian)]
    }
    return;
  }
  reset(): void {
    this.users=[];
  }
  isErrored(): boolean {
    return !!this.error;
  }
  getOnboardingLink(): string {
    return 'https://telegram.org/apps'
  }
  getError(): any {
    var message=this.error;
    this.error="";
    return message;
  }
  isLoading(): boolean {
    return false;
  }
  getStyle(): ButtonStyle {
    return {
      icon: HamianLogo,
      text: Name,
      textColor: 'white',
      background: '#FFC107'
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
        res([new UALHamianUser(user,this.hamian)])
      })
      .catch((exp:any)=>{
        if(exp.message)
          this.error=exp.message;
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
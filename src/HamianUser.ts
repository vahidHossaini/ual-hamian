import Hamian, {HamianProfile} from 'hamian';
import { SignTransactionResponse, User, UALErrorType, SignTransactionConfig } from 'universal-authenticator-library'
import { UALHamianError } from './UALHamianError';
export class HamianResponse implements SignTransactionResponse
{
  wasBroadcast: boolean=false;
  transactionId?: string | undefined;
  status?: string | undefined;
  error?: { code: string; message: string; name: string; } | undefined;
  transaction: any;
  constructor(data:any=null)
  {
    if(data)
    {
      Object.assign(this,data)
    }
  }
}

export class UALHamianUser extends User {
  profile:HamianProfile;
  hamian:Hamian;
  constructor( profile:HamianProfile,hamian:Hamian)
  {
    super();
    this.profile=profile;
    this.hamian=hamian;
  }
  async signTransaction(transaction: any, config?: SignTransactionConfig): Promise<SignTransactionResponse> {
    console.log('transaction',transaction)
    console.log('transaction',config)

    var data:any = await this.hamian.runTransaction(this.profile.wallet[0].wallet,transaction);
    console.log('responseData',data);
    if(data.response && data.response .data.response )
    {
      if(data.response .data.response.data)
      {
        var transactionData:any=data.response .data.response.data;
        var transactionResponse=new HamianResponse();
        transactionResponse.transactionId=transactionData.transaction_id;
        transactionResponse.transaction=transactionData.processed;
        return transactionResponse;

      }
      else
      {
        return new HamianResponse({error:data.response .data.response.message});

      }
    }
    else
    { 
    }
    return new HamianResponse({error:''});
    // throw new Error('Method not implemented.');
  }
  signArbitrary(publicKey: string, data: string, helpText: string): Promise<string> {
    console.log('transaction',helpText)
    throw new UALHamianError(
      `Hamian does not currently support signArbitrary(${publicKey}, ${data})`,
      UALErrorType.Unsupported,
      null)
  }
  verifyKeyOwnership(challenge: string): Promise<boolean> {
    throw new UALHamianError(
      `Hamian does not currently support signArbitrary(${challenge} )`,
      UALErrorType.Unsupported,
      null)
  }
  getAccountName(): Promise<string> {
    var wallet = this.profile.wallet[0];
    return wallet.value;
  }
  getChainId(): Promise<string> {
    var wallet = this.profile.wallet[0];
    return wallet.wallet;
  }
  getKeys(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
import {HamianProfile} from 'hamian';
import { SignTransactionResponse, User, UALErrorType, SignTransactionConfig } from 'universal-authenticator-library'
import { UALHamianError } from './UALHamianError';

export class UALHamianUser extends User {
  profile:HamianProfile;
  constructor( profile:HamianProfile)
  {
    super();
    this.profile=profile;
  }
  signTransaction(transaction: any, config?: SignTransactionConfig): Promise<SignTransactionResponse> {
    console.log('transaction',transaction)
    console.log('transaction',config)
    throw new Error('Method not implemented.');
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
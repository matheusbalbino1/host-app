import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { IClient } from './shared/models/client.model';
import { IClientSelect } from './pages/list-clients/list-clients.component';

export enum enRemotes {
  LEGO_MODULE_APP = 'legoModuleApp',
}

export enum enLegoModuleComponents {
  BUTTON = 'ButtonComponent',
  INPUT = 'InputComponent',
  MODAL_CLIENT_DATA = 'ModalClientDataComponent',
  CARD_CLIENT = 'CardClientComponent',
}

export interface IInputComponent {
  inputChange: Observable<string>;
}

export interface IButtonComponent {
  buttonText: string;
  outline: boolean;
}

export interface IModalClientDataComponent {
  type: enTypeModalClientData;
  messageService: MessageService;
  clientData: IClient;
  submit: Observable<Partial<IClient>>;
}

export interface ICardClientComponent {
  isSelectedClientPage: boolean;
  clientData: IClientSelect;
  onClickButtons: Observable<Partial<IKindClick>>;
}

export enum enTypeModalClientData {
  CREATING = 'creating',
  EDITING = 'editing',
  DELETING = 'deleting',
}

export enum IKindClick {
  SELECT = 'select',
  EDIT = 'edit',
  DELETE = 'delete',
  REMOVE = 'remove',
}

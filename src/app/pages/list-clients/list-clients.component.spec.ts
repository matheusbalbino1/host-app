import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IClientSelect, ListClientsComponent } from './list-clients.component';
import { ClientService } from '../../services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { IKindClick } from '../../components/card-client/card-client.component';

describe('ListClientsComponent', () => {
  let component: ListClientsComponent;
  let fixture: ComponentFixture<ListClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClientsComponent],
      providers: [MessageService, NgbModal, ClientService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListClientsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update clients when changing pages', () => {
    component.changePage(2);
    expect(component.page).toBe(2);
  });

  it('should update clients when changing pages', () => {
    component.changePage(2);
    expect(component.page).toBe(2);
  });

  it('should mark client as selected when clicking SELECT', () => {
    const client: IClientSelect = {
      id: 1,
      name: 'John Doe',
      salary: 5000,
      companyValuation: 1000000,
      selected: false,
    };

    component.onClickCardButton(IKindClick.SELECT, client);

    expect(client.selected).toBeTrue();
  });

  it('should remove client from selected list when clicking REMOVE', () => {
    const client: IClientSelect = {
      id: 1,
      name: 'John Doe',
      salary: 5000,
      companyValuation: 1000000,
      selected: true,
    };

    component.onClickCardButton(IKindClick.REMOVE, client);

    expect(client.selected).toBeFalse();
  });

  it('should reset selected clients', () => {
    component.resetSelectedClients();
    expect(component.clients.length).toBe(0);
  });
});

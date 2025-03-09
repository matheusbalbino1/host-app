import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IClient } from '../../shared/models/client.model';
import { ClientService } from '../../services/client.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  enLegoModuleComponents,
  enRemotes,
  enTypeModalClientData,
  IButtonComponent,
  ICardClientComponent,
  IKindClick,
  IModalClientDataComponent,
} from '../../modules';

interface ArrayPagination {
  number: number;
  isEllipsis: boolean;
  isSelected: boolean;
}

export interface IClientSelect extends IClient {
  selected?: boolean;
}

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.scss',
})
export class ListClientsComponent implements OnInit, AfterViewInit {
  @ViewChild('button', { read: ViewContainerRef, static: true })
  button!: ViewContainerRef;

  @ViewChild('containerListCardClient', {
    read: ViewContainerRef,
    static: false,
  })
  containerListCardClient!: ViewContainerRef;

  page = 1;
  pageSize = 1;
  totalPages = 1;
  arrayPagination: ArrayPagination[] = [];

  clients: IClientSelect[] = [];

  isSelectedClientPage = false;
  isLoading = true;

  ModalClientDataComponent!: IModalClientDataComponent;
  CardClientComponent!: ICardClientComponent;

  constructor(
    private clientService: ClientService,
    private modalService: NgbModal,
    private messageService: MessageService,
    private route: Router
  ) {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('clients/selected')) {
          this.isSelectedClientPage = true;
        }
      });
  }

  ngOnInit(): void {
    this.setArrayTotalPages();
    this.getData(this.isSelectedClientPage);
  }

  ngAfterViewInit(): void {
    this.loadModalClientDataComponent();
    this.loadButtonComponent();
    this.loadCardClientComponent();
  }

  openModal() {
    const modalRef = this.modalService.open(this.ModalClientDataComponent, {
      windowClass: 'dark-modal',
      centered: true,
      container: 'body',
      backdrop: 'static',
    });
    modalRef.dismissed.subscribe((_) => {
      this.getData();
    });
    return modalRef;
  }

  openModalCreating() {
    const modalRef = this.openModal();
    const modalInstanceRef =
      modalRef.componentInstance as IModalClientDataComponent;
    modalInstanceRef.type = enTypeModalClientData.CREATING;
    modalInstanceRef.messageService = this.messageService;
    const subscription = modalInstanceRef.submit.subscribe((client) => {
      this.clientService.createClient(client).subscribe(
        (_) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cliente criado com sucesso',
            life: 3000,
          });
          modalRef.dismiss();
          subscription.unsubscribe();
        },
        (response) => {
          this.clientService.handleError(response, this.messageService);
        }
      );
    });
  }

  onPageSizeChange() {
    this.changePage(1);
  }

  changePage(page: number) {
    this.page = page;
    this.getData();
  }

  onClickCardButton(kind: IKindClick, client: IClientSelect) {
    if (kind === IKindClick.SELECT) {
      client.selected = true;
      this.clientService.addClient(client);
    }

    if (kind === IKindClick.EDIT) {
      const modalRef = this.openModal();
      const modalInstanceRef =
        modalRef.componentInstance as IModalClientDataComponent;
      modalInstanceRef.type = enTypeModalClientData.EDITING;
      modalInstanceRef.clientData = client;
      const subscription = modalInstanceRef.submit.subscribe((client) => {
        this.clientService.updateClient(client.id as number, client).subscribe(
          (_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente editado com sucesso',
              life: 3000,
            });
            modalRef.dismiss();
            subscription.unsubscribe();
          },
          (response) => {
            this.clientService.handleError(response, this.messageService);
          }
        );
      });
    }

    if (kind === IKindClick.DELETE) {
      const modalRef = this.openModal();
      const modalInstanceRef =
        modalRef.componentInstance as IModalClientDataComponent;
      modalInstanceRef.type = enTypeModalClientData.DELETING;
      modalInstanceRef.clientData = client;
      const subscription = modalInstanceRef.submit.subscribe((client) => {
        this.clientService.deleteClient(client.id as number).subscribe(
          (_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente excluido com sucesso',
              life: 3000,
            });
            modalRef.dismiss();
            subscription.unsubscribe();
          },
          (response) => {
            this.clientService.handleError(response, this.messageService);
          }
        );
      });
    }

    if (kind === IKindClick.REMOVE) {
      client.selected = false;
      this.clientService.removeClient(client);
      if (this.isSelectedClientPage) {
        this.clients = [
          ...this.clients.filter((item) => item.id !== client.id),
        ];
        this.renderCardsClient(this.clients);
      }
    }
  }

  resetSelectedClients() {
    this.clientService.cleanSelectedClients();
    this.clients = [];
    this.renderCardsClient(this.clients);
  }

  private renderCardsClient(clients: IClient[]) {
    this.containerListCardClient.clear();

    for (const client of clients) {
      const componentRef = this.containerListCardClient.createComponent(
        this.CardClientComponent as any
      );
      const componentInstance = componentRef.instance as ICardClientComponent;
      componentInstance.clientData = client;
      componentInstance.isSelectedClientPage = this.isSelectedClientPage;
      componentInstance.onClickButtons.subscribe((kind) => {
        this.onClickCardButton(kind, client);
      });
    }
  }

  private getData(all?: boolean) {
    this.isLoading = true;
    if (all) {
      this.page = 1;
      this.pageSize = 999;
    }

    this.clientService
      .getClients({
        page: this.page,
        limit: this.pageSize,
      })
      .subscribe(
        (response) => {
          this.page = response.currentPage;
          this.totalPages = response.totalPages;
          this.setArrayTotalPages();

          const selectedClients = this.clientService.getSelectedClients();
          this.clients = response.clients.map((client) => ({
            ...client,
            selected: selectedClients.includes(client.id),
          }));

          if (this.isSelectedClientPage) {
            this.clients = this.clients.filter((client) => client.selected);
          }

          setTimeout(() => {
            this.isLoading = false;
            setTimeout(() => {
              this.renderCardsClient(this.clients);
            }, 10);
          }, 500);
        },
        (response) => {
          this.clientService.handleError(response, this.messageService);
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      );
  }

  private setArrayTotalPages() {
    if (this.totalPages <= 1) {
      this.arrayPagination = [
        {
          number: 1,
          isEllipsis: false,
          isSelected: true,
        },
      ];
      return;
    }
    const pages: ArrayPagination[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.page;

    pages.push({ number: 1, isEllipsis: false, isSelected: currentPage === 1 });

    if (currentPage > 3) {
      pages.push({ number: 0, isEllipsis: true, isSelected: false });
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        number: i,
        isEllipsis: false,
        isSelected: i === currentPage,
      });
    }

    if (currentPage < totalPages - 2) {
      pages.push({ number: 0, isEllipsis: true, isSelected: false });
    }

    pages.push({
      number: totalPages,
      isEllipsis: false,
      isSelected: currentPage === totalPages,
    });
    this.arrayPagination = pages;
  }

  private async loadButtonComponent() {
    const module = await loadRemoteModule({
      remoteName: enRemotes.LEGO_MODULE_APP,
      exposedModule: enLegoModuleComponents.BUTTON,
    });

    const componentRef = this.button.createComponent(
      module[enLegoModuleComponents.BUTTON]
    );
    const componentRefInstance = componentRef.instance as IButtonComponent;

    componentRef.location.nativeElement.style.display = 'block';
    componentRef.location.nativeElement.style['margin-top'] = '20px';
    componentRef.location.nativeElement.addEventListener(
      'click',
      (event: Event) => {
        if (this.isSelectedClientPage) {
          this.resetSelectedClients();
          return;
        }
        this.openModalCreating();
      }
    );

    componentRefInstance.buttonText = 'Criar cliente';
    if (this.isSelectedClientPage) {
      componentRefInstance.buttonText = 'Limpar clientes selecionados';
      componentRefInstance.outline = true;
    }
  }

  private async loadCardClientComponent() {
    const module = await loadRemoteModule({
      remoteName: enRemotes.LEGO_MODULE_APP,
      exposedModule: enLegoModuleComponents.CARD_CLIENT,
    });

    const component = module[enLegoModuleComponents.CARD_CLIENT];
    this.CardClientComponent = component;
  }

  private async loadModalClientDataComponent() {
    const module = await loadRemoteModule({
      remoteName: enRemotes.LEGO_MODULE_APP,
      exposedModule: enLegoModuleComponents.MODAL_CLIENT_DATA,
    });

    const component = module[enLegoModuleComponents.MODAL_CLIENT_DATA];
    this.ModalClientDataComponent = component;
  }
}

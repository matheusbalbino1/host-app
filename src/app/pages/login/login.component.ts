import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  enLegoModuleComponents,
  enRemotes,
  IButtonComponent,
  IInputComponent,
} from '../../modules';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('buttonEntrar', { read: ViewContainerRef, static: true })
  buttonEntrar!: ViewContainerRef;

  @ViewChild('input', { read: ViewContainerRef, static: true })
  input!: ViewContainerRef;

  inputValue = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  onTypeInput(text: string) {
    this.inputValue = text;
  }

  onClickButton(event: Event) {
    event?.preventDefault();
    if (!this.inputValue) {
      this.messageService.add({
        severity: 'error',
        summary: 'Por favor, insira o nome.',
      });
      return;
    }
    this.userService.setUsername(this.inputValue);
    this.router.navigate(['/clients']);
  }

  ngAfterViewInit() {
    this.loadButtonComponent();
    this.loadInputComponent();
  }

  private async loadInputComponent() {
    const module = await loadRemoteModule({
      remoteName: enRemotes.LEGO_MODULE_APP,
      exposedModule: enLegoModuleComponents.INPUT,
    });

    const componentRef = this.input.createComponent(
      module[enLegoModuleComponents.INPUT]
    );
    (componentRef.instance as IInputComponent).inputChange.subscribe(
      this.onTypeInput.bind(this)
    );
  }

  private async loadButtonComponent() {
    const module = await loadRemoteModule({
      remoteName: enRemotes.LEGO_MODULE_APP,
      exposedModule: enLegoModuleComponents.BUTTON,
    });

    const componentRef = this.buttonEntrar.createComponent(
      module[enLegoModuleComponents.BUTTON]
    );
    (componentRef.instance as IButtonComponent).buttonText = 'Entrar';

    componentRef.location.nativeElement.addEventListener(
      'click',
      (event: Event) => {
        this.onClickButton(event);
      }
    );
    const buttonChildren =
      componentRef.location.nativeElement.querySelector('button');
    buttonChildren.style['font-size'] = '1.5rem';
    buttonChildren.style.height = '60px';
  }
}

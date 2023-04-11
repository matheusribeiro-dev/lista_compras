import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { TarefaService } from 'src/app/services/tarefa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tarefaCollection: any[] = [];
  valorTotal: any;
 
  tempoTotalHora: string;
  tempoTotalMinuto: string;

  constructor(
    private alertCtrl: AlertController,
    private tarefaService: TarefaService,
    private actionSheetCtrl: ActionSheetController
  ) { }
  
  ngOnInit() {
    this.listarTarefa();
  }

  listarTarefa() {
  this.tarefaCollection = this.tarefaService.listar();
  setTimeout(() => {
    this.totalSomaHoras();
  }, 1000);
  }

  totalSomaHoras() {
    let totalHoras = 0;
    let totalMinutos = 0;

    this.tarefaCollection.forEach((item) => {
      if (item.hora != null) {
        const [hora, minuto] = item.hora.split(":").map(Number);
        totalHoras += hora;
        totalMinutos += minuto;
      }
    });
  
    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos %= 60;
  
    this.tempoTotalHora = totalHoras.toString().padStart(2, "0");
    this.tempoTotalMinuto = totalMinutos.toString().padStart(2, "0");
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'Produto',
      mode: 'ios',
      inputs: [
        {
          name: 'codigo',
          type: 'number',
          placeholder: 'Código',
          disabled: true
        },
        {
          name: 'data',
          type: 'date',
        },
        {
          name: 'descricao',
          type: 'text',
          placeholder: 'Descrição',
        },
        {
          name: 'extra',
          type: 'text',
          placeholder: 'Hora Extra',
        },
        {
          name: 'hora',
          type: 'time',
        },

      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Salvar',
          handler: async (tarefa) => {
              if(tarefa.hora == null || tarefa.hora == undefined || tarefa.hora == '' ){
                tarefa.hora = `00:00`;
              }
              if(tarefa.data == null || tarefa.data == undefined || tarefa.data == '' ){
                const actionSheet = this.actionSheetCtrl.create({
                  header: 'A data não pode ser vazia',
                  mode: 'ios',
                  buttons: [
                    {
                      text: 'OK',
                      icon: 'close',
                      role: 'cancel',
                    }
                  ],
                });
                (await actionSheet).present();
              } else{
                this.tarefaService.salvar(tarefa, () => {
                this.listarTarefa();
                });

              }
          }
        }
      ]
    });
    await alert.present();
    
  }
  async delete(item) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Data?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Excluir',
          handler: () => {
            this.tarefaService.excluir(item, () => {
              this.listarTarefa();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async editar(tarefa) {
    const alert = await this.alertCtrl.create({
      header: 'Produto',
      mode: 'ios',
      inputs: [
        {
          name: 'codigo',
          type: 'number',
          value: tarefa.codigo,
          disabled: true
        },
        {
          name: 'data',
          type: 'date',
          value: tarefa.data
        },
        {
          name: 'descricao',
          type: 'text',
          placeholder: 'Descrição',
          value: tarefa.descricao
        },
        {
          name: 'extra',
          type: 'text',
          placeholder: 'Hora Extra',
          value: tarefa.extra
        },
        {
          name: 'hora',
          type: 'time',
          value: tarefa.hora
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Salvar',
          handler: (tarefa) => {
            this.tarefaService.edicao(tarefa, () => {
              this.listarTarefa();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async openActions(tarefa: any) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'O QUE DESEJA FAZER?',
        mode: 'ios',
        buttons: [
          {
            text: 'Editar Registro',
            icon: 'pencil',
            handler: () => {
              this.editar(tarefa);
              this.listarTarefa();
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }
        ],
      });
      await actionSheet.present();
  }
  async showExclusion() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Todos os Registros?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Excluir',
          handler: () => {
            this.tarefaService.excluirTodos(() => {
              this.listarTarefa();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async showArray() {
    const alert = await this.alertCtrl.create({
      header: 'Iniciar',
      mode: 'ios',
      buttons: [{
          text: 'Click aqui para Iniciar',
          handler: () => {
            this.tarefaService.setArray(() => {
              this.listarTarefa();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async showPix() {
    const alerta = await this.alertCtrl.create({
      header: 'Quer Doar?',
      subHeader: 'Ajude a manter esse projeto no ar!',
      message: '&#128591; <br> <br> Pix:',
      mode: 'ios',
      inputs: [
        {
          id: 'pix',
          value:'matheus.ribeiro6611@gmail.com',
          disabled: true
        }
      ],
      buttons: [{
          id:'btn-pix',
          text: 'Copiar chave Pix',
          handler() {
            let chave = 'matheus.ribeiro6611@gmail.com'
            navigator.clipboard.writeText(chave);
            let btn = document.querySelector('#btn-pix');
            btn.textContent = "Copiado"
            
          },
        }
      ]
    });
    await alerta.present();
  }

  converteDataParaPadraoBrasileiro(data: string): string {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }
}

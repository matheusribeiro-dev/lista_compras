import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  tarefaCollection: any[] = [];
  key: 'tarefaCollection';
  codMostrar: boolean;

  constructor(private actionSheetCtrl: ActionSheetController) { }
  async salvar(tarefa: any, callback = null) {
    tarefa.feito = false;
    
    if(tarefa.codigo == ''){
      tarefa.codigo++;
    }

    let value = localStorage.getItem(this.key);

    if(value == null || value == undefined){
      console.log("entrou")
      this.tarefaCollection.push(tarefa);
      localStorage.setItem(this.key, JSON.stringify(this.tarefaCollection));
    }else {
      let collection: any[] = JSON.parse(value);
      if(collection == null || collection == undefined || collection.length < 0){
        return;
      } else{
        let last = collection[collection.length-1];
        if(last == null ||last == undefined || last == ''){
          return;
        } else{
          let num = last.codigo
          tarefa.codigo = num + 1;
        }
      }
      collection.push(tarefa);
      localStorage.setItem(this.key, JSON.stringify(collection));
      
    }

    if (callback != null) {
      callback(); 
    }
  }

  listar() {
    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {

      return [];
    }

    let collection: any[] = JSON.parse(value);

    collection.forEach(item=>{
      if(item.tarefa != null){
        this.codMostrar = true
      } else {
        this.codMostrar = false;
      }
    });

    return collection;
  }

  excluir(tarefa: any, callback = null) {
    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {
      return;
    }

    let collection: any[] = JSON.parse(value);

    let resultCollection = collection.filter(item => {
      return !(JSON.stringify(item) === JSON.stringify(tarefa));
    });

    localStorage.setItem(this.key, JSON.stringify(resultCollection));

    if (callback != null) {
      callback();
    }
  }
  atualizar(tarefa: any, callback = null){
    let value = localStorage.getItem(this.key);
    
    if (value == null || value == undefined) {
     return;
    }
    else {
      let collection: any[] = JSON.parse(value);

      collection.forEach(item=>{
        if(item.tarefa == tarefa.tarefa){
          item.feito = tarefa.feito
        }
      });

      localStorage.setItem(this.key, JSON.stringify(collection));
    }

    if (callback != null) {
      callback();
    }
  }
  edicao(tarefa: any, callback = null){

    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {
      return;
    }

    else {
      let collection: any[] = JSON.parse(value);
      
      collection.forEach(item=>{

        if(item.codigo == tarefa.codigo){
          
          if(tarefa.data == null || tarefa.data == ''){
            return;
          }else{
            item.data = tarefa.data
          }

          if(tarefa.descricao == null || tarefa.descricao == ''){
            return;
          }else{
            item.descricao = tarefa.descricao
          }

          if(tarefa.extra == null || tarefa.extra == ''){
            return;
          }else{
            item.extra = tarefa.extra
          }

          if(tarefa.hora == null || tarefa.hora == ''){
            return;
          }else{
            item.hora = tarefa.hora
          }
        
        } 
      });
      
      localStorage.setItem(this.key, JSON.stringify(collection));
    }

    if (callback != null) {
      callback();
    }
  }
  excluirTodos(callback = null) {
    let value = localStorage.getItem(this.key);

    if (value == null || value == undefined) {
      return;
    }

    let collection: any[] = JSON.parse(value);

    while(collection.length > 0){
      collection.pop();
    }

    collection = [{codigo: 0, data: null, descricao: null, extra: null, hora:null, feito: null}];
    localStorage.setItem(this.key, JSON.stringify(collection));

    if (callback != null) {
      callback();
    }
  }
  setArray(callback = null) {
    let value = localStorage.getItem(this.key);

    if (value != null || value != undefined) {
      let collection: any[] = JSON.parse(value);
      collection = [{codigo: 0, data: null, descricao: null, extra: null, hora:null, feito: null}];
      localStorage.setItem(this.key, JSON.stringify(collection));
    }

    if (callback != null) {
      callback();
    }
  }
}

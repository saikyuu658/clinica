<template>
    <div>
        <div class="filter">
            <button class="btn btn-secondary" v-on:click="showDevolModal()">Devolver</button>
            <button class="btn btn-primary" v-on:click="showEditModal()">Receber</button>
            <form  @submit.prevent="search">
                <input type="text" class="form-control" v-model="searchInput" style="width: 200px;">
            </form>
        </div>
    </div>
    <section class="content-table"> 
        <table class="table" >
            <thead>
                <tr>
                    <th>data rece.</th>
                    <th>Aluno</th>
                    <th>Recebido Por</th>
                    <th>data devol.</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in showList" :key="index">
                    <td>{{ item.dataRece }}</td>
                    <td>{{ item.aluno }}</td>
                    <td>{{ item.recebidoPor }}</td>
                    <td>{{ item.dataDevol }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>
    </section>
    <ModalEditarComponent
        v-show="isModalEditVisible"
        @close="closeEditModal"
    >
        <template v-slot:header>
            <h4>Receber itens</h4>
        </template>
        <template v-slot:body>
            
            <div class="row-group form-group">
                    <div class="">
                        <label> Selecione o Aluno</label>
                        <select class="form-control" :disabled="controlRecibeItemsInput" style="width: 300px" name=""  id="">
                            <option>David Pontes Silva</option>
                        </select>
                    </div>
                

                    <button class="btn btn-success" :disabled="controlRecibeItemsInput" v-on:click="confirAlunoRecibe">Confirmar</button>
            </div>
            
            <div class="content-list">
                <form  @submit.prevent="addListItems">
                    <div class="row-group form-group">
                        <div class="">
                            <label for="">Nome do item</label>
                            <input type="text" v-model="item.name" :disabled="!controlRecibeItemsInput" class="form-control" style="width: 300px"  >
                        </div>
                        <div class="">
                            <label for="">Quantidade</label>
                            <input type="number" v-model="item.qtd" :disabled="!controlRecibeItemsInput" class="form-control" style="width: 50px;" >
                        </div>

                        <button class="btn btn-primary" :disabled="!controlRecibeItemsInput">Adicionar</button>
                    </div>
                </form>

                <div class="content-list-itens">
                    <table class="table table-hover">
                        <tbody>
                            <tr v-for="(element, index) in listItens" :key="index">
                                <th style="width: 10%">{{ element.qtd }} x</th>
                                <td style="width: 80%">{{ element.name }}</td>
                                <td style="width: 10%"> 
                                    <button class="btn btn-danger" v-on:click="removeListItem(index)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>  
                </div> 
                <h5 class="total-items">
                    Total: {{ totalItens }} items
                </h5>
            </div>
        </template>
        <template v-slot:footer>
            <div class="d-flex justify-content-between px-2">
                <button class="btn btn-danger" v-on:click="closeEditModal()">
                    Cancelar
                </button>
                <button class="btn btn-primary" v-on:click="showConfirmModal()" :disabled="!controlRecibeItemsInput">
                    Finalizar
                </button>
            </div>
        </template>
    </ModalEditarComponent>

    
</template>
<script>
import ModalAddComponent from '@/components/modalAddComponent';
import ModalConfirmComponent from '@/components/modalConfirComponent.vue';
export default {
    components: {
        ModalAddComponent,
        ModalConfirmComponent
    },
    data(){
        return {
            isModalEditVisible: false,
            isModalConfirVisible: false,
            isModalDevolVisible: false,


            controlRecibeItemsInput: false,
            controlDevolItemsInput: false,


            searchInput: "",
            listMessage: [
                {
                    dataRece: "29/01/2024",
                    aluno: "David Pontes", 
                    recebidoPor: "David Pontes",
                    dataDevol: "29/01/2024",
                    status: "devolvido"
                },
                {
                    dataRece: "29/01/2024",
                    aluno: "Nubia Pontes", 
                    recebidoPor: "David Pontes",
                    dataDevol: "29/01/2024",
                    status: "devolvido"
                },
                {
                    dataRece: "29/01/2024",
                    aluno: "Abraao Pontes", 
                    recebidoPor: "David Pontes",
                    dataDevol: "29/01/2024",
                    status: "devolvido"
                },
            ],

            showList: [],
            item: {
                name: "",
                qtd: 1
            },
            totalItens : 0,
            listItens: [
                 
            ],

        }
    },
    methods: {

        confirAlunoRecibe(){
            this.controlRecibeItemsInput = true;
        },

        confirAlunoDevol(){
            this.controlDevolItemsInput = true;
        },

        showConfirmModal(){ 
            if(this.listItens.length <= 0){
                return
            }
            this.isModalConfirVisible = true;
        },

        closeDevolModal(){
            this.isModalDevolVisible = false;
        },

        closeConfirmModal(){
            this.isModalConfirVisible = false;
        },

        saveConfirmModal(credential){
            this.closeConfirmModal();

        },

        showEditModal() {
            this.isModalEditVisible = true;
        },

        showDevolModal() {
            this.isModalDevolVisible = true;
            this.totalItens = 0
            for (let i = 0; i < 10; i++) {
                this.listItens.push({
                    name: "item" + i.toString(),
                    qtd: i
                })
            }
            this.listItens.forEach(element => {
                 this.totalItens += parseFloat(element.qtd)
            });
        },
        

        closeEditModal() {
            this.isModalEditVisible = false;
            this.listItens = [];
            this.controlRecibeItemsInput = false;
            this.item = {
                name: "",
                qtd: 1
            }
        },
        
        search(){
            this.showList = [];
            if(this.searchInput == ""){
                this.showList = this.listMessage;
            }else{
                this.showList = this.listMessage.filter((e)=> {
                    if(e.aluno.toLowerCase().includes(this.searchInput.toLowerCase())){
                        return e;
                    }
                })
            }
        },

        addListItems(){
            if(this.item.qtd <= 0){
                return
            }
            this.listItens.push(this.item)
            this.item = {
                name : "",
                qtd: 1            
            }
            this.totalItens = 0;
            this.listItens.forEach(element => {
                 this.totalItens += parseFloat(element.qtd)
            });

           
        }
        ,

        removeListItem(index){
            this.listItens.splice(index, 1)

            this.totalItens = 0;
            this.listItens.forEach(element => {
                 this.totalItens += parseFloat(element.qtd)
            });
        }
    },
    created(){
        this.search()
    }
   
}
</script>
<style scoped>
   
    
  
    .content-list-itens, .content-list-items-devol{
        overflow: auto;
        height: calc(100vh /2);
    }
   
    label{
        font-weight: 600;
    }
    .row-group{
        align-items: end;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .form-group{
        margin-bottom: 20px;
    }

    .filter{
        position: absolute;
        top: 5px;
        height: 50px;
        left: 0;
        right: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: end;
    }

    .content-table{
        border: solid 1px #00000035;
        background-color: white;
        font-size: 13px;
        position: absolute;
        top: 60px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        box-shadow: 0 0 10px #00000020;
        border-radius: 3px;
        margin: 5px;
        overflow: auto;
    }

   
    .content-table thead th { 
        position: sticky; 
        top: 0; 
        z-index: 1; 
        padding-block: 15px;
    }

    
</style>
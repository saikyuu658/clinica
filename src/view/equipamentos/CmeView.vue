<template>
    <div>
        <div class="filter">
            <button class="button is-small is-info" v-on:click="showModal()">Receber</button>
            <FilterComponent
                @searchValue="search"
            ></FilterComponent>
        </div>
    </div>
    <section class="content-table"> 
        <DataTable 
            :value="listComputed" 
            paginator :rows="11" 
            :sortOrder="1"
            sortField="id"
        >
            <template #empty> Nenhum registro. </template>

            <Column field="user.name" header="Aluno"></Column>
            <Column field="dtCreated" header="Dt. Recebido"></Column>
            <Column field="status" header="Status"></Column>
            <Column >
                <template #body>
                    <span 
                        v-tooltip.bottom="'Devolver'"
                        class="material-symbols-outlined">
                        keyboard_return
                    </span>
                </template>
            </Column>
        </DataTable>
    </section>
    <ModalLargeComponent
        v-show="isReciveModal"
        @close="closeReciveModal"
    >
        <template v-slot:header>
            <h3>Receber</h3>
        </template>

        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Selecionar aluno</label>
                    <select class="input is-small" style="width: 350px;" id="selectStudent" :disabled="userSelected != 0" >
                        <option value="" selected disabled>Selecione</option>
                        <option :value="item.id" v-for="(item, index) of listUser" :key="index">{{ item.name }}</option>
                    </select>
                </div>
                <button class="button is-small is-info form-group" v-show="userSelected == 0" @click="confirmSelectionStudent" >
                    Confirmar
                </button>

                <button class="button is-small is-info form-group" @click="AlterSelectionStudent" v-show="userSelected != 0">
                    Alterar
                </button>
            </div>

            <div class="content-body" v-show="userSelected != 0">
                <form @submit.prevent="addItemList">
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Qtd</label>
                            <input type="number" v-model="newItem.qtd" style="width: 100px;" class="input is-small">
                        </div>
                        <div class="form-group">
                            <label for="">Lista de Itens</label>
                            <select class="input is-small" style="width: 300px;" id="" v-model="newItem.name">
                                <option value="" disabled>Selecione</option>
                                <option :value="item.name" v-for="(item, index) of listItemCme" :key="index">{{ item.name }}</option>
                            </select>
                        </div>

                        <button class="button is-small is-primary form-group">
                            <span class="material-symbols-outlined">
                                add
                            </span>
                        </button>
                    </div>
                </form>
                
            </div>

            <div class="content-list-table">
                <table class="list-equip-table">
                    <thead>
                        <tr>
                            <th style="width: 100px; padding-left: 5px;">Qtd</th>
                            <th>Nome</th>
                            <th style="width: 100px;">Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of listItem" :key="index">
                            <td>{{ item.qtd }}</td>
                            <td>{{ item.item }}</td>
                            <td>
                                <button class="button is-danger is-small" @click="rmItemList(index)">
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            
            </div>

        </template>

        <template v-slot:footer>
            <button class="button is-info is-small" :disabled="userSelected == 0" @click="createCme()">
                Salvar
            </button>
        </template>
    </ModalLargeComponent>

    <LoadingComponentVue
        v-show="isLoading"
    ></LoadingComponentVue>


</template>
<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ModalLargeComponent from '@/components/ModalLargeComponent.vue';
import FilterComponent from '@/components/FilterComponent.vue';
import RequestHttp from '@/http';
import LoadingComponentVue from '@/components/LoadingComponent.vue';


export default {
    components: {
        ModalLargeComponent,
        DataTable,
        Column,
        FilterComponent,
        LoadingComponentVue
    },
    data(){
        return {
            searchInput: "",
            listCme: [],

            newItem:{
                qtd: 1,
                name: ''
            },
            /**lista de itens para gravar*/
            listItem: [],
            userSelected: 0,

            /**lista de itens para selecionar*/
            listItemCme: [],
            isLoading: [],
            listUser: [],
            isReciveModal: false,
        }
    },
    methods: {

        AlterSelectionStudent(){
            this.userSelected = 0;
        },

        confirmSelectionStudent(){
            this.userSelected = document.querySelector('#selectStudent').value;
        },
        
        closeReciveModal(){
            this.isReciveModal = false;
            this.userSelected = 0;
            this.cleanFields();
        },

        cleanFields(){
            this.listItem = [];
            this.userSelected = 0;
            this.newItem = { name : '', qtd: 1}
            document.querySelector('#selectStudent').value = ""
        },

        async showModal(){
            this.isReciveModal = true;
            const resp = await RequestHttp.listUser();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })

            }else{
                this.isLoading = false
                this.listUser = resp;
            }
        },
        
        search(value){
            this.searchInput = value;
        },

        addItemList(){
            if(this.newItem.qtd == 0 || this.newItem.name == ''){
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "Preencha as informações corretamente", life: 3000 })
                return 
            }
            this.listItem.push(this.newItem)
            this.newItem = {qtd: 1, name : ''}
        },
        
        rmItemList(index){
            this.listItem.splice(index, 1);
        },

        async findAllCme(){
            this.isLoading = true
            const resp =await RequestHttp.listCme();

            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })

            }else{
                console.log(resp);
                this.isLoading = false
                this.listCme = resp;
            }
        },

        async toListItemCme(){
            this.isLoading = true
            const resp =await RequestHttp.listItensCme();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })

            }else{
                this.isLoading = false
                this.listItemCme = resp;
            }
        },

        async createCme(){
            this.isLoading = true
            const createNewCme = {
                id:  this.userSelected,
                cme: this.listItem
            }

            console.log(createNewCme);
            const resp =await RequestHttp.createCme(createNewCme);
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.$toast.add({ severity: 'success', summary: '', detail: "Registrado com sucesso!", life: 3000 })
                this.findAllCme()
            }
        }
      
    },
    computed: {
        listComputed(){
            if(this.searchInput == ""){
                return this.listCme;
            }else{
                return this.listCme
                .filter((e)=> {
                    if(
                        e.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.clinic.toLowerCase().includes(this.searchInput.toLowerCase()) 
                        ){
                        return e;
                    }
                })
            }
        }
    },
    created(){
        this.findAllCme();
        this.toListItemCme();
    }
   
}
</script>
<style scoped>
   
    .content-list-table{
        position: absolute;
        bottom: 50px;
        left: 7px;
        top: 130px;
        overflow: auto;
        width: 600px;
        
    }

    .list-equip-table{
        width: 100%;
    }
    .list-equip-table thead{
        position: sticky;
        padding: 5px;
        top: -2px;
        background-color: #c9c9c9;
        border-collapse: collapse;
        z-index: 2;
        border: solid 1px #00000035;

    }

    .list-equip-table tbody td{
        padding: 5px;
        border-bottom: solid 1px #00000035;
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
        padding: 15px;
        overflow: auto;
    }

   
   

    
</style>
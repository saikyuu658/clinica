<template>
    <div>
        <div class="filter">
            <button class="btn btn-primary" v-on:click="showModalAdd">Adicionar</button>
            <form  @submit.prevent="search">
                <input type="text" class="form-control" v-model="searchInput" style="width: 200px;">
            </form>
        </div>
    </div>
    <section class="content-table"> 
        <table class="table table-hover " >
            <thead>
                <tr class="table-light" >
                    <th>Nome</th>
                    <th>Ult. Manutenção</th>
                    <th>Tipo</th>
                    <th>Prox. Manutenção</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in showList" :key="index">
                    <td style="width: 40%;">{{ item.name }}</td>
                    <td>{{ item.last }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.next }}</td>
                </tr>
            </tbody>
        </table>
    </section>
    <ModalEditarComponent
        v-show="isModalAddVisible"
        @close= "closeModalAdd"
    >
        <template v-slot:header>
            <h3>Novo Equipamento</h3>
        </template>
        <template v-slot:body>
            <div class="form-group">
                <label for="">Código Interno</label>
                <input type="text" style="width: 100px;" class="form-control">
            </div>
                
            <div class="form-group">
                <label for="">Nome</label>
                <input type="text" style="width: 300px;" class="form-control">
            </div>
            
            <div class="form-group">
                <label for="">Data de Aquisição</label>
                <input type="date" class="form-control" style="width: 200px;">
            </div>

            <div class="form-group">
                <label for="">Intervalo de Manutenção</label>
                <input type="Number" class="form-control" placeholder="Dias" style="width: 150px;">
            </div>
        </template>

        <template v-slot:footer>
            <div class="d-flex justify-content-between px-3">
                <button class="btn btn-danger" v-on:click="closeModalAdd">Cancelar</button>
                <button class="btn btn-primary">Finalizar</button>
            </div>
        </template>
    </ModalEditarComponent>
</template>
<script>
import ModalEditarComponent from "@/components/modalEditarComponent.vue";

export default {
    components: {
        ModalEditarComponent
    },
    data(){
        return {
            isModalAddVisible : false,
            searchInput: "",
            listMessage: [
                {
                    name: "oculos",
                    last: "31/01/2024",
                    type: "Preventiva",
                    next: "58/01/2024"
                },
                {
                    name: "Garrafa",
                    last: "31/01/2024",
                    type: "Preventiva",
                    next: "58/01/2024"
                },
                {
                    name: "Copo",
                    last: "31/01/2024",
                    type: "Preventiva",
                    next: "58/01/2024"
                },
                {
                    name: "Controle",
                    last: "31/01/2024",
                    type: "Preventiva",
                    next: "58/01/2024"
                },
                {
                    name: "Vasilha",
                    last: "31/01/2024",
                    type: "Preventiva",
                    next: "58/01/2024"
                },
               
            ],
            showList: []
        }
    },
    methods: {
        showModalAdd(){
            this.isModalAddVisible = true;
        },

        closeModalAdd(){
            this.isModalAddVisible = false;
        },

        search(){
            this.showList = [];
            if(this.searchInput == ""){

                this.showList = this.listMessage;
            }else{
                this.showList = this.listMessage.filter((e)=> {
                    if(e.name.toLowerCase().includes(this.searchInput.toLowerCase())){
                        return e;
                    }
                })
            }
        }
    },
    created(){
        this.search()
    }
   
}
</script>
<style scoped>
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
        border-radius:3px;
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
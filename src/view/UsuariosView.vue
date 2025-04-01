<template>
    <div>
        <div class="filter">
            <span class="title-filter">Usuários</span>
           
            <div class="right-filter">
                <Button v-on:click="showModal">Novo Usuário</Button>

                <FilterComponent
                    @searchValue="search"
                ></FilterComponent>
            </div>
        </div>
    </div>
    <section class="content-table"> 
        <div class="content-card">
            <div class="user-card" v-for="(item, index) of listComputed" :key="index"  v-on:click="showModalEdit(item)">
                <div class="user-info"> 
                    <div class="user-name">{{ item.nome }}</div>
                    <div class="user-level">Nível: {{ convertNivel(item.nivel) }} </div>
                    <div class="user-email">Email: {{ item.email }}</div>
                </div>
            </div>
        </div>
    </section>


    <ModalSmallComponent
    v-show="isModalVisible"
    @close="closeModal"
    >
        <template v-slot:header>
            <h3 style="font-size: large; border-bottom: solid 1px #c2c2c2; margin-bottom: 12px;">Novo Usuários</h3>
        </template>
        <template v-slot:body>
            <div class="center">
                <div class="form-group">
                    <label for="">Nome</label>
                    <InputText type="text" v-model="usuario.nome" placeholder="Nome completo" style="width: 300px;"/>
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <InputText type="tel" v-model="usuario.telefone" placeholder="(00) 00000-0000" v-mask="'(##) # ####-####'" style="width: 300px;"/>

                </div>
                <div class="form-group">
                    <label for="">Login</label>
                    <InputText type="text" v-model="usuario.login" placeholder="Digite o login" style="width: 300px;"/>
                </div>
                <div class="form-group">
                    <label for="">Nível</label>
                    <Dropdown  v-model="usuario.nivel" :options="['funcionario', 'professor']" placeholder="Selecione os instrumentos" style="width: 300px;"/>
                </div>
                <div class="row-group">
                    <div class="form-group">
                        <label for="">Senha</label>
                        <InputText type="password" v-model="usuario.senha" placeholder="Digite a senha" style="width: 300px;"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="">Email</label>
                    <InputText type="email" v-model="usuario.email" placeholder="exemple@flucianofeijao.com"  style="width: 300px;"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <Button label="Cancelar" severity="secondary" v-on:click="()=>isModalVisible=false"></Button>
            <Button label="Salvar Usuario" v-on:click="save"></Button>
        </template>
    </ModalSmallComponent>

    <ModalComponentVue
    v-show="isModalEditVisible"
    @close="closeModalEdit"
    >
        <template v-slot:header>
            <h3 style="font-size: large;">Atualizar Usuário</h3>
        </template>
        <template v-slot:body>
            <div class="center" >
                <div class="form-group">
                    <label for="">Nome</label>
                    <InputText type="text" v-model="usuario.nome" placeholder="Nome completo" style="width: 300px;"/>
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <InputText type="tel" v-model="usuario.telefone" placeholder="(00) 00000-0000" v-mask="'(##) # ####-####'" />
                </div>
                <div class="form-group">
                    <label for="">Login</label>
                    <InputText type="text" v-model="usuario.login" placeholder="Digite o login" />
                </div>
                <div class="form-group">
                    <label for="">Nível</label>
                    <Dropdown  v-model="usuario.nivel" :options="['funcionario', 'professor']" placeholder="Selecione os instrumentos" />
                </div>
                <div class="form-group">
                    <label for="">Senha</label>
                    <InputText type="password" v-model="usuario.senha" placeholder="Digite a senha" style="width: 300px;"/>
                </div>
                <div class="form-group">
                    <label for="">Email</label>
                    <InputText type="email" v-model="usuario.email" placeholder="exemple@flucianofeijao.com"  style="width: 300px;"/>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <Button label="Cancelar" severity="secondary" v-on:click="()=>closeModalEdit()"></Button>
            <Button label="Salvar"  v-on:click="()=>updateUser()"/>
        </template>
    </ModalComponentVue>

    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>
</template>
<script>
    import ModalSmallComponent from '@/components/ModalSmallComponent.vue'
    import ModalComponentVue from '@/components/ModalComponent.vue'
    import FilterComponent from '@/components/FilterComponent.vue';
    import {http} from '../http';
    import {mask} from 'vue-the-mask'
    import LoadingComponentVue from '@/components/LoadingComponent.vue';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Dropdown from 'primevue/dropdown'
    export default {
        components: {
            Button,
            FilterComponent,
            ModalComponentVue,
            ModalSmallComponent,
            InputText,
            LoadingComponentVue,
            Dropdown
        },

        directives: {mask},
        
        data(){
            return {
                items : [
                    {
                        label: 'Perfil'
                    },
                    {
                        label: 'Atividade'
                    },
                ],
                isLoading: false,
                selectedUser: {},
                isModalVisible: false,
                isModalEditVisible: false,

                usuario: {
                    nome: "",
                    telefone: "",
                    login: "",
                    senha: "",
                    nivel: "",
                    email: "" 
                },

                confirPass :"",
                searchInput: "",
                list: [
                    {
                        id: "",
                        login: "",
                        nome: "",
                        nivel: "",
                        telefone: "",
                        email: "",
                    }
                ],

                
            }
        },
        
        methods: {
            closeModalEdit(){
                this.isModalEditVisible = false;
                this.usuario = {
                    nome: "",
                    email: "",
                    login: "",
                    nivel: "",
                    senha: "",
                    telefone: ""
                }
            },

            showModalEdit(val){
                this.usuario = JSON.parse(JSON.stringify(val));
                this.usuario.senha = "";
                this.usuario.nivel = this.convertNivel2(this.usuario.nivel)
                this.isModalEditVisible = true;
            },

            closeModal(){
                this.isModalVisible = false;
                this.usuario = {
                    nome: "",
                    email: "",
                    login: "",
                    nivel: "",
                    senha: "",
                    telefone: ""
                }
            },

            showModal(){
                this.isModalVisible = true;
            },
            
            formatTel(val) {
                return `(${val.substring(0, 2)}) ${val.substring(2, 7)} - ${val.substring(7)}`
            },

            search(value){
                this.searchInput = value;
            },

            convertStatus(val){
                return val? 'Ativo' : 'Disabilitado'
            },  
            
            convertNivel(val){
                switch (val) {
                    case 'a':
                    return 'Aluno'
                    case 'f':
                    return 'Funcionário'
                    case 'p':
                    return 'Professor'
                    case 's':
                    return 'Admin'
                
                    default:
                        break;
                }
            },

            convertNivel2(val){
                switch (val) {
                    case 'a':
                    return 'aluno'
                    case 'f':
                    return 'funcionario'
                    case 'p':
                    return 'professor'
                    case 's':
                    return 'admin'
                
                    default:
                        break;
                }
            },

            async save(){
                try {
                    this.isLoading = true;
                    const regex = /\(|\)|-/gi;
                    this.usuario.telefone = this.usuario.telefone.replaceAll(regex, '').replaceAll(' ', '');
                    this.usuario.nivel = this.usuario.nivel.slice(0,1);

                    await http.post('user/create', this.usuario);
                    console.log(this.usuario);
                    this.isLoading = false;
                    this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Adicionado com sucesso', life: 3000 })
                    this.isModalVisible = false;
                    this.listUsers()

                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                }
            },

            async listUsers(){
                try {
                    this.isLoading = true;
                    const resp = await http.get('user/');
                    this.list = resp.data
                    this.isLoading = false;
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                }
            },

            async updateUser(){
                try {
                    this.isLoading = true;
                    const regex = /\(|\)|-/gi;
                    this.usuario.telefone = this.usuario.telefone.replaceAll(regex, '').replaceAll(' ', '');
                    this.usuario.nivel = this.usuario.nivel.slice(0,1);
                    const resp = await http.post('user/update', this.usuario);
                    this.$toast.add({ severity: 'success', summary: 'Success Message', detail: resp.data, life: 3000 })
                    this.isLoading = false;
                    this.closeModalEdit();
                    this.listUsers();            
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                    
                }
                
                this.isModalEditVisible = false;
            }

        },
        
        created(){
            this.listUsers();
        },
        
        computed: {
            listComputed(){
                if(this.searchInput == ""){
                    return this.list;
                }else{
                    return this.list.filter((e)=> {
                        if(
                            e.nome.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                            e.login.toLowerCase().includes(this.searchInput.toLowerCase()) 
                            ){
                            return e;
                        }
                    })
                }
            }
        },
    }
</script>
<style scoped>
    .btn{
        cursor: pointer
    }
    .content-card {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 20px;
    }

    .user-card {
        display: flex;
        align-items: center;
        padding: 15px;
        padding-right: 9px;
        border-radius: 10px;
        box-shadow: 0 0px 3px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        font-family: Arial, sans-serif;
        cursor: pointer;
    }

    .user-card:hover{
        box-shadow: 0 0px 8px rgba(0, 0, 0, 0.5);

    }

    .user-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: contain;
        margin-right: 15px;
        border: solid 1px #555
    }

    .user-info {
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .user-level, .user-email, .user-status {
        margin-bottom: 3px;
        white-space: nowrap;
        text-overflow: ellipsis; 
        color: #555;
    }

    .user-status {
        font-weight: bold;
        color: green;
    }

    .center{
        display: flex;
        justify-content: start;
        flex-direction: column;
    }
</style>
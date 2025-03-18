<template lang="js">
    <form  @submit.prevent="search">
        <InputText type="text" v-model="inputSearch" placeholder='Aperte "Enter" para pesquisar' style="width: 300px"/>
    </form>
</template>
<script>
import InputText from 'primevue/inputtext';
export default {

    components: {
        InputText
    },

    data(){
        return {
            inputSearch: ""
        }
    },
    methods: {
        search(){
            this.$emit("searchValue", this.inputSearch)
        }
    }
}
</script>
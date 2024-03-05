<template lang="">
    <form  @submit.prevent="search">
        <input type="text" v-model="inputSearch" class="input is-small" placeholder='Aperte "Enter" para pesquisar' style="width: 300px">
    </form>
</template>
<script>
export default {
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
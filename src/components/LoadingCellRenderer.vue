<template>
   <div>{{value ? value : 'LOADING...'}}</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend( {
    data: function() {
        return {
            value: null,
        };
    },
    beforeMount() {},
    mounted() {
        this.value = this.params.value
    },
} )
</script>

<style>
</style>
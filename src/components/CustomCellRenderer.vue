<template>
   <div class="custom-cell">
        Custom + {{value}}
    </div>
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
    .custom-cell
    {
        background: red;
        border: blue 1px solid;
    }
</style>
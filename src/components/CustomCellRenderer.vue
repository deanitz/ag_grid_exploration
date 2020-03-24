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
        padding: 0 10px 0 10px;
        background: orange;
        border: darkorange 2px solid;
    }
</style>
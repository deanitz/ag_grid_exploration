<template>
    <div>
        <div v-if="value" class="custom-cell" :style="style">
                Custom + {{value}}
        </div>
        <div v-else/>
    </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend( {
    data: function() {
        return {
            value: null,
            style: "background: pink"
        };
    },
    beforeMount() {},
    mounted() {
        this.value = this.params.value
    },
    methods: {
        refresh(params) {
            this.params = params;
            this.value = this.params.value
            this.style = "background: " + this.getRandomColor()
            console.log("refresh call")
            return true;
        },

        getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
    }
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
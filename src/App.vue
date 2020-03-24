<template>
  <div>
    <button @click="getSelectedRows()">Get Selected Rows</button>
    <p>{{filteredItems}}/{{totalItems}}</p>
    <ag-grid-vue style="width: 500px; height: 500px;"
                 class="ag-theme-alpine"
                 :gridOptions="gridOptions"
                 :frameworkComponents="frameworkComponents"
                 :columnDefs="columnDefs"
                 :rowData="rowData"
                 :context="context"
                 rowSelection="single"
                 @grid-ready="onGridReady"
                 @filter-changed="onFilterChanged">
    </ag-grid-vue>
  </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";
import CustomCellRenderer from "./components/CustomCellRenderer.vue";


export default {
  name: 'App',
  data() {
            return {
                columnDefs: null,
                frameworkComponents: null,
                rowData: null,
                totalItems: 0,
                filteredItems: 0,
                gridOptions: {
                    rowHeight: 28,
                    defaultColDef: {
                        resizable: true, 
                        filter: true,
                        filterParams: {
                          suppressAndOrCondition: true,
                        },
                        sortable: true,
                        flex: 1,
                        minWidth: 100,
                    }
                },
            }
        },
  components: {
            AgGridVue
        },
  methods: {
            onFilterChanged(params){
                this.filteredItems = params.api.getDisplayedRowCount()
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.column
                this.filteredItems = params.api.getDisplayedRowCount()
            },
            getSelectedRows() {
                const selectedNodes = this.gridApi.getSelectedNodes();
                const selectedData = selectedNodes.map( node => node.data );
                const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ');
                alert(`Selected nodes: ${selectedDataStringPresentation}`);
            }
        },
  beforeMount() {
            this.context = { componentParent: this };
            this.frameworkComponents = {
              customCellRenderer: CustomCellRenderer,
            };
            this.columnDefs = [
                {headerName: 'Make', field: 'make', pinned: 'left', lockPosition: true, cellRenderer: 'customCellRenderer'},
                {headerName: 'Model', field: 'model', filter: false},
                {headerName: 'Price', field: 'price', filter: 'agNumberColumnFilter'}
            ];

            var rowData = [{
                make: 'Toyota',
                model: 'Celica',
                price: 35123
              },
              {
                make: 'UAZ',
                model: 'Patriot',
                price: 121212
              },
              {
                make: 'Ford',
                model: 'Mondeo',
                price: 32000
              },
              {
                make: 'Porsche',
                model: 'Boxter',
                price: 72000
              },
              {
                make: 'Toyota',
                model: 'Celica',
                price: 35123
              },
              {
                make: 'UAZ',
                model: 'Patriot',
                price: 121212
              },
              {
                make: 'Ford',
                model: 'Mondeo',
                price: 32000
              },
              {
                make: 'Porsche',
                model: 'Boxter',
                price: 72000
              },
              {
                make: 'Toyota',
                model: 'Celica',
                price: 35123
              },
              {
                make: 'UAZ',
                model: 'Patriot',
                price: 121212
              },
              {
                make: 'Ford',
                model: 'Mondeo',
                price: 32000
              },
              {
                make: 'Porsche',
                model: 'Boxter',
                price: 72000
              }
            ]

            this.rowData = rowData
            this.totalItems = rowData.length
            this.filteredItems = rowData.length

            // fetch('https://api.myjson.com/bins/15psn9')
            //   .then(result => result.json())
            //   .then(rowData => {
            //     this.rowData = rowData
            //     this.totalItems = rowData.length
            //     this.filteredItems = rowData.length
            //     });
  }
}
</script>

<style lang="scss">
  @import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
  @import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style lang="scss">
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine/sass/ag-theme-alpine-mixin.scss";

.ag-theme-alpine {
    @include ag-theme-alpine((
        // use theme parameters where possible
        alpine-active-color: orange
    ));

    .ag-header {
        // or write CSS selectors to make customisations beyond what the parameters support
        text-shadow: deeppink 1px;
    }

    .ag-cell {
      padding-left: 4px;
      padding-right: 4px;
      line-height: 22px;
    }

    // .ag-icon-filter:before {
    //     content: '\E914';
    // }

    // .ag-pinned-left-header {
    //   border-right: 2px solid violet;
    // }

    // .ag-pinned-left-cols-container {
    //   border-right: 2px solid violet;
    // }

    // .ag-cell-last-left-pinned {
    //   border-right: 2px solid violet;
    // }
}
</style>

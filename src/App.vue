<template>
  <div>
    <button @click="getSelectedRows()">Get Selected Rows</button>
    
    <button @click="addRowDataView()">Add Row</button>
    <button @click="refreshDataView()">Refresh Server Data</button>
    <button @click="refreshCells()">Refresh Cells</button>
    <button @click="printCacheData()">Print Cache Data</button>

    <p>{{filteredItems}}/{{totalItems}}</p>
    <ag-grid-vue style="width: 500px; height: 500px;"
                 class="ag-theme-alpine"
                 :gridOptions="gridOptions"
                 :components="components"
                 :frameworkComponents="frameworkComponents"
                 :columnDefs="columnDefs"
                 :context="context"
                 :rowBuffer="rowBuffer"
                 :rowDeselection="true"
                 :rowModelType="rowModelType"
                 :paginationPageSize="paginationPageSize"
                 :cacheOverflowSize="cacheOverflowSize"
                 :cacheBlockSize="cacheBlockSize"
                 :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
                 :infiniteInitialRowCount="infiniteInitialRowCount"
                 :maxBlocksInCache="maxBlocksInCache"
                 rowSelection="single"
                 @grid-ready="onGridReady"
                 @filter-changed="onFilterChanged">
    </ag-grid-vue>
  </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";
import CustomCellRenderer from "./components/CustomCellRenderer.vue";
import LoadingCellRenderer from "./components/LoadingCellRenderer.vue";
// import { LoadingCellRenderer } from 'ag-grid-community/dist/lib/rendering/cellRenderers/loadingCellRenderer';


export default {
  name: 'App',
  data() {
            return {
                columnDefs: null,
                components: null,
                frameworkComponents: null,
                rowData: null,
                lastId: 10000,
                totalItems: 0,
                filteredItems: 0,
                rowBuffer: null,
                rowSelection: null,
                rowModelType: null,
                paginationPageSize: null,
                cacheOverflowSize: null,
                cacheBlockSize: null,
                maxConcurrentDatasourceRequests: null,
                infiniteInitialRowCount: null,
                maxBlocksInCache: null,
                gridOptions: {
                    rowModelType: 'infinite',
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
                //this.filteredItems = params.api.getDisplayedRowCount()
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.column;
                //STUB imitating server data fetch
                fetch('http://localhost:8080/info.json')
                  .then(result => result.json())
                  .then(rowData => {
                    this.rowData = rowData
                    console.log(rowData)
                    var dataSource = {
                    rowCount: null,
                    getRows: params => {
                      console.log(
                        'asking for ' + params.startRow + ' to ' + params.endRow
                      );
                      
                      this.printCacheData()

                      //here to call server
                      setTimeout(function() {
                        console.log(params);
                        //console.log(params);
                        var rowsThisPage = rowData.slice(params.startRow, params.endRow);
                        rowsThisPage.forEach(row => row.price = Math.floor(Math.random() * Math.floor(100000)));
                        var lastRow = -1;
                        if (rowData.length <= params.endRow) {
                          lastRow = rowData.length;
                        }
                        params.successCallback(rowsThisPage, lastRow);
                      }, 500);
                    },
                  };
                  params.api.setDatasource(dataSource);
                    // this.rowData = rowData
                    // this.totalItems = rowData.length
                    // this.filteredItems = rowData.length
                    });

                //this.filteredItems = params.api.getDisplayedRowCount()
            },
            getSelectedRows() {
                const selectedNodes = this.gridApi.getSelectedNodes();
                const selectedData = selectedNodes.map( node => node.data );
                const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ');
                alert(`Selected nodes: ${selectedDataStringPresentation}`);
            },
            refreshDataView() {
                this.gridApi.refreshInfiniteCache()
            },
            refreshCells() {
                this.gridApi.refreshCells({columns:['make', 'price'], force:true})
            },
            addRowDataView() {
              this.rowData.splice(3, 0, {"id": this.lastId++,
                                    "make": "Abracadabra",
                                    "model": "Sim Salabim",
                                    "price": Math.floor(Math.random() * Math.floor(100000))})
            },
            printCacheData() {
              var obj = this.gridApi.getCacheBlockState();
              console.log('obj: ');
              console.log(obj);
              
            }
        },
  beforeMount() {
            this.context = { componentParent: this };
            this.frameworkComponents = {
              customCellRenderer: CustomCellRenderer,
              loadingRenderer: LoadingCellRenderer,
            };
            this.columnDefs = [
                {headerName: 'ID', field: 'id', pinned: 'left', lockPosition: true, filter: false, cellRenderer: 'loadingRenderer', width: 50},
                {headerName: 'Make', field: 'make', pinned: 'left', lockPosition: true, cellRenderer: 'customCellRenderer', width: 70},
                {headerName: 'Model', field: 'model', filter: false},
                {headerName: 'Price', field: 'price', filter: 'agNumberColumnFilter'}
            ];

            this.rowBuffer = 0;
            this.rowModelType = 'infinite';
            this.paginationPageSize = 30;
            this.cacheOverflowSize = 2;
            this.cacheBlockSize = 20;
            this.maxConcurrentDatasourceRequests = 1;
            this.infiniteInitialRowCount = 30;
            this.maxBlocksInCache = 3;


            // this.rowData = rowData
            // this.totalItems = rowData.length
            // this.filteredItems = rowData.length

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

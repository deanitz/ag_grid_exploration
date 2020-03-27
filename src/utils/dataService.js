export default class DataService {

    allServerData = null;
    timerId = null;
    subscriptions = [];
    dataBlocks = [];

    dataUpdatedCallback = ()=>{}

    constructor() {
        fetch('http://localhost:8080/info.json')
                  .then(result => result.json())
                  .then(rowData => {
                    this.allServerData = rowData
                    console.log(this.allServerData)
                    console.log("server data loaded to emulator")
                  })
        this.timerId = setInterval(this.updatePrices, 10000, this);
      }

    updatePrices(context)
    {
        context.allServerData.forEach(item => {
            item.price = Math.floor(Math.random() * Math.floor(100000))
        });
        //console.log(context)

        context.subscriptions.forEach(sub => {
            context.getServerData(sub)
        })
    }

    //{blockNumber: 1, startRow: 20, endRow: 40, pageStatus: "loaded"}

    syncCacheWithSubs(newSubs){
        this.subscriptions = this.subscriptions.filter(sub => {
            return newSubs.some(newSub => newSub.blockNumber == sub.blockNumber);
        });

        newSubs.forEach(newSub => addSub(newSub))
    }

    addSub(newSub){
        if (this.subscriptions.every(sub => sub.blockNumber != newSub.blockNumber)){
            let data = []
            this.subscriptions.push({...newSub, data: []})
        }

        console.log(this.subscriptions)
    }

    getServerData(params) {
        //here to call server
        setTimeout(() => {
            console.log(params);
            //console.log(params);
            var rowsThisPage = this.allServerData.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (this.allServerData.length <= params.endRow) {
              lastRow = this.allServerData.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 500);
    }

    getData(params){

        this.addSub(params)
        
        // //here to call server
        // setTimeout(() => {
        //     console.log(params);
        //     //console.log(params);
        //     var rowsThisPage = this.allServerData.slice(params.startRow, params.endRow);
        //     var lastRow = -1;
        //     if (this.allServerData.length <= params.endRow) {
        //       lastRow = this.allServerData.length;
        //     }
        //     params.successCallback(rowsThisPage, lastRow);
        //   }, 500);
    }
}
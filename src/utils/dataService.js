export default class DataService {

    allServerData = null;
    timerId = null;
    subscriptions = [];
    dataBlocks = [];

    serverPrice = 100;

    dataUpdatedCallback = ()=>{}

    constructor() {
        fetch('http://localhost:8080/info.json')
                  .then(result => result.json())
                  .then(rowData => {
                    this.allServerData = rowData
                    console.log(this.allServerData)
                    console.log("server data loaded to emulator")
                  })
        this.timerId = setInterval(this.updatePrices, 1000, this);
      }

    updatePrices(context)
    {
        //This emulates server changed the data
        context.serverPrice++;
        context.allServerData.forEach(item => {
            item.price = context.serverPrice;// Math.floor(Math.random() * Math.floor(100000))
        });

        //this emulates server sent to client subscription response for each subscribed block 
        context.subscriptions.forEach(sub => {
            context.getServerData(sub)
        })
    }

    syncCacheWithSubs(cache, calledBlock){
        let cvs = Object.values(cache)
        console.log("cache")
        console.log(cvs)
        console.log("this.subscriptions")
        console.log(this.subscriptions)

        this.subscriptions = this.subscriptions.filter(sub => {
            return cvs.some(newSub => newSub.startRow == sub.startRow);
        });

        this.addSub(calledBlock)
    }

    addSub(newSub){
        console.log("newSub")
        console.log(newSub)

        if (this.subscriptions.every(sub => sub.startRow != newSub.startRow && sub.endRow != newSub.endRow)){
            this.subscriptions.push({...newSub})
        }

        console.log(this.subscriptions)
    }

    getServerData(params) {
        // This emulates that server prior to sending response filtered and sorted it to a block 
        // (for simplicity is done on client)
        setTimeout(() => {
            var rowsThisPage = this.allServerData.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (this.allServerData.length <= params.endRow) {
              lastRow = this.allServerData.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 100); //made 100 here because data sets are pushed not pulled

    }

    getData(cache, newBlock){
        this.syncCacheWithSubs(cache, newBlock)
    }
}
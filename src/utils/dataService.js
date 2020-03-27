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
        context.serverPrice++;
        context.allServerData.forEach(item => {
            item.price = context.serverPrice;// Math.floor(Math.random() * Math.floor(100000))
        });
        //console.log(context)

        context.subscriptions.forEach(sub => {
            //console.log("server updates prices for startRow" + sub.startRow)
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
        //here to call server
        setTimeout(() => {
            //console.log(params);
            //console.log(params);
            var rowsThisPage = this.allServerData.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (this.allServerData.length <= params.endRow) {
              lastRow = this.allServerData.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 10); //made 100 here because data sets are pushed not pulled

    }

    getData(cache, newBlock){
        this.syncCacheWithSubs(cache, newBlock)
    }
}
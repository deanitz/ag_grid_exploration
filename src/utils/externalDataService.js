export default class ExternalDataService {

    allServerData = null;
    serverPrice = 100;
    timerId = null;
    subscriptions = [];
    notifyClient;

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

      getServerData(sub) {
        // This emulates that server prior to sending response filtered and sorted it to a block 
        setTimeout(() => {
            var rowsThisPage = this.allServerData.slice(sub.startRow, sub.endRow);
            var lastRow = -1;
            if (this.allServerData.length <= sub.endRow) {
              lastRow = this.allServerData.length;
            }
            if (this.notifyClient)
            {
                this.notifyClient(sub, rowsThisPage, lastRow);
            }
            
          }, 100); //made 100 here because data sets are pushed not pulled

    }
}
export default class DataService {

    allServerData = null;
    timerId = null;
    subscriptions = [];

    constructor() {
        fetch('http://localhost:8080/info.json')
                  .then(result => result.json())
                  .then(rowData => {
                    this.allServerData = rowData
                    this.timerId = setInterval(this.updatePrices, 2000);
                    console.log(this.allServerData)
                    console.log("server data loaded to emulator")
                  })
      }

    updatePrices()
    {
        this.allServerData.forEach(item => {
            item.price = Math.floor(Math.random() * Math.floor(100000))
        });
    }

    subscribeServerPart(params)
    {
        
    }

}
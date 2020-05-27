import ExternalDataService from './externalDataService.js'

export default class InternalDataService {

    externalDataService = new ExternalDataService();
    subscriptions = [];

    constructor() {
        this.externalDataService.notifyClient = this.notifyGrid
      }

    notifyGrid(sub, rowsThisPage, lastRow)
    {
        let internalSub = this.subscriptions.find(intSub => intSub.startRow == sub.startRow && intSub.endRow == sub.endRow)

        if(internalSub)
        {
            if(typeof internalSub.successCallback === "function")
            {
                internalSub.successCallback(rowsThisPage, lastRow)
            }
            else
            {
                console.log("skip callback as it is already unsubscribed")
            }
        }
        else
        {
            console.log("subscription has been removed")
        }
        
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

        this.externalDataService.subscriptions = this.externalDataService.subscriptions.filter(sub => {
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
        if (this.externalDataService.subscriptions.every(sub => sub.startRow != newSub.startRow && sub.endRow != newSub.endRow)){
            this.externalDataService.subscriptions.push({...newSub})
        }

        console.log(this.subscriptions)
    }

    getData(cache, newBlock){
        this.syncCacheWithSubs(cache, newBlock)
    }
}
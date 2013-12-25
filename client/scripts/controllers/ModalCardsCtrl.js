collaborativeMindsApp.controller("ModalCardsCtrl", function (LogSvc) {
	this.ok = function () {
        LogSvc.write("clicked Save!");
        //$modalInstance.dismiss("ok")
    };

    this.cancel = function () {
        LogSvc.write("clicked Cancel!");
        //$modalInstance.dismiss("cancel");
    };
});

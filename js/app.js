async function runAxios() {
    try{
        const axiosData = {
            "bat": {},
            "tem": {},
            "neg": {}
        };

        const Axios = await axios.all([
            axios.get('https://broker.batexchange.com.br/api/v3/ethbrl/ticker'),
            axios.get('https://broker.tembtc.com.br/api/v3/ethbtc/ticker'),
            axios.get('https://broker.tembtc.com.br/api/v3/btcbrl/ticker'),
            axios.get('https://broker.negociecoins.com.br/api/v3/btcbrl/ticker')
        ])

        axiosData["bat"]["eth"] = Axios[0].data;
        axiosData["tem"]["eth"] = Axios[1].data;
        axiosData["tem"]["btc"] = Axios[2].data;
        axiosData["neg"]["btc"] = Axios[3].data;

        return axiosData;
    }
    catch (e)
    {
        alert('Something Wrong happen, contact the administrator!')
    }

    
}

function calculateRewardCicleTN(axiosData, cicleTN, config)
{
    var cfFoundEnter   = config.FoundEnter;
    var cfOfferAct     = config.OfferAct;
    var cfOfferPass    = config.OfferPass;
    var cfWithdrawFiat = config.WithdrawFiat;
    var cfWithdrawCrypto = config.WithdrawCrypto;

    cfOfferAct     = cfOfferAct / 100;
    cfOfferPass    = cfOfferPass / 100;
    cfWithdrawFiat = cfWithdrawFiat / 100;

    var totalBuyedBtc = (+cfFoundEnter / +axiosData.tem.btc["last"]).toFixed(8); 
    
    var comissionTem = (+totalBuyedBtc * +cfOfferAct).toFixed(8);
    
    totalBuyedBtc = (+totalBuyedBtc - +comissionTem).toFixed(8);
    
    totalBuyedBtc = (+totalBuyedBtc - +cfWithdrawCrypto).toFixed(8);
    

    var totalReceivedMoney = (+totalBuyedBtc * +axiosData.neg.btc["last"]).toFixed(2);
    
    var comissionNeg = (+totalReceivedMoney * +cfOfferAct).toFixed(2);
    
    totalReceivedMoney = (+totalReceivedMoney - +comissionNeg).toFixed(2);
    
    var withdrawTaxBrl = (+totalReceivedMoney * +cfWithdrawFiat).toFixed(2);

    totalReceivedMoney = (+totalReceivedMoney - +withdrawTaxBrl).toFixed(2);

    const cicle = {
        enterTN              :   cfFoundEnter,
        BrlRewardTN          :   (+totalReceivedMoney - +cfFoundEnter).toFixed(2),
        outTN                :   totalReceivedMoney,
        PercentRewardTN      :   ((+totalReceivedMoney - +cfFoundEnter) / +totalReceivedMoney ) * 100,
        BtcTaxTN             :   comissionTem,
        BrlTaxTN             :   comissionNeg
    }
    
    return cicle
}

function calculateRewardCicleBTN(axiosData, cicleBTN, config)
{
    var cfFoundEnter   = config.FoundEnter;
    var cfOfferAct     = config.OfferAct;
    var cfOfferPass    = config.OfferPass;
    var cfWithdrawFiat = config.WithdrawFiat;
    var cfWithdrawCrypto = config.WithdrawCrypto;

    cfOfferAct     = cfOfferAct / 100;
    cfOfferPass    = cfOfferPass / 100;
    cfWithdrawFiat = cfWithdrawFiat / 100;


    var buyedEthereum = (+cfFoundEnter / +axiosData.bat.eth["last"]).toFixed(8);
    var comissionBat = (+buyedEthereum * +cfOfferAct).toFixed(8);
    buyedEthereum = (+buyedEthereum - +comissionBat).toFixed(8);
    buyedEthereum = (+buyedEthereum - +cfWithdrawCrypto).toFixed(8);
    console.log("Saindo da Bat com: ", buyedEthereum)

    var buyedBitcoin = (+axiosData.tem.eth["last"] * +buyedEthereum).toFixed(8);
    console.log('Posso Comprar tantos BTCS: ', buyedBitcoin)
    var comissionTem = (+buyedBitcoin * +cfOfferAct).toFixed(8);
    buyedBitcoin = (+buyedBitcoin - +comissionTem).toFixed(8);
    buyedBitcoin = (+buyedBitcoin - +cfWithdrawCrypto).toFixed(8);
    console.log('Saindo da tem com BTCs: ', buyedBitcoin);

    var receivedBrl = (+buyedBitcoin * +axiosData.neg.btc["last"]).toFixed(2);
    console.log('Apos vender os BTC: ', receivedBrl)
    var comissionNeg = (+receivedBrl * +cfOfferAct).toFixed(2);
    receivedBrl = (+receivedBrl - +comissionNeg).toFixed(2);
    console.log('Apos vender os BTC e pagar taxa: ', receivedBrl)
    var withdrawTaxBrl = (+receivedBrl * +cfWithdrawFiat).toFixed(2)
    console.log('Taxa de saque: ', withdrawTaxBrl)
    var moneyTransferBat = (+receivedBrl - +withdrawTaxBrl).toFixed(2);
    console.log('Apos vender os BTC: ', moneyTransferBat)

    let cicle = {
        enterBTN              :   cfFoundEnter,
        BrlRewardBTN          :   (+moneyTransferBat - +cfFoundEnter).toFixed(2),
        outBTN                :   moneyTransferBat,
        PercentRewardBTN      :   ((+moneyTransferBat - +cfFoundEnter) / +moneyTransferBat ) * 100,
        EthTaxBTN             :   comissionBat,
        BtcTaxBTN             :   comissionTem,
        BrlTaxBTN             :   comissionNeg
    }
    
    return cicle
    
}

const app = angular.module('TradeBits', ['ngMask', 'rw.moneymask', 'ui.utils.masks']);

app.controller('TradeBitsCtrl', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout){
    $scope.highETHBat           =   0;
    $scope.lastETHBat           =   0;
    $scope.lowETHBat            =   0;
    $scope.highETHTem           =   0;
    $scope.lastETHTem           =   0;
    $scope.lowETHTem            =   0;
    $scope.highBTCTem           =   0;
    $scope.lastBTCTem           =   0;
    $scope.lowBTCTem            =   0;
    $scope.highBTCNegocieCoins  =   0;
    $scope.lastBTCNegocieCoins  =   0;
    $scope.lowBTCNegocieCoins   =   0;

    $scope.cicleTN = {
        enterTN              :   0,
        outTN                :   0,
        BrlRewardTN          :   0,
        PercentRewardTN      :   0,
        BtcTaxTN             :   0,
        BrlTaxTN             :   0
    }
    $scope.cicleBTN = {
        enterBTN              :   0,
        outBTN                :   0,
        BrlRewardBTN          :   0,
        PercentRewardBTN      :   0,
        EthTaxBTN             :   0,
        BtcTaxBTN             :   0,
        BrlTaxBTN             :   0
    }

    $scope.config = {
        FoundEnter : 100000,
        OfferAct : 0.5,
        OfferPass : 0.3,
        WithdrawCrypto : 0.0005,
        WithdrawFiat : 0.5
    }

    $scope.toastr = {
        "title" : "",
        "msg" : "",
        "time" : new Date()
    }

    Swal.fire({
        title : 'Nova Versão',
        html : 'Nesta nova versão do Trade Bits, vocês podem editar os valores de taxas corretamente, para saber exatamente o quanto você vai ganhar em seus giros. <br> Na próxima versão vem a gamificação dos giros e um acompanhamento histórico de valores em cada um de seus ciclos!!!<br> Pode demorar até 15 segundos o primeiro load de dados!',
        type : 'success'
    })

    $scope.showToast = function (id, title, msg)
    {
        var date = new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        var FinalDate = `${hour}:${minutes}:${seconds}`

        $scope.toastr = {
            "title" : title,
            "msg" : msg,
            "time" : FinalDate 
        }
        $timeout(function(){
            $('#'+id).toast('show')    
        }, 700)
        
        $timeout(function(){  
            $('#'+id).toast('hide')
        }, 4600)
    }

    $scope.loadExchangeData = async function()
    {
        const AxiosData = await runAxios();

        $scope.highETHBat           = AxiosData.bat.eth.high
        $scope.lastETHBat           = AxiosData.bat.eth.last
        $scope.lowETHBat            = AxiosData.bat.eth.low
        $scope.highETHTem           = AxiosData.tem.eth.high
        $scope.lastETHTem           = AxiosData.tem.eth.last
        $scope.lowETHTem            = AxiosData.tem.eth.low
        $scope.highBTCTem           = AxiosData.tem.btc.high
        $scope.lastBTCTem           = AxiosData.tem.btc.last
        $scope.lowBTCTem            = AxiosData.tem.btc.low
        $scope.highBTCNegocieCoins  = AxiosData.neg.btc.high
        $scope.lastBTCNegocieCoins  = AxiosData.neg.btc.last
        $scope.lowBTCNegocieCoins   = AxiosData.neg.btc.low
        
        $scope.cicleTN = calculateRewardCicleTN(AxiosData, $scope.cicleTN, $scope.config);
        console.log($scope.cicleTN);
        $scope.cicleBTN = calculateRewardCicleBTN(AxiosData, $scope.cicleBTN, $scope.config);
        console.log($scope.cicleBTN);

        if($scope.highETHBat)
        {
            console.log($scope.highETHBat)
            $scope.showToast("updateAlert", "Up to Date", "Valores de plataformas Atualizados")
        }
        
    }

    $interval(async function(){
        await $scope.loadExchangeData()
    }, 15000)
    
        
}]);



app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
        }
    };
}]);
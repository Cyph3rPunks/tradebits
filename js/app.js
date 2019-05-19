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
    var cfWithdrawCryptoETH = config.WithdrawCryptoETH

    cfOfferAct     = cfOfferAct / 100;
    cfOfferPass    = cfOfferPass / 100;
    cfWithdrawFiat = cfWithdrawFiat / 100;

    var buyedEthereum = (+cfFoundEnter / +axiosData.bat.eth["last"]).toFixed(8);

    var comissionBat = (+buyedEthereum * +cfOfferAct).toFixed(8);

    buyedEthereum = (+buyedEthereum - +comissionBat).toFixed(8);

    buyedEthereum = (+buyedEthereum - +cfWithdrawCryptoETH).toFixed(8);


    var buyedBitcoin = (+axiosData.tem.eth["last"] * +buyedEthereum).toFixed(8);

    var comissionTem = (+buyedBitcoin * +cfOfferAct).toFixed(8);

    buyedBitcoin = (+buyedBitcoin - +comissionTem).toFixed(8);

    buyedBitcoin = (+buyedBitcoin - +cfWithdrawCrypto).toFixed(8);


    var receivedBrl = (+buyedBitcoin * +axiosData.neg.btc["last"]).toFixed(2);

    var comissionNeg = (+receivedBrl * +cfOfferAct).toFixed(2);

    receivedBrl = (+receivedBrl - +comissionNeg).toFixed(2);

    var withdrawTaxBrl = (+receivedBrl * +cfWithdrawFiat).toFixed(2)

    var moneyTransferBat = (+receivedBrl - +withdrawTaxBrl).toFixed(2);

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

function setHistory(newData, lastData, lastUpdate)
{
    const colorText = "text-";
    const historyObject = {
        "lastUpdate" : lastUpdate.toLocaleTimeString(),
        "batEth": 0,
        "batEthClass": `${colorText}primary`,
        "temEth": 0,
        "temEthClass": `${colorText}primary`,
        "temBtc": 0,
        "temBtcClass": `${colorText}primary`,
        "negBtc": 0,
        "negBtcClass": `${colorText}primary`
    }

    if(
        newData.batEth != lastData.batEth
        || newData.temEth != lastData.temEth
        || newData.temBtc != lastData.temBtc
        || newData.netBtc != lastData.netBtc
      )
    {
        historyObject["batEth"] = newData.batEth;
        historyObject["temEth"] = newData.temEth;
        historyObject["temBtc"] = newData.temBtc;
        historyObject["negBtc"] = newData.negBtc;

        if(newData.batEth > lastData.batEth && lastData.batEth != 0 )
            historyObject["batEthClass"] = `${colorText}success`;
        if(newData.batEth < lastData.batEth && lastData.batEth != 0 )
            historyObject["batEthClass"] = `${colorText}danger`;

        if(newData.temEth > lastData.temEth && lastData.temEth != 0 )
            historyObject["temEthClass"] = `${colorText}success`;
        if(newData.temEth < lastData.temEth && lastData.temEth != 0 )
            historyObject["temEthClass"] = `${colorText}danger`;

        if(newData.temBtc > lastData.temBtc && lastData.temBtc != 0 )
            historyObject["temBtcClass"] = `${colorText}success`;
        if(newData.temBtc < lastData.temBtc && lastData.temBtc != 0 )
            historyObject["temBtcClass"] = `${colorText}danger`;

        if(newData.negBtc > lastData.negBtc && lastData.negBtc != 0 )
            historyObject["negBtcClass"] = `${colorText}success`;
        if(newData.negBtc < lastData.negBtc && lastData.negBtc != 0 )
            historyObject["negBtcClass"] = `${colorText}danger`;

        return historyObject;
    }

    return false;
}

const app = angular.module('TradeBits', ['ngMask', 'rw.moneymask', 'ui.utils.masks']);

app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
});

app.controller('TradeBitsCtrl', ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout){
    $scope.lastUpdate           =   new Date();
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

    $scope.lastETHBatOld;
    $scope.highETHTemOld;
    $scope.lastBTCTemOld;
    $scope.lastBTCNegocieCoinsOld;

    $scope.history = [];

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
        WithdrawCrypto : 0.0003,
        WithdrawCryptoETH : 0.0001,
        WithdrawFiat : 0.5
    }

    $scope.toastr = {
        "title" : "",
        "msg" : "",
        "time" : new Date()
    }

    if( !localStorage.getItem( 'v4Notification' ) ){
      let timerInterval
      Swal.fire({
          title : 'V4 Liberada',
          html : 'Vou Fechar em <strong></strong> segundos.<br><br>Finalmente liberamos o acompanhamento de preços!<br>Breve descrição abaixo.<br><strong>Legenda</strong><ul><li class="text-primary">Azul: O Preço se manteve</li><li class="text-success">Verde: O Preço subiu</li><li class="text-danger">Vermelho: O Preço caiu</li></ul><br><br><strong>Importante: </strong>Dados em cache, o histórico de preço funciona apenas em sua sessão e será limpo caso recarregue ou saia da página, então mantenha-se conectado!',
          type : 'success',
          onBeforeOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                  Swal.getContent().querySelector('strong')
                  .textContent = (Swal.getTimerLeft()/60).toFixed(0)
              }, 100)
          },
          onClose: () => {
              clearInterval(timerInterval)
          },
          showConfirmButton: false,
          customClass: {
              popup: 'animated tada'
          },
          timer: 10000
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

      localStorage.setItem('v4Notification', true);
    }

    $scope.loadExchangeData = async function()
    {
        const AxiosData = await runAxios();

        const newData = {
            "batEth" : AxiosData.bat.eth.last,
            "temEth" : AxiosData.tem.eth.last,
            "temBtc" : AxiosData.tem.btc.last,
            "negBtc" : AxiosData.neg.btc.last
        }
        const lastData = {
            "batEth" : $scope.lastETHBat,
            "temEth" : $scope.lastETHTem,
            "temBtc" : $scope.lastBTCTem,
            "negBtc" : $scope.lastBTCNegocieCoins
        }

        const history = setHistory(newData, lastData, $scope.lastUpdate)

        if(history)
        {
            $scope.showToast("updateAlert", "Up to Date", "Valores de plataformas Atualizados");
            console.log(history);
            $scope.history.push(history);
        }

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

        $scope.cicleBTN = calculateRewardCicleBTN(AxiosData, $scope.cicleBTN, $scope.config);

        $scope.lastUpdate           =   new Date();

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

// let toFloat = str => parseFloat(str.replace(',', '.'));
        $('.money').mask("#.##0,00", {reverse: true});

        function getFloat(str) {
            return parseFloat(str.toString().replace(',', '.'));
        }

        function getTime(time) {
            hora = new Date(time * 1000).toLocaleTimeString();
            return hora;
        }


        new Vue({

            el:'#app',
            data : {
                timer: '',
                refresh: 15,

                totalBtc: 0,
                investimento: 100000,
                precoBtcTem: null,
                precoBtcNegocie: null,
                comissao: 0.005,
                taxa: 0,
                txTransferenciaBtc: 0.0003,
                batTotalCicloBR: 0,
                temTotalCicloBR: 0,
                batTotalCicloBREx: 0,
                temTotalCicloBREx: 0,
                batTotalCicloBRExInvestimento: 0, 
                temTotalCicloBRExInvestimento: 0,

                totalEth: 0,
                totalBr: 0,

                batEthBrlUpdate: true,
                batEthBrlPassiva: false,
                batEthBrl_ultimoPrecoPin: false,
                batEthBrl_ultimoPreco: null,
                batEthBrl_data: null,
                batEthBrl_maiorPreco: null,
                batEthBrl_menorPreco: null,

                temEthBtcUpdate: true,
                temEthBtcPassiva: false,
                temEthBtc_ultimoPrecoPin: false,
                temEthBtc_ultimoPreco: null,
                temEthBtc_data: null,
                temEthBtc_maiorPreco: null,
                temEthBtc_menorPreco: null,

                temBtcBrlUpdate: true,
                temBtcBrlPassiva: false,
                temBtcBrl_ultimoPrecoPin: false,
                temBtcBrl_ultimoPreco: null,
                temBtcBrl_data: null,
                temBtcBrl_maiorPreco: null,
                temBtcBrl_menorPreco: null,

                negocieBtcBrlUpdate: true,
                negocieBtcBrlPassiva: false,
                negocieBtcBrl_ultimoPrecoPin: false,
                negocieBtcBrl_ultimoPreco: null,
                negocieBtcBrl_data: null,
                negocieBtcBrl_maiorPreco: null,
                negocieBtcBrl_menorPreco: null,

                binanceEthBtc_ultimoPreco: null
            },
            // data () {
            //     return {
            //         refresh: 15,
            //
            //         batEthBrl_ultimoPreco: null,
            //         batEthBrl_data: null,
            //         batEthBrl_maiorPreco: null,
            //         batEthBrl_menorPreco: null,
            //
            //         temEthBtc_ultimoPreco: null,
            //         temEthBtc_data: null,
            //         temEthBtc_maiorPreco: null,
            //         temEthBtc_menorPreco: null,
            //
            //         temBtcBrl_ultimoPreco: null,
            //         temBtcBrl_data: null,
            //         temBtcBrl_maiorPreco: null,
            //         temBtcBrl_menorPreco: null,
            //
            //         negocieBtcBrl_ultimoPreco: null,
            //         negocieBtcBrl_data: null,
            //         negocieBtcBrl_maiorPreco: null,
            //         negocieBtcBrl_menorPreco: null
            //     }
            // },

            methods: {
                getTickers(){
                    var that = this;
                    axios.all([
                        axios.get('https://broker.batexchange.com.br/api/v3/ethbrl/ticker'),
                        axios.get('https://broker.tembtc.com.br/api/v3/ethbtc/ticker'),
                        axios.get('https://broker.tembtc.com.br/api/v3/btcbrl/ticker'),
                        axios.get('https://broker.negociecoins.com.br/api/v3/btcbrl/ticker')
                    ])
                        .then(
                            axios.spread(
                                function (getBatEthBrl, getTemEthBtc, getTemBtcBrl, getNegocieBtcBrl) {
                                    if (that.batEthBrlUpdate === true) {
                                        that.batEthBrl_ultimoPreco = getBatEthBrl.data.last,
                                        that.batEthBrl_data = getTime(getBatEthBrl.data.date),
                                        that.batEthBrl_maiorPreco = getBatEthBrl.data.high,
                                        that.batEthBrl_menorPreco = getBatEthBrl.data.low
                                    }
                                    if (that.temEthBtcUpdate === true) {
                                        that.temEthBtc_ultimoPreco = getTemEthBtc.data.last,
                                        that.temEthBtc_data = getTime(getTemEthBtc.data.date),
                                        that.temEthBtc_maiorPreco = getTemEthBtc.data.high,
                                        that.temEthBtc_menorPreco = getTemEthBtc.data.low
                                    }
                                    if (that.temBtcBrlUpdate === true) {
                                        that.temBtcBrl_ultimoPreco = getTemBtcBrl.data.last,
                                        that.temBtcBrl_data = getTime(getTemBtcBrl.data.date),
                                        that.temBtcBrl_maiorPreco = getTemBtcBrl.data.high,
                                        that.temBtcBrl_menorPreco = getTemBtcBrl.data.low
                                    }
                                    if (that.negocieBtcBrlUpdate === true) {
                                        that.negocieBtcBrl_ultimoPreco = getNegocieBtcBrl.data.last,
                                        that.negocieBtcBrl_data = getTime(getNegocieBtcBrl.data.date),
                                        that.negocieBtcBrl_maiorPreco = getNegocieBtcBrl.data.high,
                                        that.negocieBtcBrl_menorPreco = getNegocieBtcBrl.data.low
                                    }

                                }
                            ))

                },
                refreshTickers() {
                    this.getTickers();
                    this.time = setInterval(() => {
                        this.getTickers();
                    }, (this.refresh)*1000);
                },
                cancelRefresh: function() {
                    clearInterval(this.time);
                },

            },
            watch: {
                refresh: function(value) {
                    if (value >= 10) {
                        if(value != this.refresh) {
                            this.refresh = value;
                            this.cancelRefresh();
                            this.refreshTickers();
                        }
                    } else {
                        if(15 != this.refresh) {
                            this.refresh = 15;
                            this.cancelRefresh();
                            this.refreshTickers();
                        }
                    }
                },
            },
            mounted: function() {
                this.refreshTickers();
            },
            beforeDestroy() {
                clearInterval(this.time)
            },

            filters: {
                currencydecimal(value) {
                    return value.toFixed(2)
                }
            },
            computed: {
                lucroTemNegocie: function(){
                    var compare = this.investimento / this.temBtcBrl_ultimoPreco;
                    if(compare != this.totalBtc )
                    {
                        this.totalBtcTem = this.investimento / this.temBtcBrl_ultimoPreco;
                    }

                    if(this.temBtcBrlPassiva)
                        taxa = 0.003
                    else
                        taxa = 0.005
                    
                    if( (this.totalBtcTem * taxa) != this.comissaoTem)
                        this.comissaoTem = this.totalBtcTem * taxa;
                    if(this.totalBtcTem != (this.totalBtcTem - this.comissaoTem) )
                        this.totalBtcTem = this.totalBtcTem - this.comissaoTem;
                    if(this.totalBrTem != (this.totalBtcTem * this.txTransferenciaBtc))
                        this.totalBtcTem = this.totalBtcTem - this.txTransferenciaBtc;
                    if(this.totalBrTem != (this.totalBtcTem * this.negocieBtcBrl_ultimoPreco))
                        this.totalBrTem = this.totalBtcTem * this.negocieBtcBrl_ultimoPreco;
                    
                    if(this.negocieBtcBrlPassiva)
                        taxa = 0.003
                    else
                        taxa = 0.005
                    
                    if( this.comissaoTem != (this.totalBrTem * taxa))
                        this.comissaoTem = this.totalBrTem * taxa;

                    if(this.totalBrTem != (this.totalBrTem - this.comissaoTem))
                        this.totalBrTem = this.totalBrTem - this.comissaoTem;
                    
                    if(this.txTransferenciaBrTem != (this.totalBrTem * 0.005))
                        this.txTransferenciaBrTem = this.totalBrTem * 0.005;
                    
                    
                    this.temTotalCicloBR = this.totalBrTem - this.txTransferenciaBrTem;
                    this.temTotalCicloBREx = this.temTotalCicloBR.toLocaleString();
                    this.temTotalCicloBRExInvestimento = (this.temTotalCicloBR - this.investimento).toLocaleString();
                    this.lucroP = (1 - (this.investimento/this.temTotalCicloBR)) * 100;
                    return this.lucroP.toFixed(4) + '%';
                    
                   
                },
                lucroBatNegocie: function(){
                    this.totalEth = this.investimento/this.batEthBrl_ultimoPreco;
                    this.batEthBrlPassiva ? taxa = 0.003 : taxa = 0.005
                    this.comissao = this.totalEth * taxa;
                    this.totalEth = this.totalEth - this.comissao;
                    this.txTransferenciaEth = 0.00001;

                    //TemBtc
                    this.totalEth = this.totalEth - this.txTransferenciaEth;
                    this.totalBtc = this.temEthBtc_ultimoPreco * this.totalEth;
                    this.temEthBtcPassiva ? taxa = 0.003 : taxa = 0.005
                    this.comissao = this.totalBtc * taxa;
                    this.totalBtc = this.totalBtc - this.comissao;
                    this.txTransferenciaBtc = 0.0003;

                    //Negocie
                    this.totalBtc = this.totalBtc - this.txTransferenciaBtc;
                    this.totalBr = this.totalBtc * this.negocieBtcBrl_ultimoPreco;
                    this.negocieBtcBrlPassiva ? taxa = 0.003 : taxa = 0.005
                    this.comissao = this.totalBr * taxa;
                    this.totalBr = this.totalBr - this.comissao;
                    this.txTransferenciaBr = this.totalBr * 0.005;
                    this.batTotalCicloBR = this.totalBr - this.txTransferenciaBr;
                    this.batTotalCicloBREx = this.batTotalCicloBR.toLocaleString();
                    this.batTotalCicloBRExInvestimento = (this.batTotalCicloBR - this.investimento).toLocaleString();
                    this.lucroP = (1 - (this.investimento/this.batTotalCicloBR)) * 100;
                    return this.lucroP.toFixed(4) + '%';
                }
            }

        });

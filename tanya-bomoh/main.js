var Vue = require('vue');

window.TanyaBomoh = new Vue({
    
    el: '#tanya-bomoh',

    data: {
        appName: '[TanyaBomoh App] ',
        defaultPengeras: 'Bomoh, tolong jawab soalan saya yang berikut',
        defaultPengerasShort: 'Bomoh, tolong jawab soalan',
        inputPengeras: '',
        inputPertanyaan: '',

        periodCount: 0,

        actualAnswer: '',

        modalOptions: {
            backdrop: 'static',
            keyboard: false
        },

        isLoading: true,
        loadingText: '',

        jawapanRandom: [
        	'Ana demam, ana tidak dapat menjawab pertanyaan anak. Minta maaf.',
        	'Ngiat ngen sonnn, matakaji sema ngi sengggg!',
        	'Hancurrrr, hancurrrr aaaakuuu (Fazura)',
        ]
    },

    components: {
        
    },

    computed: {
    	jawapanBomoh: function() {

    		if(!this.isValidatedPengeras()) {
    			return 'Nampaknya anak tidak menyediakan pengeras denga secukupnya. Sila cuba lagi.';
    		}

    		if(this.actualAnswer == '') {

    			return this.jawapanRandom[this.randomIntFromInterval(0,this.jawapanRandom.length-1)];
    		}

    		return this.actualAnswer;
    	}
    },

    init: function() {

    },

    ready: function() {

        this.initWatchers();
        this.initModalListener();

        console.log(this.$root.appName+'Ready');
    },

    props: [

    ],

    methods: {
    	initWatchers: function() {

    		this.$watch('inputPengeras', function(newValue, oldValue) {

	            var newChar = newValue.slice(-1);
	            var actualLength = newValue.length;

	            if(this.periodCount===1) {
	                this.actualAnswer = this.actualAnswer + newChar;
	            }

	            if((this.periodCount===0 && newChar === '.') || this.periodCount===1) {
	                this.$els.inputpengerasdom.value = this.defaultPengeras.slice(0,actualLength);
	            }

	        }.bind(this));
    	},
    	initModalListener: function() {

	        this.modalJawapan = $('#modal-jawapan');
	        this.modalPeringatan = $('#modal-peringatan');

    		this.modalPeringatan.on('hidden.bs.modal', function() {

	        	this.resetField();
	        }.bind(this));
	        
	        this.modalJawapan.on('hidden.bs.modal', function() {

	        	this.resetField();
	        }.bind(this));

	        this.modalJawapan.on('show.bs.modal', function(){

	        	this.isLoading = true;
	        	this.loadingText = 'Bomoh sedang mencari jawapan...';
	        }.bind(this));

	        this.modalJawapan.on('shown.bs.modal', function(){

	        	setTimeout(function(){

	        		this.loadingText = 'Hampir mendapatkan jawapan...';

	        		setTimeout(function(){
	        			
	        			this.isLoading = false;
	        		}.bind(this),3000);
	        	}.bind(this),3000);
	        }.bind(this));
    	},
        isStillValidatedPengeras: function() {

            return (this.defaultPengeras.indexOf(this.inputPengeras.slice(0,-1)) === 0)
        },
        isValidatedPengeras: function() {

            return (this.isStillValidatedPengeras() && (this.inputPengeras === this.defaultPengeras 
                || this.inputPengeras === this.defaultPengerasShort))
        },
        clearField: function(e) {

            e.preventDefault();
            this.resetField();
        },
        resetField: function() {

            this.totalClear();
            this.$els.inputpengerasdom.focus();
        },
        pengerasChangedHandler: function() {

            if( this.isStillValidatedPengeras()
                || this.periodCount == 1) {

                this.periodCount++;
            }
        },
        pengerasChangedEnterHandler: function() {

            this.$els.inputpertanyaandom.focus();
        },
        pengerasTryToDeleteHandler: function(e) {

            e.preventDefault();
            this.modalPeringatan.modal(this.modalOptions);
        },
        totalClear: function() {

            this.inputPengeras = '';
            this.inputPertanyaan = '';
            this.actualAnswer = '';
            this.periodCount = 0;
        },
        tanyaClickHandler: function(e) {

            e.preventDefault();

            if(this.isValidatedFields()) {
                this.modalJawapan.modal(this.modalOptions);
            }
        },
        isValidatedFields: function() {

            if(this.inputPengeras == '' || this.inputPertanyaan == '')
                return false;

            return true;
        },
        /**
         * To get random number between min and max
         *
         * @param min
         * @param max
         * @return Random number between min and max
         * @source http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
         */
        randomIntFromInterval: function(min,max)
		{
		    return Math.floor(Math.random()*(max-min+1)+min);
		}
    }, 

    events: {
    }
});


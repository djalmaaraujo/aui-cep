/**
 * The CEP informations to Brazil Addresses
 *
 * @module aui-cep
 *
 * TODO:
 * - Escolher um webservice bem utilizado para usar como padrão;
 *
 */

var
    Lang = A.Lang
    Node = A.Node,
    JSONP = A.jsonp,

    CEP = 'Cep',
    WEBSERVICE_URL = 'http://jsfiddle.net/echo/jsonp/',
    WEBSERVICE_PARAM_NAME = '?cep=',
    WEBSERVICE_REQUEST_TYPE = 'GET',
    DEFAULT_REPONSE_TEMPLATE = {
        cep_number: '',
        state: '',
        city: '',
        district: '',
        street_type: '',
        street: ''
    };

var Cep = A.Component.create(
    {
        NAME: CEP,

        EXTENDS: A.Base,

        ATTRS: {

            /**
             * The web service URL for requests
             *
             * @attribute webService
             * @default http://jsfiddle.net/echo/jsonp/?callback={callback}
             * @type String
             */
            webService: {
                value: WEBSERVICE_URL
            },

            /**
             * The param name used in URL request.
             * Example: ?cep=XXXX. The 'cep' param can change if a new
             * webService are used.
             *
             * @attribute queryParams
             * @default cep
             * @type String
             */
            queryParams: {
                value: WEBSERVICE_PARAM_NAME
            },

            /**
             * The default request TYPE. GET / POST.
             *
             * @attribute requestType
             * @default GET
             * @type String
             */
            requestType: {
                value: WEBSERVICE_REQUEST_TYPE
            },

            /**
             * The default response body template provided by the webservice
             *
             * @attribute responseBodyTemplate
             * @default DEFAULT_REPONSE_TEMPLATE
             * @type Object
             */
            responseBodyTemplate: {
                value: DEFAULT_REPONSE_TEMPLATE
            },

            /**
             * The current CEP to search information
             *
             * @attribute cep
             * @default false
             * @type String
             */
            cep: {
                value: false
            }
        },

        prototype: {
            /**
             * Initializes the componente. Lifecycle
             *
             * @method initializer
             */
            initializer: function () {
                var instance = this,
                    nodeTarget = instance.get('nodeTarget');

                if (nodeTarget) {
                    instance.set('nodeTarget', Node(nodeTarget));
                    instance._createRenderTemplate();
                }

                instance.urlBase = instance.get('webService') + instance.get('queryParams') + instance.get('cep') + '&callback={callback}';
            },

            /**
             * Create a template based on nodeTemplate attribute
             *
             * @method _createRenderTemplate
             * @protected
             */
            _createRenderTemplate: function () {
                var instance = this;

                instance.template = Template(instance.get('nodeTemplate'));
            },

            /**
             * Request data from webservice passing CEP param
             *
             * @method _request
             * @param {Function} fn
             * @protected
             */
            _request: function (fn) {
                var instance = this;

                JSONP(instance.urlBase, {
                    on: {
                        success: function (response) {
                            fn.call(instance, instance._createResponseObject(response));
                        }
                    },
                    timeout: 3000
                });
            },

            /**
             * Create a object with the requested data from webservice
             *
             * @method _createResponseObject
             * @param {Object} response, {Function} fn
             * @protected
             */
            _createResponseObject: function (response, fn) {
                var instance = this,
                    bodyResponseTemplate = DEFAULT_REPONSE_TEMPLATE,
                    userResponseObjectTemplate = instance.get('responseBodyTemplate'),
                    responseObject = {};

                A.each(bodyResponseTemplate, function(obj, index) {
                    responseObject[index] = response[userResponseObjectTemplate[index]];
                });

                responseObject.cep_number = this.get('cep');
                return responseObject;
            },

            /**
             * Users method to perform request to webservice and return
             * the json object.
             *
             * @method getCep
             * @param {Boolean} forceRender
             * @public
             */
            getCep: function (fn) {
                var instance = this;

                instance._request(function() {
                    if (Lang.isFunction(fn)) {
                        fn.apply(instance, arguments);
                    }
                });
            }
        }
    }
);

A.Cep = Cep;
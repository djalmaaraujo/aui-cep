# AUI-CEP

**An Alloy UI Component to request Brazilian CEP information**

## Configuration with no yui3-gallery CDN
You can configure as an "lazy-load" module, using YUI Loader, preventing sync bad loading files.

	AUI({
		modules: { 
			'aui-cep': {
				fullpath: '../../build/aui-cep/aui-cep.js',
				requires: ['aui-base','jsonp']
			}
		}	}).use('aui-cep', function (Y) {
		// Your code goes here	});

## Usage

	AUI().ready('aui-cep', 'aui-template', function(A) {
		var component = new A.Cep(
			{
				cep: '54410220',
				nodeTarget: '#demo',
				webService: 'http://localhost/cep.php',
				responseBodyTemplate: {
					cep_number: 'cep',
			        state: 'uf',
			        city: 'cidade',
			        district: 'bairro',
			        street_type: 'tipo_logradouro',
			        street: 'logradouro'
				}
			}
		);
	
		var cep = null;
		component.getCep(function(data) {
			cep = data;
	
			// Logs CEP
			console.log(cep);
	
			// Using with Alloy Template
			var tpl = A.one('#sampleTpl').toTPL();
			tpl.render(cep, A.one('#demo'));
	
		});
	});
	
	

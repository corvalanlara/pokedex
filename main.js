/* jshint esversion: 6 */
var app = new Vue({
	el: "#app",
	data: {
			nombre : null,
			peso: null,
			altura: null,
			imagenes: [],
			imagenSeleccionada: 0,
			habilidades: null,
	},
	mounted() {
				fetch("https://pokeapi.co/api/v2/pokemon/ditto/")
				.then(function(resp) { return resp.json();})
				.then(function(da) {
					console.log(this);
        				this.app.nombre =  da.name;
        				this.app.peso =  da.weight;
        				this.app.altura =  da.height;
        				this.app.imagenes.push(da.sprites.front_default);
        				this.app.imagenes.push(da.sprites.back_default);
        				this.app.habilidades = da.abilities;
				});
	},
	methods: {
		cambiarImagen(index) {
			this.imagenSeleccionada = index;
		},
	},
	computed: {
		imagen() {
			return this.imagenes[this.imagenSeleccionada];
		}
	}
});

//var busqueda = new Vue({
//	el: '#busqueda',
//	data: {
//		url: 'https://pokeapi.co/api/v2/pokemon/ditto/',
//		lista: null,
//	},
//	mounted() {
//			fetch('150.json')
//			.then(function(resp) { return resp.json(); })
//			.then(function(da) {
//				this.lista = da.results;
//			});
//	}
//});

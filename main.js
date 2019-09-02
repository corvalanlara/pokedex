/* jshint esversion: 6 */
Vue.component('detalle', {
	template: `
	<div class="detalle">
	<p class="poke-nombre">{{ nombre }}</p>
	<img :src="imagen">
	<p>Peso: {{ peso }}</p>
	<p>Altura: {{ altura }}</p>
	<ul class="poke-thumbnails">
		<li v-for="(parte, index) in imagenes"
      			:key="index"
			@mouseover="cambiarImagen(index)">
		<img class="imagen-box" :src="parte">
		</li>
	</ul>
	<ul class="poke-habilidades">
		<li v-for="habilidad in habilidades">
			{{ habilidad.ability.name}}
		</li>
	</ul>
	</div>
	`,
	data() { 
		return {
			nombre : null,
			peso: null,
			altura: null,
			imagenes: [],
			imagenSeleccionada: 0,
			habilidades: null,
		};
	},
	mounted() {
				fetch("https://pokeapi.co/api/v2/pokemon/ditto/")
				.then(function(resp) { return resp.json();})
				.then(function(da) {
					console.log(da);
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
		},
	},
});

var app = new Vue({
	el: '#app',
	data: {
		url: 'https://pokeapi.co/api/v2/pokemon/ditto/',
		lista: null,
	},
	mounted() {
			fetch('150.json')
			.then(function(resp) { return resp.json(); })
			.then(function(da) {
				this.app.lista = da.results;
			});
	}
});

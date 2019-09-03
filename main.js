/* jshint esversion: 6 */

Vue.component('detalle', {
	props: {
		url: {
			type: String,
			required: true,
			immediate: true,
		},
	},
	watch: {
		url: function() { this.descargarData();},
	},
	template: `
	<div class="detalle" v-if="url">
	<p class="poke-nombre">{{ nombre }}</p>
	<img :src="imagen" v-if="imagenes.length">
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
			loading: false,
			error: null,
		};
	},
	created() {
		this.descargarData();
	},
	methods: {
		cambiarImagen(index) {
			this.imagenSeleccionada = index;
		},
		descargarData() {
				this.loading = true;
				fetch(this.url)
				.then(function(resp) {
					this.app.$children[0].loading = false;
					return resp.json(); })
				.then(function(da) {
        				this.app.$children[0].nombre =  da.name;
        				this.app.$children[0].peso =  da.weight;
        				this.app.$children[0].altura =  da.height;
					this.app.$children[0].imagenes = [];
					if (da.sprites.front_default) {
        				this.app.$children[0].imagenes.push(da.sprites.front_default);
					}
					if (da.sprites.back_default) {
        				this.app.$children[0].imagenes.push(da.sprites.back_default);
					}
        				this.app.$children[0].habilidades = da.abilities;
				});

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
		url: null,
		lista: null,
		indice: 0,
	},
	created() {
			fetch('150.json')
			.then(function(resp) { return resp.json(); })
			.then(function(da) {
				this.app.lista = da.results;
				this.app.lista.unshift({'name': 'Selecciona', 'url': ''});
			});
	},
	methods: {
		onChange(value) {
			if (value && value != 0) {
				this.url = this.lista[value].url;
			}
		},
	},
});

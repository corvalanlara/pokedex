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
	<p>Weight: {{ peso }} kg.</p>
	<p>Height: {{ altura }} cm.</p>
	<p v-for="tipo in tipos">{{ tipo }}</p>
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
			id: null,
			nombre : null,
			peso: null,
			altura: null,
			imagenes: [],
			imagenSeleccionada: 0,
			habilidades: null,
			loading: false,
			error: null,
			tipos: [],
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
        				this.app.$children[0].id =  da.id;
        				this.app.$children[0].nombre =  da.name;
        				this.app.$children[0].peso =  da.weight * 0.1; //valor original en hectogramos
        				this.app.$children[0].altura =  da.height * 10; //valor original en decimetros
					this.app.$children[0].imagenes = [];
					if (da.sprites.front_default) {
        				this.app.$children[0].imagenes.push(da.sprites.front_default);
					}
					if (da.sprites.back_default) {
        				this.app.$children[0].imagenes.push(da.sprites.back_default);
					}
        				this.app.$children[0].habilidades = da.abilities;
        				this.app.$children[0].tipos = [];
					for(var x of da.types) {
        					this.app.$children[0].tipos.push(x.type.name);
					}
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
			fetch('150lite.json')
			.then(function(resp) { return resp.json(); })
			.then(function(da) {
				this.app.lista = da;
				this.app.lista.unshift({'name': 'Choose one', 'url': ''});
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

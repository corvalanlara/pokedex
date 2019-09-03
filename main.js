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
		<div class="poke-visual">
			<img class="poke-imagen" :src="imagen" v-if="imagenes.length">
			<ul class="poke-thumbnails">
				<li v-for="(parte, index) in imagenes"
		      			:key="index"
					@mouseover="cambiarImagen(index)">
				<img class="imagen-box" :src="parte">
				</li>
			</ul>
		</div>
	<p class="poke-peso">Weight: {{ peso }} kg.</p>
	<p class="poke-altura">Height: {{ altura }} cm.</p>
	<p class="poke-tipo" v-for="tipo in tipos">{{ tipo }}</p>

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
				let este = this;
				fetch(this.url)
				.then(function(resp) {
					este.loading = false;
					return resp.json(); })
				.then(function(da) {
        				este.id =  da.id;
        				este.nombre =  da.name;
        				este.peso =  da.weight * 0.1; //valor original en hectogramos
        				este.altura =  da.height * 10; //valor original en decimetros
					este.imagenes = [];
					if (da.sprites.front_default) {
        				este.imagenes.push(da.sprites.front_default);
					}
					if (da.sprites.back_default) {
        				este.imagenes.push(da.sprites.back_default);
					}
        				este.habilidades = da.abilities;
        				este.tipos = [];
					for(var x of da.types) {
        					este.tipos.push(x.type.name);
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
	watch: {
		selected: function(value) { this.onChange(value);},
	},
	data: {
		url: null,
		data: [],
		lista: null,
		indice: 0,
		name: '',
		selected: null,
	},
	created() {
			let este = this;
			fetch('150.json')
			.then(function(resp) { return resp.json(); })
			.then(function(da) {
				este.lista = da.results;
				for (let i of da.results) {
					este.data.push(i.name);
				}
			});
	},
	methods: {
		onChange(value) {
			if (value) {
				let indice = this.data.indexOf(value);
				this.url = this.lista[indice].url;
			}
		},
	},
	computed: {
            filteredDataArray() {
                return this.data.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.name.toLowerCase()) >= 0;
                });
            }
        },
});

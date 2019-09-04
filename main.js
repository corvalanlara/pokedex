/* jshint esversion: 6 */
String.prototype.capitalizar = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

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
		<div class="detalle tile is-ancestor">
			<div class="tile is-4 is-vertical is-parent">
				<div class="poke-visual tile is-child">
					<img class="poke-imagen" :src="imagen" v-if="imagenes.length">
				</div>
				<div class="poke-visual tile is-child">
					<div class="poke-thumbnails" v-if="!noimage">
						<span v-for="(parte, index) in imagenes"
				      			:key="index"
							@mouseover="cambiarImagen(index)">
							<img class="imagen-box" :src="parte">
						</span>
					</div>
				</div>
			</div>
			<div class="poke-datos tile is-vertical is-parent">
				<div class="tile is-child">
					<p class="poke-peso"><strong>Weight:</strong><br>{{ peso }} kg.</p>
					<p class="poke-altura"><strong>Height:</strong><br>{{ altura }} cm.</p>
				</div>
			</div>
			<div class="tile is-vertical is-parent">
				<div class="tile is-child">
					<span><strong>Type:</strong><br></span>
					<span class="poke-tipo" v-for="tipo in tipos">
						{{ tipo }}<br></span>
						<br>
					<span><strong>Abilities:</strong><br></span>
					<span 
					class="poke-habilidad" 
					v-for="habilidad in habilidades">
						{{ habilidad.ability.name}}<br></span>
				</div>
			</div>
		</div>
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
			noimage: true,
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
				this.noimage = true;
				this.loading = true;
				let este = this;
				fetch(this.url)
				.then(function(resp) {
					este.loading = false;
					return resp.json(); })
				.then(function(da) {
        				este.id =  da.id;
        				este.nombre =  da.name;
        				este.peso = (da.weight * 0.1).toFixed(1); //valor original en hectogramos
        				este.altura = (da.height * 10)toFixed(1); //valor original en decimetros
					este.imagenes = [];
					if (da.sprites.front_default) {
						este.noimage = false;
        					este.imagenes.push(da.sprites.front_default);
					} else {
						este.imagenes.push('noimage.png');
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
			fetch('todos.json')
			.then(function(resp) { return resp.json(); })
			.then(function(da) {
				este.lista = da.results;
				for (let i of da.results) {
					este.data.push(i.name.capitalizar());
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

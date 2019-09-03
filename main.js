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
		data: ["Choose One", "Abra", "Aerodactyl", "Alakazam", "Arbok", "Arcanine", "Articuno", "Beedrill", "Bellsprout", "Blastoise", "Bulbasaur", "Butterfree", "Caterpie", "Chansey", "Charizard", "Charmander", "Charmeleon", "Clefable", "Clefairy", "Cloyster", "Cubone", "Dewgong", "Diglett", "Ditto", "Dodrio", "Doduo", "Dragonair", "Dragonite", "Dratini", "Drowzee", "Dugtrio", "Eevee", "Ekans", "Electabuzz", "Electrode", "Exeggcute", "Exeggutor", "Farfetchd", "Fearow", "Flareon", "Gastly", "Gengar", "Geodude", "Gloom", "Golbat", "Goldeen", "Golduck", "Golem", "Graveler", "Grimer", "Growlithe", "Gyarados", "Haunter", "Hitmonchan", "Hitmonlee", "Horsea", "Hypno", "Ivysaur", "Jigglypuff", "Jolteon", "Jynx", "Kabuto", "Kabutops", "Kadabra", "Kakuna", "Kangaskhan", "Kingler", "Koffing", "Krabby", "Lapras", "Lickitung", "Machamp", "Machoke", "Machop", "Magikarp", "Magmar", "Magnemite", "Magneton", "Mankey", "Marowak", "Meowth", "Metapod", "Mewtwo", "Moltres", "Mr-Mime", "Muk", "Nidoking", "Nidoqueen", "Nidoran-F", "Nidoran-M", "Nidorina", "Nidorino", "Ninetales", "Oddish", "Omanyte", "Omastar", "Onix", "Paras", "Parasect", "Persian", "Pidgeot", "Pidgeotto", "Pidgey", "Pikachu", "Pinsir", "Poliwag", "Poliwhirl", "Poliwrath", "Ponyta", "Porygon", "Primeape", "Psyduck", "Raichu", "Rapidash", "Raticate", "Rattata", "Rhydon", "Rhyhorn", "Sandshrew", "Sandslash", "Scyther", "Seadra", "Seaking", "Seel", "Shellder", "Slowbro", "Slowpoke", "Snorlax", "Spearow", "Squirtle", "Starmie", "Staryu", "Tangela", "Tauros", "Tentacool", "Tentacruel", "Vaporeon", "Venomoth", "Venonat", "Venusaur", "Victreebel", "Vileplume", "Voltorb", "Vulpix", "Wartortle", "Weedle", "Weepinbell", "Weezing", "Wigglytuff", "Zapdos", "Zubat"],
		lista: null,
		indice: 0,
		name: '',
		selected: null,
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

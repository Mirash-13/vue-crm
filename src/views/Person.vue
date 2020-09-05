<template>
    <div class="person">
        <template v-if="!notFound">
			<div class="header">
				<div class="block user-info">
					<div class="option">
						<span class="title">Ім'я: </span>
						<span class="value">
							{{ person.name }}
						</span>
					</div>
					<div class="option">
						<span class="title">Професія: </span>
						<span class="value">
							{{ person.career }}
						</span>
					</div>
					<div class="option">
						<span class="title">Дата: </span>
						<span class="value">
							{{ person.birth_date }}
						</span>
					</div>
					<div class="option">
						<span class="title">Професія: </span>
						<span class="value">
							{{ person.serial_number }}
						</span>
					</div>
				</div>
				<div class="block home">
					+
					<span>
						Житло
					</span>
				</div>
				<div class="block salary">
					<div class="title">
						Зарплата
						<span>
							100 крон\год
						</span>
					</div>
					<v-button>
						Розрхувати
					</v-button>
				</div>
			</div>

			<div class="body">
				<prepayment :info="{ personName, folderTitle }" :prepayments="person.prepayments"></prepayment>
			</div>
		</template>

		<div class="not-found" v-else>
			не знайдено
		</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VButton from '../components/VButton'
import Prepayment from '../components/Prepayment'

export default {
	name: "Person",
	data: () =>({
		person: {},
		notFound: false
	}),
	methods: {
		queryFolder(folderTitle, personName) {
			let folder = this.folders.filter(folder => folder.title === folderTitle)[0]
			if ( folder ) {
				let person = folder.people.filter(person => person.name === personName)[0]
				if ( person ) {
					this.person = person
					this.notFound = false
				} else {
					this.notFound = true
				}
			} else {
				this.notFound = true
			}
		},
	},
    computed: {
		...mapGetters(["folders"]),
		folderTitle() {
			return this.$route.query.folder
		},
		personName() {
			return this.$route.query.person
		}
	},
    watch: {
		folderTitle(val) {
			this.queryFolder(val, this.$route.query.person)
		},
		personName(val) {
			this.queryFolder(this.$route.query.folder, val)
		},
		folders() {
			this.queryFolder(this.$route.query.folder, this.$route.query.person)
		},
	},
	mounted() {
		this.queryFolder(this.$route.query.folder, this.$route.query.person)
	},
	components: {
		VButton,
		Prepayment
	}
};
</script>

<style lang="scss" scoped>
.person {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background: #e6e6e6;
  border-radius: 8px;
  color: #1D2D36;
  display: flex;
  flex-direction: column;
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .header {
	display: flex;
	width: 100%;
	justify-content: space-around;
	height: 150px;
	.block {
		width: 30%;
		margin: 10px 0;
		border-radius: 14px;
		box-shadow: 0 0 3px rgb(148, 148, 148);
		padding: 5px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		transition: .2s ease;
		&.salary {
			align-items: center;
		}
		.option {
			display: flex;
			justify-content: space-between;
			span {
				width: 50%;
			}
			.title {
				font-weight: bold;
				text-align: left;
				font-size: 16px;
			}
			.value {
				font-size: 14px;
			}
		}
		&:hover {
			background-color: rgb(218, 218, 218);
			transition: .2s ease;
		}
	}
  }
  .body {
	height: 100%;
  }
}
</style>
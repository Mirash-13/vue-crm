<template>
    <div class="person">
        <template v-if="!notFound">
			<div class="header">
				<div v-tilt="tilt" class="block user-info">
					<div class="container">
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
							<span class="title">Паспорт: </span>
							<span class="value">
								{{ person.serial_number }}
							</span>
						</div>
					</div>
				</div>
				<div v-tilt="tilt" class="block home">
					<div class="container">
						<div class="title">
							Житло
						</div>
						<button>
							+
						</button>
					</div>
				</div>
				<div v-tilt="tilt" class="block salary">
					<div class="container">
						<div class="title">
							Зарплата
							<span>
								{{ person.summ_for_hour }} крон\год
							</span>
						</div>
						<button @click="showModal = true">
							Розрхувати
						</button>
					</div>
				</div>
			</div>

			<div class="body">
				<prepayment :info="{ personName, folderTitle, personId: person.id }"
					:prepayments="sortedPrepayment"
					@changeTypeOfPrepayments="(type) => typeOfPrepayments = type"
					:typeOfPrepayments="typeOfPrepayments"
				></prepayment>
			</div>
		</template>

		<div class="not-found" v-else>
			не знайдено
		</div>

		<transition name="modal-fade">
			<ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
				v-if="showModal"
			>
				<template #modal>
					<div class="modal modal-prepayment">
						<div class="content">
							<div class="title">Додавання авансу</div>
							<div class="input">
								<div class="item summ">
									<label for="summ">Кількість вироблених годин:</label>
									<input type="number" v-model="hoursWorked" id="summ">
								</div>

								<div class="item">
									<label for="salaryHour">Сума зарплати за вироблені години:</label>
									<input type="text" :value="getSalaryForHours" disabled id="salaryHour">
								</div>

								<div class="item">
									<label for="salaryPrepayment">Розраховано за авансами:</label>
									<input type="text" :value="getSalaryForPrepayment" disabled id="salaryPrepayment">
								</div>

								<div class="item">
									<label for="salary">До виплати:</label>
									<input type="text" :value="getSalary" disabled id="salary">
									<div class="error">
										{{ error }}
									</div>
								</div>
							</div>

							<div class="buttons">
								<button class="add" @click="toCalculate">Розрахувати</button>
							</div>
						</div>

						<div class="prepayment">
							<prepayment :info="{ personName, folderTitle, personId: person.id }"
								:prepayments="notClosedPrepayment"
								:typeOfPrepayments="false"
								:forbid="true"
							></prepayment>
						</div>
					</div>
				</template>
			</ModalWindow>
		</transition>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Prepayment from '../components/Prepayment'
import ModalWindow from '../components/ModalWindow'

export default {
	name: "Person",
	data: () =>({
		person: {},
		hoursWorked: "",
		notFound: false,
		showModal: false,
		typeOfPrepayments: false,
		error: "",
		tilt: {
			max: 20,
			speed: 400,
			glare: true,
			"max-glare": 0.8
		},
	}),
	methods: {
		...mapMutations(['closePayment']),
		setSalary(data) {
			return new Promise((resolve, reject) => {
				fetch(`${this.uri}/add_salary/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				})
				.then(res => res.text())
				.then((data) => {
					try {
						resolve(data)
					} catch(err) {
						reject(err)
					}
				})
			});
		},
		toCalculate() {
			if ( this.hoursWorked ) {
				this.setSalary({ workerId: this.person.id, hours: parseInt(this.hoursWorked) })
				.then(() => {
					this.closePayment({ personId: this.person.id, folderTitle: this.folderTitle })
		
					this.showModal = false
		
					this.hoursWorked = ''
				})
				.catch(err => {
					console.error(err)
				})
			} else {
				this.setError('всі поля повинні бути заповнені')
			}
		},
		setError(text) {
			this.error = text
			setTimeout(() => {
				this.error = ""
			}, 5000)
		},
		queryFolder(folderTitle, personId) {
			let folder = this.folders.filter(folder => folder.title === folderTitle)[0]
			if ( folder ) {
				let person = folder.people.filter(person => person.id == personId)[0]
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
		...mapGetters(["folders", 'uri']),
		folderTitle() {
			return this.$route.query.folder
		},
		sortedPrepayment() {
			if ( this.person.prepayments ) {
				return this.person.prepayments.filter(payment => payment.closed === this.typeOfPrepayments)
			} else {
				return []
			}
		},
		notClosedPrepayment() {
			if ( this.person.prepayments ) {
				return this.person.prepayments.filter(payment => !payment.closed)
			} else {
				return []
			}
		},
		personName() {
			return this.$route.query.person
		},
		getSalaryForHours() {
			return this.hoursWorked ? this.person.summ_for_hour * this.hoursWorked : null
		},
		getSalaryForPrepayment() {
			let prepayments = this.person.prepayments.filter(payment => !payment.closed)

			let summ = prepayments.length ? prepayments.reduce((a, b) => ({ summ: a.summ + b.summ })) : { summ: 0 }

			return this.hoursWorked ? summ.summ : null
		},
		getSalary() {
			if ( this.getSalaryForHours !== null && this.getSalaryForPrepayment !== null ) {
				return this.getSalaryForHours - this.getSalaryForPrepayment
			} else {
				return null
			}
		},
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
		Prepayment,
		ModalWindow
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
		width: calc(30% - 15px);
		margin: 10px 0;
		border-radius: 14px;
		box-shadow: 0 0 3px rgb(148, 148, 148);
		padding: 15px;
		transform-style: preserve-3d;
		perspective: 1000px;
		&.user-info {
			.container {
				align-items: normal;
			}
		}
		&:hover {
			background-color: rgb(218, 218, 218);
			transition: .2s ease;
		}
		.container {
			width: 100%;
			height: 100%;
			transition: .2s ease;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			transform: translateZ(20px);
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
		}
	}
  }
  .body {
	height: 100%;
  }
}

.modal-prepayment {
	width: 90vw;
	height: 90vh;
	justify-content: flex-start;
	.content {
		width: 100%;
		.input {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.item {
				width: 48%;
				label, input {
					width: 50% !important;
				}
			}
		}
	}
	.prepayment {
		height: 100%;
		width: 100%;
		.folder {
			background: white !important;
			margin-top: 10px;
		}
	}
}

@media only screen and (max-width: 800px) {
	.block {
		padding: 10px !important;
		font-size: 14px !important;
		.title, .value {
			font-size: 14px !important;
		}
	}
}
@media only screen and (max-width: 700px)  {
	.header {
		height: auto !important;
		flex-wrap: wrap;
		align-items: center;
		.user-info {
			width: calc(100% - 40px) !important;
			.container {
				display: flex;
				flex-direction: row !important;
				flex-wrap: wrap;
				.option {
					width: 50%;
				}
			}
		}
		.home, .salary {
			width: calc(50% - 40px) !important;
			.container {
				display: flex;
				flex-direction: row;
			}
		}
	}
	.modal-prepayment {
		.content {
			.input {
				.item {
					label {
						font-size: 12px;
					}
				}
			}
		}
	}
}
@media only screen and (max-width: 450px)  {
	.header {
		.block {
			.title, .value {
				font-size: 12px !important;
			}
			&:nth-child(1n+2) {
				height: 50px;
			}
		}
	}
	.modal-prepayment {
		.content {
			.input {
				.item {
					width: 100%;
					label {
						font-size: 10px;
					}
				}
			}
			.buttons {
				button {
					width: 80px !important;
				}
			}
		}
	}
}
</style>
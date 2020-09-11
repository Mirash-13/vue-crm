<template>
  <div class="folder">
      <div class="header">
        <div class="top">
          <div class="title">
            Аванси
          </div>

          <div class="actions">
            <div class="dates">
              <input type="datetime-local"
                :value="from"
                @input="updateFromTo($event.target.value, 'from')"
              >
              <span>
                -
              </span>
              <input type="datetime-local"
                :value="to"
                @input="updateFromTo($event.target.value, 'to')"
              >
            </div>
            <input type="search" v-model="search" >
            <button @click="showModal = true" v-if="!forbid">дод. аванс</button>
          </div>
        </div>
        <div class="down mobile">
          <div class="dates">
            <input type="datetime-local"
              :value="from"
              @input="updateFromTo($event.target.value, 'from')"
            >
            <span>
              -
            </span>
            <input type="datetime-local"
              :value="to"
              @input="updateFromTo($event.target.value, 'to')"
            >
          </div>
        </div>
      </div>

    <div class="list" v-if="prepayments">
      <div class="tags" style="--main-color: #1D2D36;" v-if="!forbid">
        <button @click="changeTypeOfPrepayments(true)"
          :class="{ 'active': typeOfPrepayments }"
        >
          Закриті
        </button>
        <button @click="changeTypeOfPrepayments(false)"
          :class="{ 'active': !typeOfPrepayments }"
        >
          Не закриті
        </button>
      </div>
      <table class="content-table" :style="{ '--column-count': tableHeader.length }">
        <thead>
          <tr>
              <th v-for="item in tableHeader"
              :key="`table_header_${item.obj}`"
              >
              <span class="text" @click="changeSort(item)">
                  {{ item.name }}
                  
                  <div v-if="typeOfSort.obj === item.obj"
                  :style="{
                      transform: `rotate(${ typeOfSort.order === 'top' ? 225 : 45 }deg)`
                  }"
                  class="arrow"
                  ></div>
              </span>
              </th>
          </tr>
        </thead>
        <tbody class="scroll">
          <tr v-for="payment in sortedPrepayments" :key="`payment_tr_${payment.id}`">
              <td>{{ payment.id }}</td>
              <td>{{ payment.summ }}</td>
              <td>{{ payment.description }}</td>
              <td>{{ payment.date_of_pay }}</td>
          </tr>
        </tbody>
      </table>
    </div>
      
    <div class="not-found" v-else>
        не знайдено
    </div>

    <transition name="modal-fade">
        <ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
            v-if="showModal"
        >
          <template #modal>
            <div class="modal">
              <div class="title">Додавання авансу</div>
              <div class="input">
                <div class="item summ">
                  <label for="summ">Сумма:</label>
                  <input type="number" v-model="payment.summ" id="summ">
                </div>

                <div class="item prepayment">
                  <label for="prepayment">Опис:</label>
                  <input type="text" maxlength="25" v-model="payment.description" id="prepayment">
                </div>

                <div class="item date">
                  <label for="date">Дата:</label>
                  <input type="datetime-local"
                    :value="payment.date_of_pay"
                    @input="updateDateOfPay($event.target.value)"
                    id="date"
                  >
                  <div class="error">
                      {{ error }}
                  </div>
                </div>
              </div>

              <div class="buttons">
                  <button class="close" @click="showModal = false">закрити</button>
                  <button class="add" @click="addPaymentLocaly">додати</button>
              </div>
            </div>
          </template>
      </ModalWindow>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ModalWindow from '../components/ModalWindow'

export default {
  name: 'Folder',
  data: () => ({
    from: '',
    to: '',
    tableHeader: [
      { name: "ID", obj: "id", type: "string", order: "top" },
      { name: "Сумма", obj: "summ", type: "number", order: "top" },
      { name: "Опис", obj: "description", type: "string", order: "top" },
      { name: "Дата", obj: "date_of_pay", type: "date", order: "top" }
    ],
    typeOfSort: { name: "Сумма", obj: "summ", type: "number", order: "top" },
    search: "",
    showModal: false,
    payment: { summ: null, description: "", date_of_pay: "", worker: Number },
    error: "",
    adding: true,
  }),
  filters: {
      handleDate(val) {
          return new Date(val).toGMTString()
      }
  },
  methods: {
    ...mapMutations(['addPayment']),
    changeTypeOfPrepayments(type) {
      if ( !this.forbid ) {
        this.$emit('changeTypeOfPrepayments', type)
      }
    },
    updateDateOfPay(value) {
      this.payment.date_of_pay = value
      this.$emit('input', value);
    },
    updateFromTo(value, obj) {
      this[obj] = value
      this.$emit('input', value);
    },
    addPaymentDB(data) {
      return new Promise((resolve, reject) => {
        fetch(`${this.uri}/prepayments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.text())
        .then((data) => {
          try {
            resolve(JSON.parse(data))
          } catch(err) {
            reject(err)
          }
        })
      });
    },
    addPaymentLocaly() {
        if ( this.adding ) {
            this.adding = false
            const { summ, description, date_of_pay } = this.payment
            if ( summ != undefined && description.length && date_of_pay ) {
              let payment = JSON.parse(JSON.stringify(this.payment))
              payment.worker = this.info.personId
              
              this.addPaymentDB(payment)
              .then((data) => {
                this.addPayment({
                  folderTitle: this.info.folderTitle,
                  personId: this.info.personId,
                  payment: JSON.parse(JSON.stringify(data))
                })
  
                this.showModal = false
        
                this.payment.summ = Number
                this.payment.description = ""
                this.payment.date_of_pay = ""
                this.adding = true
              })
              .catch(err => {
                console.error(err)
              })
            } else {
              this.setError('всі поля повинні бути заповнені')
              this.adding = true
            }
        }
    },
    setError(text) {
      this.error = text
      setTimeout(() => {
          this.error = ""
      }, 5000)
    },
    changeSort(typeOfSort) {
      if ( this.typeOfSort.obj === typeOfSort.obj ) {
        this.typeOfSort.order = this.typeOfSort.order === 'top' ? 'down' : 'top'
      } else {
        typeOfSort.order = 'top'
        this.typeOfSort = typeOfSort
      }
    }
  },
  computed: {
    ...mapGetters(['uri']),
    sortedPrepayments() {
      if ( this.prepayments ) {
        let prepayments = this.prepayments.filter(payment => (
          (
            payment.summ.toString().toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
            payment.description.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
            payment.date_of_pay.toLowerCase().trim().includes(this.search.toLowerCase().trim())
          )
          &&
          (
            ( Date.parse(payment.date_of_pay) - Date.parse(this.from) >= 0 || !Date.parse(this.from) ) &&
            ( Date.parse(this.to) - Date.parse(payment.date_of_pay) >= 0 || !Date.parse(this.to) )
          )
        ))

        if ( this.typeOfSort.type === 'date' ) {
          prepayments.sort((a,b) => new Date(b[this.typeOfSort.obj]) - new Date(a[this.typeOfSort.obj]));
          prepayments = this.typeOfSort.order === 'down' ? prepayments.reverse() : prepayments
        } else if ( this.typeOfSort.type === 'number' ) {
          prepayments.sort((a, b) => a[this.typeOfSort.obj] > b[this.typeOfSort.obj])
          prepayments = this.typeOfSort.order === 'down' ? prepayments.reverse() : prepayments
        } else if ( this.typeOfSort.type === 'string' ) {
          prepayments.sort((a, b) => `${a[this.typeOfSort.obj]}`.localeCompare(`${b[this.typeOfSort.obj]}`))
          prepayments = this.typeOfSort.order === 'down' ? prepayments.reverse() : prepayments
        }

        return prepayments
      } else {
        return []
      }
    },
  },
  props: {
      prepayments: Array,
      info: Object,
      typeOfPrepayments: Boolean,
      forbid: {
        default: false,
        type: Boolean
      }
  },
  components: {
    ModalWindow,
  }
};
</script>

<style lang="scss" scoped>
.list {
  margin: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  .tags {
    display: flex;
    button {
      border-radius: 3px 3px 0 0;
      margin: 2px 5px 0 0;
      height: 20px;
      &:hover {
        border-color: white;
      }
    }
    .active {
      background: var(--main-color);
      color: white;
    }
  }
}
table {
  height: calc(100% - 22px);
  border-top-left-radius: 0;
}
.actions {
  .buttons {
    display: flex;
  }
}
.top {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.down {
  display: none;
}
@media only screen and (max-width: 920px) {
  .header {
    flex-direction: column;
    .actions {
      .dates {
        display: none;
      }
    }
    .down {
      width: 100%;
      display: flex;
      margin-top: 10px;
      .dates {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
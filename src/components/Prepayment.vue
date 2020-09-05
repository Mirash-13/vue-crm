<template>
  <div class="folder">
    <template v-if="prepayments">
      <div class="header">
        <div class="title">
          Prepayments
        </div>

        <div class="actions">
          <input type="search" v-model="search" >
          <v-button @click.native="showModal = true" :style="{
              height: '120%',
              width: '90px',
              fontSize: '12px'
            }"
          >
            дод. оплату
          </v-button>
        </div>
      </div>

      <div class="list">
        <table class="content-table">
          <thead>
            <tr>
              <th v-for="item in tableHeader"
                :key="`table_header_${item.obj}`"
              >
                <span class="text" @click="changeSort(item)">
                  {{ item.obj }}
                  
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
              <td>{{ payment.summ }}</td>
              <td>{{ payment.description }}</td>
              <td>{{ payment.date_of_pay }}</td>
            </tr>
          </tbody>
        </table>
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
            <div class="modal">
              <div class="title">Введіть дані: </div>
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
                  <input type="datetime-local" v-model="payment.date_of_pay" id="date">
                  <div class="error">
                      {{ error }}
                  </div>
                </div>
              </div>

              <div class="buttons">
                  <v-button :style="{ background: 'linear-gradient(90deg, #bd5252, #f0aaaa)' }" @click.native="showModal = false">закрити</v-button>
                  <v-button @click.native="addPaymentLocaly">додати</v-button>
              </div>
            </div>
          </template>
      </ModalWindow>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ModalWindow from '../components/ModalWindow'
import VButton from '../components/VButton'

export default {
  name: 'Folder',
  data: () => ({
    tableHeader: [
      { obj: "Сумма", type: "number", order: "top" },
      { obj: "Опис", type: "string", order: "top" },
      { obj: "Дата", type: "date", order: "top" }
    ],
    typeOfSort: { obj: "Сумма", type: "number", order: "top" },
    search: "",
    showModal: false,
    payment: { summ: null, description: "", date_of_pay: "", worker: Number },
    error: "",
    adding: true
  }),
  filters: {
      handleDate(val) {
          return new Date(val).toGMTString()
      }
  },
  watch: {
      prepayments(val) {
          console.log(val)
      }
  },
  methods: {
      ...mapMutations(['addPayment']),
    addPaymentLocaly() {
        if ( this.adding ) {
            this.adding = false
            const { summ, description, date_of_pay } = this.payment
            if ( summ != undefined && description.length && date_of_pay != undefined ) {
              this.addPayment({ folderTitle: this.info.folderTitle, personName: this.info.personName, payment: JSON.parse(JSON.stringify(this.payment)) })

              this.showModal = false
      
              this.payment.summ = Number
              this.payment.description = ""
              this.payment.date_of_pay = ""
              this.adding = true
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
    sortedPrepayments() {
      if ( this.prepayments ) {
        let prepayments = this.prepayments.filter(payment => (
          payment.summ.toString().toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          payment.description.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          payment.date_of_pay.toLowerCase().trim().includes(this.search.toLowerCase().trim())
        ))

        if ( this.typeOfSort.type === 'date' ) {
          prepayments.sort((a,b) => new Date(b.birth_date) - new Date(a.birth_date));
          prepayments = this.typeOfSort.order === 'down' ? prepayments.reverse() : prepayments
        } else if ( this.typeOfSort.type === 'number' ) {
          prepayments.sort((a, b) => a.name > b.name)
          prepayments = this.typeOfSort.order === 'down' ? prepayments.reverse() : prepayments
        } else if ( this.typeOfSort.type === 'string' ) {
          prepayments.sort((a, b) => a.name.localeCompare(b.name))
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
  },
  components: {
    ModalWindow,
    VButton
  }
};
</script>

<style lang="scss" scoped>
.folder {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background: #e6e6e6;
  border-radius: 8px;
  color: #1D2D36;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 25px;
      input {
        border: none;
        font-size: 12px;
        padding: 4px 8px;
        margin: 0 10px;
        height: 100%;
        width: 200px;
        box-shadow: 0 0 3px #ccc;
      }
    }
  }
  .list {
    flex-grow: 1;
    margin: 25px 0;
  }
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
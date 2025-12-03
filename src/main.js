import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css'


// PrimeVue core
import PrimeVue from 'primevue/config'

// PrimeVue services (para Toast / Confirm)
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// PrimeVue componentes globales que quieras usar
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import Menubar from 'primevue/menubar'

// Estilos de PrimeVue (tema + css base + iconos)
import 'primevue/resources/themes/saga-blue/theme.css'     // tema (puedes cambiar)
import 'primevue/resources/primevue.min.css'               // core css
import 'primeicons/primeicons.css'                         // icons
import 'primeflex/primeflex.css'                           // opcional

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true })   // ripple opcional
app.use(ToastService)
app.use(ConfirmationService)

// Registro global (opcional; también puedes importar localmente)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toast', Toast)
app.component('Menubar', Menubar)

app.mount('#app')
